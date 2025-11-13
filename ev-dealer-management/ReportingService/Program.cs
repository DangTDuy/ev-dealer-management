using System.Text;
using System.Text.Json;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Npgsql;
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

// DbContext: prefer PostgreSQL from configuration, but fallback to SQLite for local testing
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
bool useSqlite = false;

// Allow explicit override via environment variable USE_SQLITE=true
var envUseSqlite = Environment.GetEnvironmentVariable("USE_SQLITE");
if (!string.IsNullOrEmpty(envUseSqlite) && envUseSqlite.Trim().ToLowerInvariant() == "true")
{
    useSqlite = true;
}
else
{
    // Try to detect whether Postgres is reachable. If not, fall back to SQLite.
    try
    {
        // Try opening a short-lived Npgsql connection to validate connectivity
        using var conn = new Npgsql.NpgsqlConnection(connectionString);
        conn.Open();
        conn.Close();
    }
    catch
    {
        useSqlite = true;
        Console.Error.WriteLine("Info: Postgres not reachable, falling back to SQLite for local testing. Set USE_SQLITE=false to require Postgres.");
    }
}

if (useSqlite)
{
    // Use a local file-based SQLite DB for quick local testing
    var sqlitePath = Path.Combine(AppContext.BaseDirectory, "reporting_dev.db");
    var sqliteConn = $"Data Source={sqlitePath}";
    builder.Services.AddDbContext<ReportingDbContext>(options =>
        options.UseSqlite(sqliteConn));
}
else
{
    builder.Services.AddDbContext<ReportingDbContext>(options =>
        options.UseNpgsql(connectionString));
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Apply database migrations and ensure database is created
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ReportingDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Log or ignore for now
        Console.Error.WriteLine($"Warning: could not apply database migrations: {ex.Message}");
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

// ============================================================================
// NEW API ENDPOINTS FOR SALES SUMMARY AND INVENTORY SUMMARY
// ============================================================================

// GET /api/reports/sales-summary - Lấy tất cả dữ liệu tổng hợp doanh số
app.MapGet("/api/reports/sales-summary", async (ReportingDbContext db, DateTime? fromDate, DateTime? toDate, Guid? dealerId) =>
{
    try
    {
        var query = db.SalesSummaries.AsQueryable();
        
        if (fromDate.HasValue)
            query = query.Where(s => s.Date >= fromDate.Value);
        
        if (toDate.HasValue)
            query = query.Where(s => s.Date <= toDate.Value);
        
        if (dealerId.HasValue)
            query = query.Where(s => s.DealerId == dealerId.Value);
        
        var results = await query.OrderByDescending(s => s.Date).ToListAsync();
        
        return Results.Json(new
        {
            success = true,
            count = results.Count,
            data = results
        });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in GET /api/reports/sales-summary: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("GetSalesSummary")
.WithOpenApi()
.Produces(200)
.Produces(500);

// GET /api/reports/sales-summary/{id} - Lấy chi tiết một doanh số
app.MapGet("/api/reports/sales-summary/{id}", async (Guid id, ReportingDbContext db) =>
{
    try
    {
        var salesSummary = await db.SalesSummaries.FirstOrDefaultAsync(s => s.Id == id);
        
        if (salesSummary == null)
            return Results.NotFound(new { message = "Sales summary not found" });
        
        return Results.Json(new { success = true, data = salesSummary });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in GET /api/reports/sales-summary/{id}: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("GetSalesSummaryById")
.WithOpenApi()
.Produces(200)
.Produces(404)
.Produces(500);

// GET /api/reports/inventory-summary - Lấy tất cả dữ liệu tồn kho tổng hợp
app.MapGet("/api/reports/inventory-summary", async (ReportingDbContext db, Guid? dealerId, Guid? vehicleId) =>
{
    try
    {
        var query = db.InventorySummaries.AsQueryable();
        
        if (dealerId.HasValue)
            query = query.Where(i => i.DealerId == dealerId.Value);
        
        if (vehicleId.HasValue)
            query = query.Where(i => i.VehicleId == vehicleId.Value);
        
        var results = await query.OrderByDescending(i => i.LastUpdatedAt).ToListAsync();
        
        return Results.Json(new
        {
            success = true,
            count = results.Count,
            data = results
        });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in GET /api/reports/inventory-summary: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("GetInventorySummary")
.WithOpenApi()
.Produces(200)
.Produces(500);

// GET /api/reports/inventory-summary/{id} - Lấy chi tiết một tồn kho
app.MapGet("/api/reports/inventory-summary/{id}", async (Guid id, ReportingDbContext db) =>
{
    try
    {
        var inventorySummary = await db.InventorySummaries.FirstOrDefaultAsync(i => i.Id == id);
        
        if (inventorySummary == null)
            return Results.NotFound(new { message = "Inventory summary not found" });
        
        return Results.Json(new { success = true, data = inventorySummary });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in GET /api/reports/inventory-summary/{id}: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("GetInventorySummaryById")
.WithOpenApi()
.Produces(200)
.Produces(404)
.Produces(500);

// POST /api/reports/sales-summary - Thêm dữ liệu tổng hợp doanh số mới (cho test)
app.MapPost("/api/reports/sales-summary", async (ReportingDbContext db, SalesSummary salesSummary) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(salesSummary.DealerName) || string.IsNullOrWhiteSpace(salesSummary.SalespersonName))
            return Results.BadRequest(new { message = "DealerName and SalespersonName are required" });
        
        salesSummary.Id = Guid.NewGuid();
        salesSummary.LastUpdatedAt = DateTime.UtcNow;
        
        db.SalesSummaries.Add(salesSummary);
        await db.SaveChangesAsync();
        
        return Results.Created($"/api/reports/sales-summary/{salesSummary.Id}", new { success = true, data = salesSummary });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in POST /api/reports/sales-summary: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("CreateSalesSummary")
.WithOpenApi()
.Produces(201)
.Produces(400)
.Produces(500);

// POST /api/reports/inventory-summary - Thêm dữ liệu tồn kho mới (cho test)
app.MapPost("/api/reports/inventory-summary", async (ReportingDbContext db, InventorySummary inventorySummary) =>
{
    try
    {
        if (string.IsNullOrWhiteSpace(inventorySummary.VehicleName) || string.IsNullOrWhiteSpace(inventorySummary.DealerName))
            return Results.BadRequest(new { message = "VehicleName and DealerName are required" });
        
        inventorySummary.Id = Guid.NewGuid();
        inventorySummary.LastUpdatedAt = DateTime.UtcNow;
        
        db.InventorySummaries.Add(inventorySummary);
        await db.SaveChangesAsync();
        
        return Results.Created($"/api/reports/inventory-summary/{inventorySummary.Id}", new { success = true, data = inventorySummary });
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in POST /api/reports/inventory-summary: {ex.Message}");
        return Results.Json(new { success = false, error = ex.Message }, statusCode: 500);
    }
})
.WithName("CreateInventorySummary")
.WithOpenApi()
.Produces(201)
.Produces(400)
.Produces(500);

// ============================================================================
// END OF NEW API ENDPOINTS
// ============================================================================

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
