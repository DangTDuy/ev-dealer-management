using System.Text;
using System.Text.Json;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using ev_dealer_reporting.Data;
using System.IO;
using ev_dealer_reporting.Models;

var builder = WebApplication.CreateBuilder(args);

// Load configuration files and environment
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                   .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                   .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - allow local frontend during development
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

// DbContext - use SQLite file. Connection string comes from configuration or defaults to local file
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=reporting.db";
builder.Services.AddDbContext<ReportingDbContext>(options =>
    options.UseSqlite(defaultConn)
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Ensure DB directory exists when using a file path
try
{
    var conn = app.Services.GetRequiredService<Microsoft.Extensions.Configuration.IConfiguration>().GetConnectionString("DefaultConnection");
    if (!string.IsNullOrEmpty(conn) && conn.Contains("Data Source="))
    {
        var path = conn.Split('=')[1].Trim();
        var dir = Path.GetDirectoryName(path);
        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
    }
}
catch { /* best-effort only */ }

// Apply database creation (EnsureCreated for initial MVP — safe and won't drop existing DB)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ReportingDbContext>();
        db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        // Log or ignore for now — creating DB is best-effort in this patch
        Console.Error.WriteLine($"Warning: could not ensure reporting DB created: {ex.Message}");
    }
}

// --- Mock data used by reporting endpoints (MVP) ---
var regionalData = new[]
{
    new { region = "Miền Bắc", sales = 450, revenue = 12500000000L },
    new { region = "Miền Trung", sales = 280, revenue = 8000000000L },
    new { region = "Miền Nam", sales = 620, revenue = 16000000000L }
};

var topVehicles = new[]
{
    new { model = "Tesla Model 3", sales = 45, revenue = "1.2B VNĐ" },
    new { model = "BMW i3", sales = 32, revenue = "800M VNĐ" },
    new { model = "Audi e-tron", sales = 28, revenue = "1.5B VNĐ" },
    new { model = "Mercedes EQC", sales = 25, revenue = "1.8B VNĐ" },
    new { model = "Porsche Taycan", sales = 18, revenue = "2.1B VNĐ" }
};

// Simple summary endpoint
app.MapGet("/api/reports/summary", (string? type, string? from, string? to) =>
{
    var metrics = new
    {
        totalSales = 1350,
        totalRevenue = 36500000000L,
        activeDealers = 24,
        conversionRate = 0.052
    };

    var result = new
    {
        type = type ?? "sales",
        from,
        to,
        metrics
    };

    return Results.Json(result);
})
.WithName("GetReportSummary")
.WithOpenApi();

// Sales by region (for bar chart)
app.MapGet("/api/reports/sales-by-region", (string? from, string? to) =>
{
    // In a real implementation we'd call SalesService or query a reporting DB and filter by dates.
    return Results.Json(regionalData);
})
.WithName("GetSalesByRegion")
.WithOpenApi();

// Top vehicles
app.MapGet("/api/reports/top-vehicles", (int? limit) =>
{
    var l = limit.HasValue && limit.Value > 0 ? Math.Min(limit.Value, topVehicles.Length) : topVehicles.Length;
    return Results.Json(topVehicles.Take(l));
})
.WithName("GetTopVehicles")
.WithOpenApi();

// Simple export endpoint (returns CSV) - synchronous small export for MVP
app.MapPost("/api/reports/export", async (HttpRequest req, ReportingDbContext? db) =>
{
    using var sr = new StreamReader(req.Body, Encoding.UTF8);
    var body = await sr.ReadToEndAsync();
    // Try to parse payload for type/format (best-effort)
    string type = "sales";
    string format = "csv";
    DateTime? fromDate = null;
    DateTime? toDate = null;
    try
    {
        var doc = JsonDocument.Parse(body);
        if (doc.RootElement.TryGetProperty("type", out var t)) type = t.GetString() ?? type;
        if (doc.RootElement.TryGetProperty("format", out var f)) format = f.GetString() ?? format;
        if (doc.RootElement.TryGetProperty("from", out var fr) && fr.GetString() is string frs && DateTime.TryParse(frs, out var fd)) fromDate = fd;
        if (doc.RootElement.TryGetProperty("to", out var toEl) && toEl.GetString() is string tos && DateTime.TryParse(tos, out var td)) toDate = td;
    }
    catch
    {
        // ignore parse errors and use defaults
    }

    // For MVP create a simple CSV from topVehicles
    var csvBuilder = new StringBuilder();
    csvBuilder.AppendLine("model,sales,revenue");
    foreach (var v in topVehicles)
    {
        csvBuilder.AppendLine($"{v.model},{v.sales},{v.revenue}");
    }

    var bytes = Encoding.UTF8.GetBytes(csvBuilder.ToString());
    var filename = $"report_{type}_{DateTime.UtcNow:yyyyMMddHHmmss}.csv";

    // If a DB is available, persist a ReportRequest and ReportExport record (best-effort)
    try
    {
        if (db != null)
        {
            var reqEntity = new ReportRequest
            {
                Type = type,
                From = fromDate,
                To = toDate,
                RequestedBy = "system",
                Status = "Completed",
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow
            };
            db.ReportRequests.Add(reqEntity);
            await db.SaveChangesAsync();

            var exportEntity = new ReportExport
            {
                ReportRequestId = reqEntity.Id,
                FileName = filename,
                ContentType = "text/csv",
                SizeBytes = bytes.Length,
                CreatedAt = DateTime.UtcNow
            };
            db.ReportExports.Add(exportEntity);
            await db.SaveChangesAsync();
        }
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Warning: failed to save export metadata: {ex.Message}");
    }

    return Results.File(bytes, "text/csv", filename);
})
.WithName("ExportReport")
.WithOpenApi();

// Keep the sample weather endpoint for parity with template
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
