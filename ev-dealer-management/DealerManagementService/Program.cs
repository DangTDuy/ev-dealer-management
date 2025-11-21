using DealerManagementService.BackgroundServices;
using DealerManagementService.Data;
using DealerManagementService.Messaging;
using DealerManagementService.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=dealers.db";

builder.Services.AddDbContext<DealerDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddScoped<IDealerService, DealerService>();
builder.Services.AddSingleton<IMessageProducer, RabbitMQProducer>();
builder.Services.AddHostedService<DealerEventConsumer>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<DealerDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Warning: could not apply database migrations: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
