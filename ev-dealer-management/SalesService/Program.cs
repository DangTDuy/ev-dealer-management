using SalesService.Data;
// Removed: using SalesService.BackgroundServices; // No longer needed
// Removed: using SalesService.Services; // No longer needed as IMessageProducer and RabbitMQProducerService are removed
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using QuestPDF.Infrastructure; // Required for LicenseType

var builder = WebApplication.CreateBuilder(args);

// Configure QuestPDF license
QuestPDF.Settings.License = LicenseType.Community;

// NOTE: older QuestPDF font registration APIs changed in newer versions.
// The explicit `FontManager.RegisterTag(...)` and `Font.FromFile(...)`
// calls were removed because they reference APIs not present in the
// project QuestPDF version. If you need custom fonts, register them
// using the QuestPDF recommended approach for your package version.


// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging());

// Removed: Register IMessageProducer for RabbitMQ
// Removed: builder.Services.AddSingleton<SalesService.Services.IMessageProducer, RabbitMQProducerService>();

// Removed: Register Background Consumer
// Removed: builder.Services.AddHostedService<SalesEventConsumer>();

var app = builder.Build();

// Log the database file path after app is built
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<SalesDbContext>();
        var connection = dbContext.Database.GetDbConnection();
        if (connection is SqliteConnection sqliteConnection)
        {
            Console.WriteLine($"[SalesDbContext] SQLite database file path: {sqliteConnection.DataSource}");
        }
        else
        {
            Console.WriteLine($"[SalesDbContext] Database connection type: {connection.GetType().Name}. Could not determine SQLite file path.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SalesDbContext] Error getting database context or connection string: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
