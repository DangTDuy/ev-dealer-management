# 🚀 SalesService - Test Order Confirmation Email

## ✅ Đã Làm Gì?

1. **Tạo DTOs:**
   - `SaleCompletedEvent.cs` - Event gửi đến RabbitMQ
   - `CreateOrderRequest.cs` - Request body cho API

2. **Tạo Services:**
   - `IMessageProducer.cs` - Interface
   - `RabbitMQProducerService.cs` - Publish messages to queues

3. **Tạo Controller:**
   - `OrdersController.cs` - API endpoint POST /api/orders/complete

4. **Cấu Hình:**
   - Cập nhật `appsettings.json` với RabbitMQ config
   - Đăng ký services trong `Program.cs`

---

## 🎯 Test Ngay

### Bước 1: Build & Start SalesService

```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\SalesService
dotnet build
dotnet run
```

Service sẽ chạy trên: **http://localhost:5003** (hoặc port được config)

---

### Bước 2: Test API Endpoint

#### Option A: PowerShell
```powershell
$body = @{
    customerName = "Nguyen Van Test"
    customerEmail = "test@example.com"
    vehicleModel = "VinFast VF 8"
    totalAmount = 850000000
    paymentMethod = "Bank Transfer"
    quantity = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5003/api/orders/complete" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

#### Option B: curl
```powershell
curl -X POST http://localhost:5003/api/orders/complete `
  -H "Content-Type: application/json" `
  -d '{
    "customerName": "Nguyen Van Test",
    "customerEmail": "test@example.com",
    "vehicleModel": "VinFast VF 8",
    "totalAmount": 850000000,
    "paymentMethod": "Bank Transfer",
    "quantity": 1
  }'
```

---

### Bước 3: Kiểm Tra Kết Quả

#### ✅ API Response
```json
{
  "success": true,
  "message": "Order completed successfully. Confirmation email will be sent shortly.",
  "orderId": "ORD-20251122-A1B2C3D4",
  "customerEmail": "test@example.com"
}
```

#### ✅ SalesService Log
```
[INFO] Published message to queue sales.completed: {"OrderId":"ORD-...","CustomerName":"Nguyen Van Test",...}
[INFO] Order ORD-20251122-A1B2C3D4 completed for customer test@example.com
```

#### ✅ NotificationService Log (Terminal khác)
```
[INFO] Received SaleCompletedEvent: OrderId=ORD-20251122-A1B2C3D4
[INFO] Sending order confirmation email to test@example.com
[INFO] Email sent successfully to test@example.com. MessageId: ...
```

#### ✅ Check Email (SendGrid)
Vào email `test@example.com` sẽ thấy:
```
Subject: 🎉 Order Confirmation - ORD-20251122-A1B2C3D4

Dear Nguyen Van Test,

Thank you for your order!

Order Details:
• Order ID: ORD-20251122-A1B2C3D4
• Vehicle: VinFast VF 8
• Quantity: 1
• Total: 850,000,000 VND
• Payment: Bank Transfer
• Date: 2025-11-22

We will process your order shortly.

Best regards,
EV Dealer Management Team
```

#### ✅ RabbitMQ UI
http://localhost:15672 (guest/guest)
- Tab **Queues** → `sales.completed`
- Message rates: 1 published, 1 delivered

---

## 🔄 Flow Hoàn Chỉnh

```
User/System → POST /api/orders/complete
    ↓
SalesService OrdersController
    ↓ Generate OrderId
    ↓ Create SaleCompletedEvent
    ↓ Publish to RabbitMQ queue "sales.completed"
RabbitMQ
    ↓ Route message
NotificationService SaleCompletedConsumer
    ↓ Consume event
    ↓ Send email via SendGrid
    ✅ Email delivered to customer
```

---

## 📋 Test Checklist

- [ ] SalesService build thành công
- [ ] SalesService đang chạy (port 5003)
- [ ] RabbitMQ đang chạy (port 5672)
- [ ] NotificationService đang chạy (port 5005)
- [ ] Call API POST /api/orders/complete
- [ ] API trả về success với orderId
- [ ] SalesService log "Published message"
- [ ] NotificationService log "Email sent successfully"
- [ ] Check email inbox thấy order confirmation
- [ ] RabbitMQ UI thấy message consumed

---

## 🎨 Customization

### Thay Đổi Email Template

Sửa file: `NotificationService/Services/EmailService.cs`

Method: `SendOrderConfirmationAsync()`

### Thay Đổi Port

Sửa file: `SalesService/Properties/launchSettings.json`

```json
{
  "applicationUrl": "http://localhost:5003"
}
```

---

## 🐛 Troubleshooting

### ❌ "Failed to connect to RabbitMQ"
```powershell
# Check RabbitMQ running
docker ps | findstr rabbitmq

# If not running
docker start rabbitmq
```

### ❌ "Email sending failed"
- Check SendGrid API key trong `NotificationService/appsettings.json`
- Verify email trong SendGrid dashboard
- Check NotificationService logs

### ❌ "Queue not found"
- NotificationService tự động tạo queue khi start
- Restart NotificationService
- Check RabbitMQ UI xem có queue "sales.completed" không

---

## 🎉 Success Criteria

✅ **API**: POST thành công, trả về orderId  
✅ **RabbitMQ**: Message published và consumed  
✅ **Email**: Nhận được order confirmation email  
✅ **Logs**: Cả 2 services log thành công

---

## 🚀 Next Steps

### 1️⃣ Tích Hợp Frontend (OrderDetail.jsx)
- Thêm button "Complete Order"
- Call API `/api/orders/complete`
- Show notification khi thành công

### 2️⃣ Test Drive Notifications (CustomerService)
- Publish TestDriveScheduledEvent
- Send email confirmation

### 3️⃣ API Gateway
- Add routes cho SalesService
- Load balancing

---

**Test thôi! 🎯**
