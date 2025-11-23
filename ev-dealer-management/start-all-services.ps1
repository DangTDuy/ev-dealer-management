# ============================================
# START ALL SERVICES FOR NOTIFICATION TESTING
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING ALL SERVICES                 " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the base directory
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ============================================
# 1. CHECK RABBITMQ
# ============================================
Write-Host "[1/4] Checking RabbitMQ..." -ForegroundColor Yellow

$rabbitRunning = docker ps --filter "name=rabbitmq" --filter "status=running" --format "{{.Names}}"

if ($rabbitRunning -eq "rabbitmq") {
    Write-Host "  ✅ RabbitMQ is already running" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  RabbitMQ not running. Starting..." -ForegroundColor Yellow
    
    # Try to start existing container
    $existingContainer = docker ps -a --filter "name=rabbitmq" --format "{{.Names}}"
    
    if ($existingContainer -eq "rabbitmq") {
        docker start rabbitmq | Out-Null
        Write-Host "  ✅ Started existing RabbitMQ container" -ForegroundColor Green
    } else {
        Write-Host "  Creating new RabbitMQ container..." -ForegroundColor Yellow
        docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management | Out-Null
        Write-Host "  ✅ RabbitMQ container created and started" -ForegroundColor Green
        Write-Host "  ⏳ Waiting 10 seconds for RabbitMQ to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

Write-Host ""

# ============================================
# 2. START NOTIFICATIONSERVICE
# ============================================
Write-Host "[2/4] Starting NotificationService (Port 5051)..." -ForegroundColor Yellow

# Kill existing process on port 5051
$existingProcess = netstat -ano | Select-String ':5051' | Select-Object -First 1
if ($existingProcess) {
    $pid = ($existingProcess -split '\s+')[-1]
    Write-Host "  Stopping existing process (PID: $pid)..." -ForegroundColor Gray
    taskkill /F /PID $pid 2>&1 | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "  Starting NotificationService..." -ForegroundColor Gray
$notifServicePath = Join-Path $baseDir "NotificationService"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$notifServicePath'; dotnet run" -WindowStyle Normal
Write-Host "  ✅ NotificationService terminal opened" -ForegroundColor Green

Write-Host ""

# ============================================
# 3. START SALESSERVICE
# ============================================
Write-Host "[3/4] Starting SalesService (Port 5003)..." -ForegroundColor Yellow

# Kill existing process on port 5003
$existingProcess = netstat -ano | Select-String ':5003' | Select-Object -First 1
if ($existingProcess) {
    $pid = ($existingProcess -split '\s+')[-1]
    Write-Host "  Stopping existing process (PID: $pid)..." -ForegroundColor Gray
    taskkill /F /PID $pid 2>&1 | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "  Starting SalesService..." -ForegroundColor Gray
$salesServicePath = Join-Path $baseDir "SalesService"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$salesServicePath'; dotnet run" -WindowStyle Normal
Write-Host "  ✅ SalesService terminal opened" -ForegroundColor Green

Write-Host ""

# ============================================
# 4. START VEHICLESERVICE
# ============================================
Write-Host "[4/4] Starting VehicleService (Port 5002)..." -ForegroundColor Yellow

# Kill existing process on port 5002
$existingProcess = netstat -ano | Select-String ':5002' | Select-Object -First 1
if ($existingProcess) {
    $pid = ($existingProcess -split '\s+')[-1]
    Write-Host "  Stopping existing process (PID: $pid)..." -ForegroundColor Gray
    taskkill /F /PID $pid 2>&1 | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "  Starting VehicleService..." -ForegroundColor Gray
$vehicleServicePath = Join-Path $baseDir "VehicleService"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$vehicleServicePath'; dotnet run" -WindowStyle Normal
Write-Host "  ✅ VehicleService terminal opened" -ForegroundColor Green

Write-Host ""

# ============================================
# 5. WAIT FOR SERVICES TO START
# ============================================
Write-Host "⏳ Waiting 15 seconds for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""

# ============================================
# 6. VERIFY ALL SERVICES
# ============================================
Write-Host "Verifying services..." -ForegroundColor Yellow

$allHealthy = $true

# Check NotificationService
Write-Host "  - NotificationService (5051)..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5051/notifications/health" -TimeoutSec 5
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not responding" -ForegroundColor Red
    $allHealthy = $false
}

# Check SalesService
Write-Host "  - SalesService (5003)..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5003/api/orders/health" -TimeoutSec 5
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not responding" -ForegroundColor Red
    $allHealthy = $false
}

# Check VehicleService
Write-Host "  - VehicleService (5002)..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5002/health" -TimeoutSec 5
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ Not responding" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host ""

# ============================================
# RESULT
# ============================================
if ($allHealthy) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ALL SERVICES STARTED SUCCESSFULLY! ✅ " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Services running:" -ForegroundColor Cyan
    Write-Host "  - RabbitMQ:            http://localhost:15672 (guest/guest)" -ForegroundColor Gray
    Write-Host "  - NotificationService: http://localhost:5051" -ForegroundColor Gray
    Write-Host "  - SalesService:        http://localhost:5003" -ForegroundColor Gray
    Write-Host "  - VehicleService:      http://localhost:5002" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next step: Run test script" -ForegroundColor Yellow
    Write-Host "  .\test-all-flows.ps1" -ForegroundColor Cyan
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  SOME SERVICES FAILED TO START ❌      " -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the terminal windows for error messages." -ForegroundColor Yellow
    Write-Host "Wait a bit longer and try running the test script:" -ForegroundColor Yellow
    Write-Host "  .\test-all-flows.ps1" -ForegroundColor Cyan
}
