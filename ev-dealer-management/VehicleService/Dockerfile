# Use the official .NET 8 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["VehicleService.csproj", "./"]
RUN dotnet restore "VehicleService.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
RUN dotnet build "VehicleService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "VehicleService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official .NET 8 runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port 80
EXPOSE 80

# Set the entry point
ENTRYPOINT ["dotnet", "VehicleService.dll"]
