# UserService

This microservice provides user registration and authentication for the EV Dealer Management system.

## ✨ Features

### Authentication
- ✅ Register user with role (DealerStaff by default)
- ✅ Login with JWT token
- ✅ **Password Reset (Forgot Password)**
- ✅ User management (CRUD operations)
- ✅ Role-based access control

### Password Reset Flow
- ✅ Forgot Password API - Generate secure reset token
- ✅ Reset Password API - Verify token and update password
- ✅ Email service with MailKit (SMTP support)
- ✅ Token expiry (1 hour)
- ✅ One-time use tokens
- ✅ Security best practices (no email enumeration, token invalidation)

### Database
- SQLite database using EF Core
- Auto-migrations on startup

## 🚀 Quick Start

### Run (Windows PowerShell):

1. **Restore and build**
   ```powershell
   dotnet restore
   dotnet build
   ```

2. **Apply migrations** (first time only)
   ```powershell
   dotnet tool install --global dotnet-ef --version 8.0.10
   dotnet ef database update
   ```

3. **Run the service**
   ```powershell
   dotnet run
   ```

   Service will be available at: `http://localhost:5223`

### Password Reset Setup

See **[QUICK_START_PASSWORD_RESET.md](./QUICK_START_PASSWORD_RESET.md)** for 5-minute setup guide.

For detailed documentation: **[PASSWORD_RESET_GUIDE.md](./PASSWORD_RESET_GUIDE.md)**
   
Docker (recommended for local integration):

1. Build and run with docker-compose (from repository root):

   docker compose up --build

2. The UserService will be available at http://localhost:5001

Notes on persistence:
- The compose file mounts `./UserService/data` into the container at `/app/data` so the SQLite file persists between restarts.

## ⚙️ Configuration

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=users.db"
  },
  "Jwt": {
    "Key": "YourSecretKey",
    "Issuer": "evm.local",
    "Audience": "evm.local"
  },
  "FrontendUrl": "http://localhost:5173",
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUser": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "your-email@gmail.com",
    "FromName": "EV Dealer Management",
    "EnableSsl": true
  }
}
```

See `.env.example` for more configuration options.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/users/me` - Get current user info (requires auth)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `PUT /api/users/{id}/role` - Change user role (Admin only)

## 🧪 Testing

Use the provided HTTP files:
- `UserService.http` - General API testing
- `PasswordReset.http` - Password reset flow testing

Or use cURL:
```bash
# Forgot Password
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset Password
curl -X POST http://localhost:5223/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token","newPassword":"NewPassword123"}'
```

## 📚 Documentation

- **[PASSWORD_RESET_GUIDE.md](./PASSWORD_RESET_GUIDE.md)** - Complete password reset documentation
- **[QUICK_START_PASSWORD_RESET.md](./QUICK_START_PASSWORD_RESET.md)** - 5-minute setup guide
- **[.env.example](./.env.example)** - Environment configuration examples

## 🐳 Docker

Build and run with docker-compose (from repository root):

```bash
docker compose up --build
```

The UserService will be available at `http://localhost:5001`

**Notes on persistence:**
- The compose file mounts `./UserService/data` into the container at `/app/data` so the SQLite file persists between restarts.

## 🔒 Security Notes

- Passwords are hashed with BCrypt
- JWT tokens for authentication
- Password reset tokens expire in 1 hour
- Tokens are one-time use only
- No email enumeration (always returns success)
- Rate limiting recommended for production

## 📝 TODO for Production

- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Implement rate limiting
- [ ] Use stronger secret management (Azure Key Vault, AWS Secrets Manager)
- [ ] Switch to production-grade email service (SendGrid, AWS SES)
- [ ] Add audit logging
- [ ] Implement session revocation after password reset
- [ ] Add CAPTCHA for forgot password form
