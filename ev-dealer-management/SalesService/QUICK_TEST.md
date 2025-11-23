# 🚀 Quick Test Guide - Complete Order Feature

## Pre-flight Checklist ✈️

Before testing, ensure these services are running:

### 1️⃣ Start RabbitMQ
```powershell
docker ps | Select-String rabbitmq
# If not running:
docker start rabbitmq
```
**Verify**: Open http://localhost:15672 (guest/guest)

### 2️⃣ Start NotificationService (Port 5051)
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService
dotnet run
```
**Verify**: 
```powershell
curl http://localhost:5051/notifications/health
```

### 3️⃣ Start SalesService (Port 5003)
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\SalesService
dotnet run
```
**Verify**: 
```powershell
curl http://localhost:5003/api/orders/health
```

### 4️⃣ Start Frontend
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend
npm run dev
```
**Verify**: Open http://localhost:5173

---

## 🎯 Test Scenario: Complete an Order

### Step 1: Navigate to Order Detail
1. Open browser: http://localhost:5173
2. Go to **Sales** page (left sidebar)
3. Click **"Xem chi tiết"** on any order in the list
4. You should see the **Order Detail** page

### Step 2: Find the Complete Order Button
1. Scroll down on the right sidebar
2. Look for **"Thao tác nhanh"** (Quick Actions) section
3. You'll see 3 buttons:
   - ⬇️ **"In đơn hàng"** (Print order) - Gray button
   - ✅ **"Hoàn tất đơn hàng"** (Complete order) - **GREEN button** ⬅️ This one!

### Step 3: Click Complete Order
1. Click the green **"Hoàn tất đơn hàng"** button
2. Watch the button text change to **"Đang xử lý..."**
3. Button background turns gray (disabled state)

### Step 4: Verify Success Indicators

#### ✅ Frontend Changes:
- [ ] Toast notification appears at top/bottom of screen
- [ ] Message shows: `"Đơn hàng hoàn tất thành công! Email xác nhận đã được gửi đến [email]. Mã đơn: ORD-20251122-XXXXXXXX"`
- [ ] Order status badge (top of page) changes to **"Hoàn thành"** (green)
- [ ] Button text changes to **"Đã hoàn tất"** (stays disabled)

#### ✅ SalesService Terminal:
```
[INFO] Order completed successfully. OrderId: ORD-20251122-XXXXXXXX
[INFO] Published message to queue: sales.completed
```

#### ✅ NotificationService Terminal:
```
[INFO] Processing SaleCompleted event for order: ORD-20251122-XXXXXXXX
[INFO] Sending order confirmation email to: customer@example.com
[INFO] Email sent successfully via SendGrid
```

#### ✅ RabbitMQ UI (http://localhost:15672):
1. Go to **Queues** tab
2. Find `sales.completed` queue
3. Check **Total** messages increased by 1
4. Check **Ready** messages = 0 (consumed)

---

## 🐛 Common Issues & Fixes

### Issue 1: Button Does Nothing
**Symptoms**: Click button, nothing happens, no toast
**Causes**:
- SalesService not running
- CORS error (check browser console)

**Fix**:
```powershell
# Check SalesService is running
netstat -ano | findstr :5003

# If not found, start it:
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\SalesService
dotnet run
```

### Issue 2: Toast Shows Error
**Symptoms**: Red toast with error message
**Causes**:
- API returned error response
- Network timeout
- Invalid request data

**Fix**:
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for error message
4. Check **Network** tab for failed request
5. Check SalesService terminal for error logs

### Issue 3: Email Not Received
**Symptoms**: Success toast shown, but no email
**Causes**:
- NotificationService not consuming messages
- SendGrid API key invalid
- Email address blocked

**Fix**:
1. Check NotificationService terminal - should show "Email sent successfully"
2. If not, check RabbitMQ UI - messages stuck in queue?
3. Check `NotificationService/appsettings.json` - valid SendGrid API key?
4. Try different email address (not example.com)

### Issue 4: Button Already Disabled
**Symptoms**: Button shows "Đã hoàn tất", can't click
**Cause**: Order status already 'completed'

**Fix**: 
- Reload page (Ctrl+R) - this resets mock data
- Or test with different order from list

---

## 📸 Expected Screenshots

### Before Clicking:
```
┌─────────────────────────────────┐
│  Thao tác nhanh                 │
├─────────────────────────────────┤
│  ⬇️  In đơn hàng                │  ← Gray
│  ✅  Hoàn tất đơn hàng          │  ← GREEN (clickable)
└─────────────────────────────────┘
```

### During Processing:
```
┌─────────────────────────────────┐
│  Thao tác nhanh                 │
├─────────────────────────────────┤
│  ⬇️  In đơn hàng                │
│  ⏳  Đang xử lý...              │  ← Gray (disabled)
└─────────────────────────────────┘
```

### After Success:
```
┌─────────────────────────────────┐
│  Thao tác nhanh                 │
├─────────────────────────────────┤
│  ⬇️  In đơn hàng                │
│  ✅  Đã hoàn tất                │  ← Gray (disabled)
└─────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ✅ Đơn hàng hoàn tất thành công!                   │
│     Email xác nhận đã được gửi đến                  │
│     customer@example.com.                           │
│     Mã đơn: ORD-20251122-A1B2C3D4                  │
└─────────────────────────────────────────────────────┘
```

---

## 🎓 Understanding the Flow

```
USER CLICKS BUTTON
      ↓
[Frontend validates email exists]
      ↓
[Show "Đang xử lý..." on button]
      ↓
[POST http://localhost:5003/api/orders/complete]
      ↓ Request Body:
      ↓ {
      ↓   "customerName": "Nguyễn Văn A",
      ↓   "customerEmail": "customer@example.com",
      ↓   "vehicleModel": "Tesla Model 3",
      ↓   "totalAmount": 1500000000,
      ↓   "paymentMethod": "Full Payment",
      ↓   "quantity": 1
      ↓ }
      ↓
[SalesService receives request]
      ↓
[Generate OrderId: ORD-YYYYMMDD-{GUID}]
      ↓
[Create SaleCompletedEvent object]
      ↓
[Publish to RabbitMQ queue: "sales.completed"]
      ↓
[Return response: { orderId, message }]
      ↓
[Frontend receives response]
      ↓
[Update order.orderInfo.status = 'completed']
      ↓
[Show success toast with OrderId]
      ↓
[Button shows "Đã hoàn tất" (disabled)]
      ↓
[Meanwhile in background...]
      ↓
[NotificationService consumes message from queue]
      ↓
[SaleCompletedConsumer processes event]
      ↓
[EmailService.SendOrderConfirmationAsync() called]
      ↓
[SendGrid API sends email]
      ↓
[Customer receives email in inbox]
      ↓
✅ COMPLETE!
```

---

## ✅ Test Checklist

Use this checklist to verify everything works:

- [ ] RabbitMQ Docker container is running
- [ ] NotificationService running on port 5051
- [ ] SalesService running on port 5003
- [ ] Frontend dev server running
- [ ] Can access Order Detail page
- [ ] Can see green "Hoàn tất đơn hàng" button
- [ ] Button changes to "Đang xử lý..." when clicked
- [ ] Success toast appears after ~1-2 seconds
- [ ] Toast message includes OrderId
- [ ] Order status badge changes to "Hoàn thành" (green)
- [ ] Button changes to "Đã hoàn tất" (disabled)
- [ ] SalesService logs show "Published message"
- [ ] NotificationService logs show "Email sent successfully"
- [ ] RabbitMQ queue shows message was consumed
- [ ] No errors in browser console
- [ ] No errors in service terminals

---

## 🎉 Success!

If all checkboxes are ✅, congratulations! Your Complete Order feature is working end-to-end:

**Frontend** → **SalesService** → **RabbitMQ** → **NotificationService** → **Email**

---

## 📞 Need Help?

### Check Logs:
```powershell
# Browser Console (F12)
# Look for: "Error completing order:" or fetch errors

# SalesService Terminal
# Look for: "Order completed successfully" or exceptions

# NotificationService Terminal
# Look for: "Email sent successfully" or "SendGrid API error"
```

### Quick Health Checks:
```powershell
# Check all services are running
netstat -ano | findstr "5003 5051 5672"

# Should see 3 lines - one for each port
```

### Reset Test Environment:
```powershell
# Reload frontend page (resets mock data)
# Ctrl + R in browser

# Restart services if needed
# Ctrl + C in terminal, then `dotnet run` again
```

---

**Happy Testing! 🎊**
