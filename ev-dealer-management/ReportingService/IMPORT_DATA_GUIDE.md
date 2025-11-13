# Hướng dẫn Import dữ liệu qua Postman

Hướng dẫn này giúp bạn **import dữ liệu đa dạng** vào ReportingService qua Postman, để từ đó hiển thị lên web frontend.

---

## 1. Chuẩn bị

### Bước 1.1: Khởi động Service

```powershell
cd D:\gitclone\ev-dealer-management\ev-dealer-management\ReportingService
$env:USE_SQLITE = "true"
dotnet run
```

Chờ: `Now listening on: http://localhost:5208`

### Bước 1.2: Mở Postman

- Tải: https://www.postman.com/downloads/
- Đăng nhập / Tạo workspace (nếu chưa có)

---

## 2. Import dữ liệu Sales-Summary

### Phương pháp A: Import tuần tự (Copy-Paste từng request)

**Endpoint:** `POST http://localhost:5208/api/reports/sales-summary`

**Header:**

```
Content-Type: application/json
```

**Request 1: Dealer Hà Nội - Tháng 1**

```json
{
  "date": "2025-01-15T00:00:00Z",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "salespersonId": "11111111-2222-3333-4444-555555555551",
  "salespersonName": "Nguyễn Văn A",
  "totalOrders": 5,
  "totalRevenue": 1500000000
}
```

Click **Send** → Kết quả: `201 Created`

**Request 2: Dealer Hà Nội - Tháng 1 (2)**

```json
{
  "date": "2025-01-20T00:00:00Z",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "salespersonId": "11111111-2222-3333-4444-555555555552",
  "salespersonName": "Trần Thị B",
  "totalOrders": 8,
  "totalRevenue": 2400000000
}
```

**Request 3: Dealer TP.HCM - Tháng 1**

```json
{
  "date": "2025-01-10T00:00:00Z",
  "dealerId": "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e",
  "dealerName": "Dealer TP.HCM",
  "salespersonId": "22222222-3333-4444-5555-666666666661",
  "salespersonName": "Lê Văn C",
  "totalOrders": 12,
  "totalRevenue": 3600000000
}
```

**Request 4: Dealer TP.HCM - Tháng 1 (2)**

```json
{
  "date": "2025-01-25T00:00:00Z",
  "dealerId": "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e",
  "dealerName": "Dealer TP.HCM",
  "salespersonId": "22222222-3333-4444-5555-666666666662",
  "salespersonName": "Phạm Thị D",
  "totalOrders": 10,
  "totalRevenue": 3000000000
}
```

**Request 5: Dealer Đà Nẵng - Tháng 1**

```json
{
  "date": "2025-01-12T00:00:00Z",
  "dealerId": "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f",
  "dealerName": "Dealer Đà Nẵng",
  "salespersonId": "33333333-4444-5555-6666-777777777771",
  "salespersonName": "Hoàng Văn E",
  "totalOrders": 7,
  "totalRevenue": 2100000000
}
```

**Request 6: Dealer Hà Nội - Tháng 2**

```json
{
  "date": "2025-02-08T00:00:00Z",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "salespersonId": "11111111-2222-3333-4444-555555555551",
  "salespersonName": "Nguyễn Văn A",
  "totalOrders": 6,
  "totalRevenue": 1800000000
}
```

---

### Phương pháp B: Import nhanh bằng Collection (Khuyến nghị)

**Bước 1: Tạo Collection trong Postman**

- Cửa sổ trái → **Collections** → **+ (New Collection)**
- Tên: `ReportingService - Data Import`
- Click **Create**

**Bước 2: Thêm các request**

1. Click collection vừa tạo
2. **Add request** (dấu +)
3. Đặt tên: `POST Sales-Summary #1`
4. Method: **POST**
5. URL: `http://localhost:5208/api/reports/sales-summary`
6. Tab **Body** → **raw** → **JSON** → paste JSON từ Request 1 ở trên
7. Click **Save**
8. Lặp lại với các Request 2-6

**Bước 3: Chạy toàn bộ Collection (Runner)**

1. Click collection → **...** (Menu) → **Run collection**
2. Cửa sổ Collection Runner mở → **Run** button
3. Xem từng request được thực thi tự động
4. Kết quả: tất cả trả 201 Created = import thành công

---

## 3. Import dữ liệu Inventory-Summary

**Endpoint:** `POST http://localhost:5208/api/reports/inventory-summary`

**Request 1: Tesla Model 3 - Dealer Hà Nội**

```json
{
  "vehicleId": "v1111111-1111-1111-1111-111111111111",
  "vehicleName": "Tesla Model 3",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "stockCount": 15
}
```

**Request 2: BMW i3 - Dealer Hà Nội**

```json
{
  "vehicleId": "v2222222-2222-2222-2222-222222222222",
  "vehicleName": "BMW i3",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "stockCount": 8
}
```

**Request 3: Audi e-tron - Dealer TP.HCM**

```json
{
  "vehicleId": "v3333333-3333-3333-3333-333333333333",
  "vehicleName": "Audi e-tron",
  "dealerId": "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e",
  "dealerName": "Dealer TP.HCM",
  "stockCount": 12
}
```

**Request 4: Mercedes EQC - Dealer TP.HCM**

```json
{
  "vehicleId": "v4444444-4444-4444-4444-444444444444",
  "vehicleName": "Mercedes EQC",
  "dealerId": "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e",
  "dealerName": "Dealer TP.HCM",
  "stockCount": 10
}
```

**Request 5: Porsche Taycan - Dealer Đà Nẵng**

```json
{
  "vehicleId": "v5555555-5555-5555-5555-555555555555",
  "vehicleName": "Porsche Taycan",
  "dealerId": "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f",
  "dealerName": "Dealer Đà Nẵng",
  "stockCount": 5
}
```

---

## 4. Kiểm tra dữ liệu đã import

**GET toàn bộ Sales-Summary:**

```
GET http://localhost:5208/api/reports/sales-summary
```

Kết quả: danh sách 6 record đã import

**GET toàn bộ Inventory-Summary:**

```
GET http://localhost:5208/api/reports/inventory-summary
```

Kết quả: danh sách 5 record đã import

**Filter dữ liệu (ví dụ):**

```
GET http://localhost:5208/api/reports/sales-summary?dealerId=a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d
```

Kết quả: 2 record cho Dealer Hà Nội

---

## 5. Tips & Tối ưu

### Sử dụng Environment Variables trong Postman

Nếu muốn thay đổi URL dễ dàng (localhost vs production):

1. **New Environment** → đặt tên `Local Dev`
2. Add biến:
   - `baseUrl`: `http://localhost:5208`
   - `dealerIdHN`: `a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d`
   - `dealerIdHCM`: `b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e`
3. Trong request, dùng: `{{baseUrl}}/api/reports/sales-summary`

### Sử dụng Pre-request Script để sinh ID tự động

Nếu muốn mỗi request có ID unique (tránh trùng):

```javascript
// Pre-request Script tab
pm.environment.set("dealerId", pm.utils.v4());
pm.environment.set("salespersonId", pm.utils.v4());
```

Sau đó body dùng:

```json
{
  "dealerId": "{{dealerId}}",
  "salespersonId": "{{salespersonId}}",
  ...
}
```

### Tạo Test để xác nhận import thành công

Trong tab **Tests** của request:

```javascript
pm.test("Status is 201 Created", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains ID", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
  pm.expect(jsonData.data.id).to.exist;
});
```

---

## 6. Export & Share Collection

Sau khi tạo Collection với tất cả request:

1. Click collection → **...** → **Export**
2. Chọn **Collection v2.1**
3. Lưu file `.json`
4. Chia sẻ với team hoặc version control

**Import Collection được lưu:**

- Postman → **Import** → chọn file `.json`

---

## 7. Tạo Postman Environment cho Multiple Dealers

**Tạo file JSON này và import vào Postman:**

```json
{
  "name": "ReportingService Dealers",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5208",
      "enabled": true
    },
    {
      "key": "dealerHN",
      "value": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
      "enabled": true
    },
    {
      "key": "dealerHCM",
      "value": "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e",
      "enabled": true
    },
    {
      "key": "dealerDN",
      "value": "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f",
      "enabled": true
    }
  ]
}
```

Postman → **Import** → chọn file trên.

---

## 8. Bulk Import Script (PowerShell)

Nếu muốn import dữ liệu hàng loạt tự động:

```powershell
$baseUrl = "http://localhost:5208/api/reports"

# Array of sales data
$salesData = @(
    @{
        date = "2025-01-15T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        salespersonId = "11111111-2222-3333-4444-555555555551"
        salespersonName = "Nguyễn Văn A"
        totalOrders = 5
        totalRevenue = 1500000000
    },
    @{
        date = "2025-01-20T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        salespersonId = "11111111-2222-3333-4444-555555555552"
        salespersonName = "Trần Thị B"
        totalOrders = 8
        totalRevenue = 2400000000
    }
    # Thêm nhiều record khác ở đây...
)

$imported = 0
$failed = 0

foreach ($item in $salesData) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/sales-summary" -Method Post -Body ($item | ConvertTo-Json) -ContentType "application/json"
        if ($response.success) {
            $imported++
            Write-Host "✓ Imported: $($item.dealerName) - $($item.salespersonName)"
        }
    } catch {
        $failed++
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "---"
Write-Host "Import hoàn tất: $imported thành công, $failed lỗi"
```

---

## 9. Troubleshooting

| Lỗi                       | Nguyên nhân              | Cách khắc phục                                                     |
| ------------------------- | ------------------------ | ------------------------------------------------------------------ |
| 400 Bad Request           | Body JSON không đúng     | Kiểm tra JSON format, các field bắt buộc (dealerName, vehicleName) |
| 500 Internal Server Error | Database không reachable | Chạy với SQLite: `$env:USE_SQLITE = "true"`                        |
| Connection Refused        | Service không chạy       | Khởi động lại: `dotnet run`                                        |
| 404 Not Found             | Endpoint sai URL         | Kiểm tra lại URL (http vs https, port 5208)                        |

---

## 10. Tiếp theo: Hiển thị dữ liệu trên Web

Sau khi import dữ liệu, để hiển thị trên frontend:

1. Xem hướng dẫn tạo frontend page (file `FRONTEND_INTEGRATION.md` hoặc tương tự)
2. Frontend sẽ gọi API `GET /api/reports/sales-summary` để lấy dữ liệu
3. Hiển thị dưới dạng bảng hoặc biểu đồ

---

**Bạn đã sẵn sàng import dữ liệu! Chọn Phương pháp A (tuần tự) hoặc B (Collection Runner) và bắt đầu.**
