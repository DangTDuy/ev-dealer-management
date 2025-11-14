# Hướng dẫn Test Nhanh - Import và Kiểm tra Dữ liệu

Hướng dẫn này giúp bạn **nhanh chóng import dữ liệu test** và **kiểm tra các endpoint** đã chuyển sang dữ liệu thật.

---

## 🚀 Bước 1: Khởi động Service

Mở PowerShell và chạy:

```powershell
cd D:\gitclone\ev-dealer-management\ev-dealer-management\ReportingService
$env:USE_SQLITE = "true"
dotnet run
```

Chờ đến khi thấy: `Now listening on: http://localhost:5208`

**Lưu ý:** Giữ cửa sổ PowerShell này mở trong khi test.

---

## 📥 Bước 2: Import Dữ liệu Test

### Cách A: Dùng PowerShell Script (Nhanh nhất - Khuyên dùng)

Mở PowerShell mới (cửa sổ khác), copy và chạy script sau:

```powershell
$baseUrl = "http://localhost:5208/api/reports"

# ===== IMPORT SALES SUMMARY =====
Write-Host "`n=== Importing Sales Summary Data ===" -ForegroundColor Green

$salesData = @(
    @{
        date = "2025-01-15T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555551"
        salespersonName = "Nguyễn Văn A"
        totalOrders = 5
        totalRevenue = 1500000000
    },
    @{
        date = "2025-01-20T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555552"
        salespersonName = "Trần Thị B"
        totalOrders = 8
        totalRevenue = 2400000000
    },
    @{
        date = "2025-01-10T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666661"
        salespersonName = "Lê Văn C"
        totalOrders = 12
        totalRevenue = 3600000000
    },
    @{
        date = "2025-01-25T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666662"
        salespersonName = "Phạm Thị D"
        totalOrders = 10
        totalRevenue = 3000000000
    },
    @{
        date = "2025-01-12T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777771"
        salespersonName = "Hoàng Văn E"
        totalOrders = 7
        totalRevenue = 2100000000
    },
    @{
        date = "2025-02-08T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555551"
        salespersonName = "Nguyễn Văn A"
        totalOrders = 6
        totalRevenue = 1800000000
    },
    @{
        date = "2025-02-15T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666661"
        salespersonName = "Lê Văn C"
        totalOrders = 15
        totalRevenue = 4500000000
    },
    @{
        date = "2025-02-20T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777771"
        salespersonName = "Hoàng Văn E"
        totalOrders = 9
        totalRevenue = 2700000000
    }
)

$salesSuccess = 0
$salesFailed = 0

foreach ($item in $salesData) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/sales-summary" -Method Post `
            -Body ($item | ConvertTo-Json) -ContentType "application/json"
        if ($response.success) {
            $salesSuccess++
            Write-Host "✓ Sales: $($item.dealerName) - $($item.salespersonName)" -ForegroundColor Green
        }
    } catch {
        $salesFailed++
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nSales Summary: $salesSuccess thành công, $salesFailed lỗi" -ForegroundColor Cyan

# ===== IMPORT INVENTORY SUMMARY =====
Write-Host "`n=== Importing Inventory Summary Data ===" -ForegroundColor Green

$inventoryData = @(
    @{
        vehicleId = "v1111111-1111-1111-1111-111111111111"
        vehicleName = "Tesla Model 3"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        stockCount = 15
    },
    @{
        vehicleId = "v2222222-2222-2222-2222-222222222222"
        vehicleName = "BMW i3"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        stockCount = 8
    },
    @{
        vehicleId = "v3333333-3333-3333-3333-333333333333"
        vehicleName = "Audi e-tron"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        stockCount = 12
    },
    @{
        vehicleId = "v4444444-4444-4444-4444-444444444444"
        vehicleName = "Mercedes EQC"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        stockCount = 10
    },
    @{
        vehicleId = "v5555555-5555-5555-5555-555555555555"
        vehicleName = "Porsche Taycan"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        stockCount = 5
    },
    @{
        vehicleId = "v6666666-6666-6666-6666-666666666666"
        vehicleName = "Tesla Model Y"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        stockCount = 20
    },
    @{
        vehicleId = "v7777777-7777-7777-7777-777777777777"
        vehicleName = "BMW iX"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        stockCount = 6
    },
    @{
        vehicleId = "v8888888-8888-8888-8888-888888888888"
        vehicleName = "VinFast VF8"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        stockCount = 18
    }
)

$inventorySuccess = 0
$inventoryFailed = 0

foreach ($item in $inventoryData) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/inventory-summary" -Method Post `
            -Body ($item | ConvertTo-Json) -ContentType "application/json"
        if ($response.success) {
            $inventorySuccess++
            Write-Host "✓ Inventory: $($item.vehicleName) - $($item.dealerName)" -ForegroundColor Green
        }
    } catch {
        $inventoryFailed++
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInventory Summary: $inventorySuccess thành công, $inventoryFailed lỗi" -ForegroundColor Cyan

Write-Host "`n=== Import hoàn tất! ===" -ForegroundColor Yellow
Write-Host "Tổng: $($salesSuccess + $inventorySuccess) records đã được import thành công" -ForegroundColor Green
```

**Kết quả mong đợi:** Tất cả records sẽ được import thành công với status `201 Created`.

---

### Cách B: Dùng Swagger UI (Trực quan)

1. Mở trình duyệt: `http://localhost:5208/swagger`
2. Tìm endpoint `POST /api/reports/sales-summary`
3. Click **"Try it out"**
4. Paste JSON vào Request body (ví dụ từ Cách A ở trên)
5. Click **"Execute"**
6. Lặp lại cho các records khác

---

### Cách C: Dùng Postman

Xem hướng dẫn chi tiết trong file `IMPORT_DATA_GUIDE.md`

---

## ✅ Bước 3: Kiểm tra Dữ liệu đã Import

### Test 1: Kiểm tra Sales Summary

```powershell
# Lấy tất cả sales summary
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary" | ConvertTo-Json -Depth 10

# Lọc theo dealer
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary?dealerId=a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d" | ConvertTo-Json -Depth 10

# Lọc theo date range
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary?fromDate=2025-01-01&toDate=2025-01-31" | ConvertTo-Json -Depth 10
```

### Test 2: Kiểm tra Inventory Summary

```powershell
# Lấy tất cả inventory summary
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/inventory-summary" | ConvertTo-Json -Depth 10
```

### Test 3: Kiểm tra Summary Report (Endpoint mới - dữ liệu thật)

```powershell
# Lấy summary metrics
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary" | ConvertTo-Json -Depth 10

# Lấy summary với filter date
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary?from=2025-01-01&to=2025-01-31" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
{
  "type": "sales",
  "from": "2025-01-01",
  "to": "2025-01-31",
  "metrics": {
    "totalSales": 42,        // Tổng số orders từ dữ liệu thật
    "totalRevenue": 12600000000,  // Tổng revenue từ dữ liệu thật
    "activeDealers": 3,       // Số dealer unique
    "conversionRate": 0.1234
  }
}
```

### Test 4: Kiểm tra Sales by Region (Endpoint mới - dữ liệu thật)

```powershell
# Lấy sales grouped by dealer
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-by-region" | ConvertTo-Json -Depth 10

# Lọc theo date range
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-by-region?from=2025-01-01&to=2025-01-31" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
[
  {
    "region": "Dealer TP.HCM",
    "sales": 22,
    "revenue": 6600000000
  },
  {
    "region": "Dealer Hà Nội",
    "sales": 19,
    "revenue": 5700000000
  },
  {
    "region": "Dealer Đà Nẵng",
    "sales": 7,
    "revenue": 2100000000
  }
]
```

### Test 5: Kiểm tra Top Vehicles (Endpoint mới - dữ liệu thật)

```powershell
# Lấy top vehicles
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/top-vehicles" | ConvertTo-Json -Depth 10

# Lấy top 5 vehicles
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/top-vehicles?limit=5" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
[
  {
    "model": "Tesla Model Y",
    "sales": 20,
    "revenue": "10000000000"
  },
  {
    "model": "VinFast VF8",
    "sales": 18,
    "revenue": "9000000000"
  },
  ...
]
```

### Test 6: Test Export Report (Endpoint mới - dữ liệu thật)

```powershell
# Export sales report
$body = @{
    type = "sales"
    from = "2025-01-01"
    to = "2025-01-31"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5208/api/reports/export" `
    -Method Post -Body $body -ContentType "application/json" `
    -OutFile "sales_report.csv"

# Export inventory report
$body = @{
    type = "inventory"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5208/api/reports/export" `
    -Method Post -Body $body -ContentType "application/json" `
    -OutFile "inventory_report.csv"
```

---

## 🎯 Kiểm tra Nhanh với Swagger UI

1. Mở: `http://localhost:5208/swagger`
2. Test các endpoint:
   - `GET /api/reports/summary` - Xem metrics tổng hợp
   - `GET /api/reports/sales-by-region` - Xem sales theo dealer
   - `GET /api/reports/top-vehicles` - Xem top vehicles
   - `GET /api/reports/sales-summary` - Xem tất cả sales data
   - `GET /api/reports/inventory-summary` - Xem tất cả inventory data

---

## 🔍 So sánh: Trước và Sau

### Trước (Mock Data):
- `/api/reports/summary` → Trả về số cố định: `totalSales = 1350`
- `/api/reports/sales-by-region` → Trả về 3 regions cố định
- `/api/reports/top-vehicles` → Trả về 5 vehicles cố định

### Sau (Real Data):
- `/api/reports/summary` → Tính toán từ database: `totalSales = tổng thực tế`
- `/api/reports/sales-by-region` → Group theo dealer từ database
- `/api/reports/top-vehicles` → Query từ InventorySummaries, sắp xếp theo stock count

---

## 🐛 Troubleshooting

| Lỗi | Giải pháp |
|-----|-----------|
| `Connection refused` | Đảm bảo service đang chạy: `dotnet run` |
| `404 Not Found` | Kiểm tra URL: `http://localhost:5208` (không phải https) |
| `500 Internal Server Error` | Kiểm tra database connection, xem console log |
| `Empty result` | Import dữ liệu trước khi test endpoints |

---

## 📊 Kết quả Mong đợi

Sau khi import và test, bạn sẽ thấy:

1. **Summary metrics** tính từ dữ liệu thật (không còn hardcode)
2. **Sales by region** group theo dealer thực tế trong database
3. **Top vehicles** sắp xếp theo stock count thực tế
4. **Export** xuất file CSV với dữ liệu thật

**Tất cả endpoints giờ đều sử dụng dữ liệu thật từ database!** ✅

