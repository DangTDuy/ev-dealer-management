# UserService

This microservice provides user registration and authentication for the EV Dealer Management system.

Features:
- Register user with role (DealerStaff by default)
- Login with JWT token
- SQLite database using EF Core

Run (Windows PowerShell):

1. Restore and build
   dotnet restore; dotnet build

2. Add EF migrations (first time only)
   dotnet tool install --global dotnet-ef --version 8.0.10; dotnet ef migrations add Initial; dotnet ef database update

3. Run
   dotnet run
   
Docker (recommended for local integration):

1. Build and run with docker-compose (from repository root):

   docker compose up --build

2. The UserService will be available at http://localhost:5001

Notes on persistence:
- The compose file mounts `./UserService/data` into the container at `/app/data` so the SQLite file persists between restarts.

Configuration: `appsettings.json`
- ConnectionStrings:DefaultConnection (optional, defaults to Data Source=users.db)
- Jwt: Key, Issuer, Audience

Notes:
- This is a minimal starter for the UserService. Expand with refresh tokens, email verification, and stronger secret management for production.
