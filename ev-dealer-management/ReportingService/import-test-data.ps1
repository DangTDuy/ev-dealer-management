# Script Import Test Data cho ReportingService
# Sử dụng: .\import-test-data.ps1

$baseUrl = "http://localhost:5208/api/reports"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMPORT TEST DATA - ReportingService" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kiểm tra service có đang chạy không
try {
    $testResponse = Invoke-WebRequest -Uri "$baseUrl/sales-summary" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✓ Service đang chạy tại $baseUrl" -ForegroundColor Green
} catch {
    Write-Host "✗ Lỗi: Service không chạy hoặc không thể kết nối!" -ForegroundColor Red
    Write-Host "   Hãy chạy: cd ReportingService && `$env:USE_SQLITE = 'true' && dotnet run" -ForegroundColor Yellow
    exit 1
}

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
            -Body ($item | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
        if ($response.success) {
            $salesSuccess++
            Write-Host "  ✓ Sales: $($item.dealerName) - $($item.salespersonName) ($($item.totalOrders) orders)" -ForegroundColor Green
        } else {
            $salesFailed++
            Write-Host "  ✗ Failed: $($item.dealerName)" -ForegroundColor Red
        }
    } catch {
        $salesFailed++
        Write-Host "  ✗ Error: $($item.dealerName) - $($_.Exception.Message)" -ForegroundColor Red
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
            -Body ($item | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
        if ($response.success) {
            $inventorySuccess++
            Write-Host "  ✓ Inventory: $($item.vehicleName) - $($item.dealerName) (Stock: $($item.stockCount))" -ForegroundColor Green
        } else {
            $inventoryFailed++
            Write-Host "  ✗ Failed: $($item.vehicleName)" -ForegroundColor Red
        }
    } catch {
        $inventoryFailed++
        Write-Host "  ✗ Error: $($item.vehicleName) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInventory Summary: $inventorySuccess thành công, $inventoryFailed lỗi" -ForegroundColor Cyan

# ===== TỔNG KẾT =====
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMPORT HOÀN TẤT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tổng cộng: $($salesSuccess + $inventorySuccess) records đã được import thành công" -ForegroundColor Green
Write-Host "Lỗi: $($salesFailed + $inventoryFailed) records" -ForegroundColor $(if ($salesFailed + $inventoryFailed -gt 0) { "Red" } else { "Green" })

# ===== KIỂM TRA DỮ LIỆU =====
Write-Host "`n=== Kiểm tra dữ liệu đã import ===" -ForegroundColor Yellow

try {
    $salesCheck = Invoke-RestMethod -Uri "$baseUrl/sales-summary" -Method Get
    Write-Host "✓ Sales Summary: $($salesCheck.count) records" -ForegroundColor Green
    
    $inventoryCheck = Invoke-RestMethod -Uri "$baseUrl/inventory-summary" -Method Get
    Write-Host "✓ Inventory Summary: $($inventoryCheck.count) records" -ForegroundColor Green
    
    $summaryCheck = Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary" -Method Get
    Write-Host "✓ Summary Metrics:" -ForegroundColor Green
    Write-Host "  - Total Sales: $($summaryCheck.metrics.totalSales)" -ForegroundColor Cyan
    Write-Host "  - Total Revenue: $($summaryCheck.metrics.totalRevenue)" -ForegroundColor Cyan
    Write-Host "  - Active Dealers: $($summaryCheck.metrics.activeDealers)/$($summaryCheck.metrics.totalDealers)" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Không thể kiểm tra dữ liệu: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nBạn có thể test các endpoints khác tại: http://localhost:5208/swagger" -ForegroundColor Yellow
Write-Host "Xem hướng dẫn chi tiết trong file: QUICK_TEST_GUIDE.md`n" -ForegroundColor Yellow

