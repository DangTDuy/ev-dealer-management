# 🚀 Quick Start - Password Reset Feature

## ⚡ Cài đặt nhanh (5 phút)

### Bước 1: Restore packages
```bash
cd ev-dealer-management/UserService
dotnet restore
```

### Bước 2: Apply migrations
```bash
dotnet ef database update
```

### Bước 3: Cấu hình Email (Optional)

#### Option A: Development Mode (Log to Console)
Không cần cấu hình gì, email sẽ được log ra console.

#### Option B: Gmail SMTP
Chỉnh sửa `appsettings.json`:
```json
{
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

**Lấy Gmail App Password:**
1. Vào https://myaccount.google.com/apppasswords
2. Chọn "Mail" → "Other (Custom name)"
3. Copy password 16 ký tự

### Bước 4: Chạy service
```bash
dotnet run
```

Service sẽ chạy tại: `http://localhost:5223`

---

## 🧪 Test nhanh

### Test 1: Forgot Password
```bash
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}'
```

**Kết quả:**
- Nếu SMTP configured: Email được gửi
- Nếu không: Check console logs để lấy reset link

### Test 2: Reset Password
```bash
# Lấy token từ email hoặc console logs
curl -X POST http://localhost:5223/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE","newPassword":"NewPassword123"}'
```

---

## 📋 Checklist

- [x] Entity `PasswordResetToken` đã được tạo
- [x] Migration đã được apply
- [x] API endpoints `/forgot-password` và `/reset-password` hoạt động
- [x] Email service với MailKit
- [x] Security best practices (token expiry, one-time use, etc.)
- [ ] Cấu hình SMTP (optional)
- [ ] Frontend integration
- [ ] Rate limiting (recommended)

---

## 🎯 Next Steps

### 1. Frontend Integration
Tạo 2 pages trong React:
- `/forgot-password` - Form nhập email
- `/reset-password?token=xxx` - Form nhập password mới

Xem chi tiết trong `PASSWORD_RESET_GUIDE.md` → Frontend Integration

### 2. Production Setup
- [ ] Sử dụng SendGrid hoặc AWS SES thay vì Gmail
- [ ] Thêm rate limiting
- [ ] Enable HTTPS
- [ ] Cấu hình proper CORS
- [ ] Add audit logging

### 3. Security Enhancements
- [ ] Implement rate limiting (5 requests/hour per IP)
- [ ] Hash tokens trong database
- [ ] Revoke JWT sessions sau khi reset password
- [ ] Add email verification requirement
- [ ] Implement CAPTCHA cho forgot password form

---

## 📚 Documentation

- **Full Guide:** `PASSWORD_RESET_GUIDE.md`
- **API Testing:** `PasswordReset.http`
- **Environment Config:** `.env.example`

---

## 🐛 Common Issues

### Issue: "SMTP not configured"
**Solution:** Email sẽ được log ra console. Check terminal output để lấy reset link.

### Issue: "Invalid or expired reset token"
**Solution:** 
- Token có thời hạn 1 giờ
- Token chỉ dùng được 1 lần
- Request forgot-password lại để lấy token mới

### Issue: Migration errors
**Solution:**
```bash
# Remove old migrations
rm -rf Migrations/

# Create fresh migration
dotnet ef migrations add Initial
dotnet ef database update
```

---

## 💡 Tips

1. **Development Mode:** Để SMTP trống để log reset links ra console
2. **Testing:** Dùng file `PasswordReset.http` với REST Client extension
3. **Database:** Dùng SQLite browser để xem bảng `PasswordResetTokens`
4. **Logs:** Check console để debug email sending issues

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Console logs
2. Database có bảng `PasswordResetTokens` chưa
3. SMTP credentials đúng chưa
4. Port 5223 có bị block không

---

## ✅ Verification

Để verify tất cả hoạt động đúng:

```bash
# 1. Check service running
curl http://localhost:5223/api/users

# 2. Test forgot password
curl -X POST http://localhost:5223/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# 3. Check database
sqlite3 users.db "SELECT * FROM PasswordResetTokens;"
```

---

**Chúc mừng! 🎉 Password Reset feature đã sẵn sàng!**

