using Microsoft.AspNetCore.Builder;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.Extensions.Configuration; // Add this for ConfigurationBuilder

var builder = WebApplication.CreateBuilder(args);

// Create an in-memory configuration for Ocelot
var ocelotConfiguration = new ConfigurationBuilder()
    .AddInMemoryCollection(new Dictionary<string, string>
    {
        { "Routes:0:UpstreamPathTemplate", "/api/users/{everything}" },
        { "Routes:0:UpstreamHttpMethod:0", "GET" },
        { "Routes:0:UpstreamHttpMethod:1", "POST" },
        { "Routes:0:UpstreamHttpMethod:2", "PUT" },
        { "Routes:0:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:0:DownstreamPathTemplate", "/api/users/{everything}" },
        { "Routes:0:DownstreamScheme", "http" },
        { "Routes:0:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:0:DownstreamHostAndPorts:0:Port", "7001" },

        { "Routes:1:UpstreamPathTemplate", "/api/Orders" },
        { "Routes:1:UpstreamHttpMethod:0", "GET" },
        { "Routes:1:DownstreamPathTemplate", "/api/Orders" },
        { "Routes:1:DownstreamScheme", "http" },
        { "Routes:1:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:1:DownstreamHostAndPorts:0:Port", "5003" },

        { "Routes:2:UpstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:2:UpstreamHttpMethod:0", "GET" },
        { "Routes:2:UpstreamHttpMethod:1", "POST" },
        { "Routes:2:UpstreamHttpMethod:2", "PUT" },
        { "Routes:2:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:2:DownstreamPathTemplate", "/api/vehicles/{everything}" },
        { "Routes:2:DownstreamScheme", "http" },
        { "Routes:2:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:2:DownstreamHostAndPorts:0:Port", "5068" }, // Updated port for VehicleService

        { "Routes:3:UpstreamPathTemplate", "/api/customers/{everything}" },
        { "Routes:3:UpstreamHttpMethod:0", "GET" },
        { "Routes:3:UpstreamHttpMethod:1", "POST" },
        { "Routes:3:UpstreamHttpMethod:2", "PUT" },
        { "Routes:3:UpstreamHttpMethod:3", "DELETE" },
        { "Routes:3:DownstreamPathTemplate", "/api/customers/{everything}" },
        { "Routes:3:DownstreamScheme", "http" },
        { "Routes:3:DownstreamHostAndPorts:0:Host", "localhost" },
        { "Routes:3:DownstreamHostAndPorts:0:Port", "5039" }, // Updated port for CustomerService

        { "GlobalConfiguration:BaseUrl", "http://localhost:5036" }
    })
    .Build();

// Add Ocelot configuration from the in-memory configuration
builder.Services.AddOcelot(ocelotConfiguration);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            // Allow common dev ports used by Vite (5173, 5174, 5175)
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS - This must be before UseOcelot()
app.UseCors("AllowFrontend");

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
