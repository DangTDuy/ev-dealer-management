using SalesService.BackgroundServices;
<<<<<<< HEAD
using SalesService.Data;
using SalesService.Messaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
=======
using SalesService.Services;
>>>>>>> cbe64c56a5e561b432393d9ee6c4eac729f9aaf1

var builder = WebApplication.CreateBuilder(args);

// REMOVED: Add CORS services
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend",
//         policy =>
//         {
//             policy.WithOrigins("http://localhost:5173") // Allow your frontend origin
//                   .AllowAnyHeader()
//                   .AllowAnyMethod()
//                   .AllowCredentials(); // If you're using cookies/authentication
//         });
// });

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

<<<<<<< HEAD
// Configure DbContext
builder.Services.AddDbContext<SalesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, LogLevel.Information)
           .EnableSensitiveDataLogging());

// Register IMessageProducer for RabbitMQ
builder.Services.AddSingleton<IMessageProducer, RabbitMQProducer>();

=======
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

// Register RabbitMQ Producer
builder.Services.AddSingleton<IMessageProducer, RabbitMQProducerService>();

// Register Background Consumer
>>>>>>> cbe64c56a5e561b432393d9ee6c4eac729f9aaf1
builder.Services.AddHostedService<SalesEventConsumer>();

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

<<<<<<< HEAD
// REMOVED: Use CORS policy
// app.UseCors("AllowFrontend");
=======
// Use CORS
app.UseCors("AllowFrontend");
>>>>>>> cbe64c56a5e561b432393d9ee6c4eac729f9aaf1

app.MapControllers();

app.Run();
