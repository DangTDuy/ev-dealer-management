# 🔐 Password Reset Feature - Complete Guide

## 📋 Mục lục
1. [Kiến trúc & Flow tổng quan](#kiến-trúc--flow-tổng-quan)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Cấu hình Email](#cấu-hình-email)
5. [Frontend Integration](#frontend-integration)
6. [Security Best Practices](#security-best-practices)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Kiến trúc & Flow tổng quan

### Flow Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │         │  UserService │         │   Database  │
│   (React)   │         │   (.NET 8)   │         │  (SQLite)   │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │ 1. POST /forgot-pwd   │                        │
       │ { email }             │                        │
       ├──────────────────────>│                        │
       │                       │ 2. Find user by email  │
       │                       ├───────────────────────>│
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │ 3. Generate token      │
       │                       │    (32 bytes random)   │
       │                       │                        │
       │                       │ 4. Save token to DB    │
       │                       │    (expires in 1h)     │
       │                       ├───────────────────────>│
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │ 5. Send email          │
       │                       │    with reset link     │
       │                       │                        │
       │ 6. Success response   │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │                       │                        │
       │ 7. User clicks link   │                        │
       │    in email           │                        │
       │                       │                        │
       │ 8. POST /reset-pwd    │                        │
       │ { token, newPassword }│                        │
       ├──────────────────────>│                        │
       │                       │ 9. Verify token        │
       │                       │    (valid & not used)  │
       │                       ├───────────────────────>│
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │ 10. Update password    │
       │                       │     Mark token as used │
       │                       ├───────────────────────>│
       │                       │<───────────────────────┤
       │                       │                        │
       │ 11. Success response  │                        │
       │<──────────────────────┤                        │
       │                       │                        │
```

### Quy trình chi tiết

#### **Bước 1: Forgot Password**
1. User nhập email vào form
2. Frontend gọi `POST /api/auth/forgot-password`
3. Backend:
   - Tìm user theo email
   - Generate secure random token (32 bytes)
   - Invalidate các token cũ chưa dùng
   - Lưu token mới vào DB (expires sau 1 giờ)
   - Gửi email chứa link reset
4. Trả về success (không tiết lộ email có tồn tại hay không)

#### **Bước 2: Reset Password**
1. User click link trong email
2. Frontend hiển thị form nhập password mới
3. Frontend gọi `POST /api/auth/reset-password`
4. Backend:
   - Verify token (hợp lệ, chưa dùng, chưa hết hạn)
   - Hash password mới
   - Update password trong DB
   - Mark token là đã dùng
5. Trả về success

---

## 🗄️ Database Schema

### Bảng: `PasswordResetTokens`

```sql
CREATE TABLE PasswordResetTokens (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Token TEXT NOT NULL,
    ExpiresAt DATETIME NOT NULL,
    IsUsed BOOLEAN NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UsedAt DATETIME NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IX_PasswordResetTokens_Token ON PasswordResetTokens(Token);
CREATE INDEX IX_PasswordResetTokens_UserId ON PasswordResetTokens(UserId);
```

### Entity Model (.NET)

```csharp
public class PasswordResetToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UsedAt { get; set; }
}
```

---

## 🔌 API Endpoints

### 1. **Forgot Password**

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

**Response Codes:**
- `200 OK` - Always (để tránh email enumeration)

**cURL Example:**
```bash
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

### 2. **Reset Password**

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "abc123xyz...",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Response Codes:**
- `200 OK` - Password reset thành công
- `400 Bad Request` - Token không hợp lệ hoặc hết hạn

**cURL Example:**
```bash
curl -X POST http://localhost:5223/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123xyz","newPassword":"NewPassword123!"}'
```

---

## 📧 Cấu hình Email

### Option 1: Gmail SMTP (Recommended for Development)

1. **Bật 2-Step Verification** trong Google Account
2. **Tạo App Password:**
   - Vào https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other (Custom name)"
   - Copy password được generate

3. **Cấu hình trong `appsettings.json`:**
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUser": "your-email@gmail.com",
    "SmtpPassword": "your-16-char-app-password",
    "FromEmail": "your-email@gmail.com",
    "FromName": "EV Dealer Management",
    "EnableSsl": true
  }
}
```

### Option 2: SendGrid (Recommended for Production)

1. **Đăng ký tài khoản SendGrid** (free tier: 100 emails/day)
2. **Tạo API Key** trong SendGrid Dashboard
3. **Cấu hình:**
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.sendgrid.net",
    "SmtpPort": 587,
    "SmtpUser": "apikey",
    "SmtpPassword": "SG.your-sendgrid-api-key",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "EV Dealer Management",
    "EnableSsl": true
  }
}
```

### Option 3: Development Mode (Log Only)

Nếu không cấu hình SMTP, email sẽ được log ra console thay vì gửi thật:

```json
{
  "EmailSettings": {
    "SmtpHost": "",
    "SmtpPort": 587,
    "SmtpUser": "",
    "SmtpPassword": ""
  }
}
```

**Console Output:**
```
warn: EmailService[0]
      SMTP not configured. Password reset link for user@example.com: 
      http://localhost:5173/reset-password?token=abc123xyz...
```

---

## 🎨 Frontend Integration

### 1. **Forgot Password Page**

**File:** `src/pages/auth/ForgotPassword.jsx`

```jsx
import { useState } from 'react';
import authService from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
```

### 2. **Reset Password Page**

**File:** `src/pages/auth/ResetPassword.jsx`

```jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await authService.resetPassword(token, newPassword);
      setMessage(response.message);
      
      if (response.success) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
```

### 3. **Auth Service Methods**

**File:** `src/services/authService.js`

```javascript
const authService = {
  // ... existing methods ...

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
```

---

## 🔒 Security Best Practices

### ✅ Đã implement

1. **Token Security:**
   - ✅ Token được generate bằng cryptographically secure random (32 bytes)
   - ✅ Token được lưu dưới dạng plain text (có thể hash nếu cần thêm security)
   - ✅ Token có thời hạn 1 giờ
   - ✅ Token chỉ dùng được 1 lần (IsUsed flag)

2. **Email Enumeration Prevention:**
   - ✅ Luôn trả về success message dù email có tồn tại hay không
   - ✅ Không tiết lộ thông tin về user existence

3. **Password Security:**
   - ✅ Password được hash bằng BCrypt
   - ✅ Minimum password length: 6 characters

4. **Token Invalidation:**
   - ✅ Tự động invalidate các token cũ khi tạo token mới
   - ✅ Token được mark là used sau khi reset thành công

### 🔐 Recommendations thêm

1. **Rate Limiting:**
```csharp
// TODO: Implement rate limiting
// Giới hạn số lần request forgot-password từ 1 IP (ví dụ: 5 lần/giờ)
```

2. **Token Hashing (Optional):**
```csharp
// Thay vì lưu token plain text, có thể hash token trong DB
var hashedToken = BCrypt.Net.BCrypt.HashPassword(token);
```

3. **Email Verification:**
```csharp
// Chỉ cho phép reset password nếu email đã verified
if (!user.EmailVerified)
    return new PasswordResetResult(false, "Email not verified");
```

4. **Session Revocation:**
```csharp
// TODO: Revoke tất cả JWT tokens của user sau khi reset password
// Yêu cầu user login lại
```

5. **Audit Logging:**
```csharp
// Log tất cả password reset attempts
_logger.LogInformation("Password reset requested for user {UserId}", user.Id);
```

---

## 🧪 Testing Guide

### Manual Testing

#### Test 1: Forgot Password - Email tồn tại

```bash
# Request
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}'

# Expected: Success message + email được gửi
```

#### Test 2: Forgot Password - Email không tồn tại

```bash
# Request
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"notexist@test.com"}'

# Expected: Cùng success message (không tiết lộ email không tồn tại)
```

#### Test 3: Reset Password - Token hợp lệ

```bash
# Request
curl -X POST http://localhost:5223/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"valid-token-here","newPassword":"NewPassword123"}'

# Expected: Success
```

#### Test 4: Reset Password - Token đã dùng

```bash
# Request (dùng lại token đã reset)
curl -X POST http://localhost:5223/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"used-token","newPassword":"AnotherPassword123"}'

# Expected: Error "Invalid or expired reset token"
```

#### Test 5: Reset Password - Token hết hạn

```bash
# Đợi > 1 giờ sau khi tạo token, hoặc modify ExpiresAt trong DB
# Expected: Error "Invalid or expired reset token"
```

---

## 🐛 Troubleshooting

### Issue 1: Email không được gửi

**Symptoms:** Không nhận được email reset password

**Solutions:**
1. Check console logs - nếu SMTP không config, link sẽ được log ra
2. Verify SMTP credentials trong `appsettings.json`
3. Check Gmail App Password (không dùng password thường)
4. Verify firewall không block port 587
5. Check spam folder

### Issue 2: Token không hợp lệ

**Symptoms:** "Invalid or expired reset token"

**Solutions:**
1. Check token có bị modify trong URL không
2. Verify token chưa hết hạn (< 1 giờ)
3. Check token chưa được dùng (IsUsed = false)
4. Query DB: `SELECT * FROM PasswordResetTokens WHERE Token = 'your-token'`

### Issue 3: Migration errors

**Symptoms:** Database migration fails

**Solutions:**
```bash
# Delete existing migrations
rm -rf Migrations/

# Create new migration
dotnet ef migrations add AddPasswordResetTokens

# Apply migration
dotnet ef database update
```

---

## 📝 Changelog

- **v1.0.0** - Initial implementation
  - Forgot Password API
  - Reset Password API
  - Email service with MailKit
  - Security best practices

