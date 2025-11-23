# Start services for Test Drive testing
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   STARTING TEST DRIVE SERVICES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kill existing processes on required ports
Write-Host "Stopping existing services..." -ForegroundColor Yellow

# Port 5039 - CustomerService
$port5039 = Get-NetTCPConnection -LocalPort 5039 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($port5039) {
    Write-Host "  Killing process on port 5039 (PID: $port5039)"
    taskkill /F /PID $port5039 2>$null
}

# Port 5051 - NotificationService
$port5051 = Get-NetTCPConnection -LocalPort 5051 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($port5051) {
    Write-Host "  Killing process on port 5051 (PID: $port5051)"
    taskkill /F /PID $port5051 2>$null
}

# Port 5036 - API Gateway
$port5036 = Get-NetTCPConnection -LocalPort 5036 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($port5036) {
    Write-Host "  Killing process on port 5036 (PID: $port5036)"
    taskkill /F /PID $port5036 2>$null
}

Start-Sleep -Seconds 2

Write-Host "`nStarting services..." -ForegroundColor Yellow

# Start CustomerService
Write-Host "  Starting CustomerService on port 5039..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-management\CustomerService; dotnet run"

Start-Sleep -Seconds 3

# Start NotificationService
Write-Host "  Starting NotificationService on port 5051..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService; dotnet run"

Start-Sleep -Seconds 3

# Start API Gateway
Write-Host "  Starting API Gateway on port 5036..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-management\APIGatewayService; dotnet run"

Write-Host "`nWaiting 15 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Health checks
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   HEALTH CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check CustomerService
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5039/api/customers" -Method GET -TimeoutSec 5
    Write-Host "[OK] CustomerService (5039): Running" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] CustomerService (5039): Not responding" -ForegroundColor Red
}

# Check NotificationService
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5051/health" -Method GET -TimeoutSec 5
    Write-Host "[OK] NotificationService (5051): Running" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] NotificationService (5051): Not responding" -ForegroundColor Red
}

# Check API Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5036/api/customers" -Method GET -TimeoutSec 5
    Write-Host "[OK] API Gateway (5036): Running" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] API Gateway (5036): Not responding" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   SERVICES STARTED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n[Access Points]" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:5173/test-drive"
Write-Host "  - API Gateway: http://localhost:5036"
Write-Host "  - CustomerService: http://localhost:5039"
Write-Host "  - NotificationService: http://localhost:5051"
Write-Host "  - RabbitMQ Management: http://localhost:15672"
Write-Host ""
