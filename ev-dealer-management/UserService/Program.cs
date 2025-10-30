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
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

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
builder.Services.AddScoped<IUserService, UserServiceImpl>();

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
app.UseCors("AllowFrontend");
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

app.MapGet("/api/users/me", [Microsoft.AspNetCore.Authorization.Authorize] async (System.Security.Claims.ClaimsPrincipal user, IUserService userService) =>
{
    var userIdClaim = user.FindFirst("id")?.Value;
    if (!int.TryParse(userIdClaim, out var userId))
        return Results.Unauthorized();

    var result = await userService.GetUserByIdAsync(userId);
    return result.Success ? Results.Ok(result.User) : Results.NotFound(result.Message);
});

// User management endpoints - Admin only
app.MapGet("/api/users", [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")] async (IUserService userService) =>
{
    var result = await userService.GetUsersAsync();
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.MapGet("/api/users/{id:int}", [Microsoft.AspNetCore.Authorization.Authorize] async (int id, System.Security.Claims.ClaimsPrincipal user, IUserService userService) =>
{
    var currentUserRole = user.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
    var currentUserIdClaim = user.FindFirst("id")?.Value;
    if (!int.TryParse(currentUserIdClaim, out var currentUserId))
        return Results.Unauthorized();

    // Allow self-view or admin view
    if (currentUserRole != "Admin" && currentUserId != id)
        return Results.Forbid();

    var result = await userService.GetUserByIdAsync(id);
    return result.Success ? Results.Ok(result) : Results.NotFound(result.Message);
});

app.MapPut("/api/users/{id:int}", [Microsoft.AspNetCore.Authorization.Authorize] async (int id, UpdateUserRequest request, System.Security.Claims.ClaimsPrincipal user, IUserService userService) =>
{
    var currentUserRole = user.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
    var currentUserIdClaim = user.FindFirst("id")?.Value;
    if (!int.TryParse(currentUserIdClaim, out var currentUserId))
        return Results.Unauthorized();

    var result = await userService.UpdateUserAsync(id, request, currentUserRole, currentUserId);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.MapDelete("/api/users/{id:int}", [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")] async (int id, System.Security.Claims.ClaimsPrincipal user, IUserService userService) =>
{
    var currentUserRole = user.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";

    var result = await userService.DeleteUserAsync(id, currentUserRole);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.MapPut("/api/users/{id:int}/role", [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")] async (int id, ChangeRoleRequest request, System.Security.Claims.ClaimsPrincipal user, IUserService userService) =>
{
    var currentUserRole = user.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";

    var result = await userService.ChangeUserRoleAsync(id, request, currentUserRole);
    return result.Success ? Results.Ok(result) : Results.BadRequest(result);
});

app.Run();

// DTOs and minimal implementations
public record RegisterRequest(string Username, string Email, string FullName, string Password, string Role = "DealerStaff");
public record LoginRequest(string Username, string Password);
public record UserDto(int Id, string Username, string Email, string FullName, string Role, bool IsActive, DateTime CreatedAt, DateTime UpdatedAt);
public record UpdateUserRequest(string Email, string FullName);
public record ChangeRoleRequest(string Role);

public record AuthResult(bool Success, string Message, string? Token = null, int? UserId = null);
public record UserListResult(bool Success, string Message, IEnumerable<UserDto>? Users = null);
public record UserResult(bool Success, string Message, UserDto? User = null);

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
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role { get; set; } = "DealerStaff";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public interface IUserService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<UserListResult> GetUsersAsync();
    Task<UserResult> GetUserByIdAsync(int id);
    Task<UserResult> UpdateUserAsync(int id, UpdateUserRequest request, string currentUserRole, int currentUserId);
    Task<UserResult> DeleteUserAsync(int id, string currentUserRole);
    Task<UserResult> ChangeUserRoleAsync(int id, ChangeRoleRequest request, string currentUserRole);
}

public class UserServiceImpl : IUserService
{
    private readonly UserDbContext _db;
    private readonly IConfiguration _cfg;
    public UserServiceImpl(UserDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.FullName))
            return new AuthResult(false, "All fields are required");

        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return new AuthResult(false, "Username already exists");

        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return new AuthResult(false, "Email already exists");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
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

    public async Task<UserListResult> GetUsersAsync()
    {
        var users = await _db.Users
            .Where(u => u.IsActive)
            .Select(u => new UserDto(u.Id, u.Username, u.Email, u.FullName, u.Role, u.IsActive, u.CreatedAt, u.UpdatedAt))
            .ToListAsync();

        return new UserListResult(true, "Users retrieved successfully", users);
    }

    public async Task<UserResult> GetUserByIdAsync(int id)
    {
        var user = await _db.Users
            .Where(u => u.Id == id && u.IsActive)
            .Select(u => new UserDto(u.Id, u.Username, u.Email, u.FullName, u.Role, u.IsActive, u.CreatedAt, u.UpdatedAt))
            .FirstOrDefaultAsync();

        if (user == null)
            return new UserResult(false, "User not found");

        return new UserResult(true, "User retrieved successfully", user);
    }

    public async Task<UserResult> UpdateUserAsync(int id, UpdateUserRequest request, string currentUserRole, int currentUserId)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.FullName))
            return new UserResult(false, "Email and full name are required");

        // Only allow self-update or admin update
        if (currentUserRole != "Admin" && currentUserId != id)
            return new UserResult(false, "Unauthorized to update this user");

        var user = await _db.Users.FindAsync(id);
        if (user == null || !user.IsActive)
            return new UserResult(false, "User not found");

        // Check if email is already taken by another user
        if (await _db.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            return new UserResult(false, "Email already exists");

        user.Email = request.Email;
        user.FullName = request.FullName;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var userDto = new UserDto(user.Id, user.Username, user.Email, user.FullName, user.Role, user.IsActive, user.CreatedAt, user.UpdatedAt);
        return new UserResult(true, "User updated successfully", userDto);
    }

    public async Task<UserResult> DeleteUserAsync(int id, string currentUserRole)
    {
        if (currentUserRole != "Admin")
            return new UserResult(false, "Only admins can delete users");

        var user = await _db.Users.FindAsync(id);
        if (user == null || !user.IsActive)
            return new UserResult(false, "User not found");

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new UserResult(true, "User deleted successfully");
    }

    public async Task<UserResult> ChangeUserRoleAsync(int id, ChangeRoleRequest request, string currentUserRole)
    {
        if (currentUserRole != "Admin")
            return new UserResult(false, "Only admins can change user roles");

        var validRoles = new[] { "DealerStaff", "DealerManager", "EVMStaff", "Admin", "Customer" };
        if (!validRoles.Contains(request.Role))
            return new UserResult(false, "Invalid role");

        var user = await _db.Users.FindAsync(id);
        if (user == null || !user.IsActive)
            return new UserResult(false, "User not found");

        user.Role = request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var userDto = new UserDto(user.Id, user.Username, user.Email, user.FullName, user.Role, user.IsActive, user.CreatedAt, user.UpdatedAt);
        return new UserResult(true, "User role updated successfully", userDto);
    }
}
