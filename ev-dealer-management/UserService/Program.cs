using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuration sections
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                   .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                   .AddEnvironmentVariables();

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext - using SQLite for simplicity
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=users.db"));

// Authentication - JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection.GetValue<string>("Key") ?? "ReplaceThisWithASecretKeyForDevelopment";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection.GetValue<string>("Issuer") ?? "evm.local",
        ValidAudience = jwtSection.GetValue<string>("Audience") ?? "evm.local",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

// Add minimal services
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Apply migrations at startup (ensure DB)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    db.Database.Migrate();
}

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/register", async (RegisterRequest req, IUserService userService) =>
{
    var result = await userService.RegisterAsync(req);
    return result.Success ? Results.Created($"/api/users/{result.UserId}", result) : Results.BadRequest(result);
});

app.MapPost("/api/auth/login", async (LoginRequest req, IUserService userService) =>
{
    var result = await userService.LoginAsync(req);
    return result.Success ? Results.Ok(result) : Results.Unauthorized();
});

app.MapGet("/api/users/me", [Microsoft.AspNetCore.Authorization.Authorize] (System.Security.Claims.ClaimsPrincipal user) =>
{
    var name = user.Identity?.Name ?? user.FindFirst("id")?.Value;
    return Results.Ok(new { Username = name });
});

app.Run();

// DTOs and minimal implementations
public record RegisterRequest(string Username, string Password, string Role = "DealerStaff");
public record LoginRequest(string Username, string Password);

public record AuthResult(bool Success, string Message, string? Token = null, int? UserId = null);

// EF Core DbContext and entities
public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(u => u.Id);
            eb.HasIndex(u => u.Username).IsUnique();
        });
    }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "DealerStaff";
}

public interface IUserService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
}

public class UserService : IUserService
{
    private readonly UserDbContext _db;
    private readonly IConfiguration _cfg;
    public UserService(UserDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return new AuthResult(false, "Username and password required");

        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return new AuthResult(false, "Username already exists");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResult(true, "User created", UserId: user.Id);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == request.Username);
        if (user == null) return new AuthResult(false, "Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return new AuthResult(false, "Invalid credentials");

        // create token
        var jwt = _cfg.GetSection("Jwt");
        var key = jwt.GetValue<string>("Key") ?? "ReplaceThisWithASecretKeyForDevelopment";
        var issuer = jwt.GetValue<string>("Issuer") ?? "evm.local";
        var audience = jwt.GetValue<string>("Audience") ?? "evm.local";

        var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(new[] {
                new System.Security.Claims.Claim("id", user.Id.ToString()),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.Username),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(8),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(descriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return new AuthResult(true, "", Token: tokenString, UserId: user.Id);
    }
}
