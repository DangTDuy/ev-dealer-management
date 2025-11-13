# ReportingService API Endpoints

## 📋 Tổng quan

ReportingService cung cấp các API endpoints để truy cập và quản lý dữ liệu tổng hợp bán hàng và tồn kho từ các dịch vụ khác.

## 🚀 Khởi động ứng dụng

```bash
cd ReportingService
dotnet run
```

Ứng dụng sẽ chạy trên: **https://localhost:5214** (hoặc cổng được cấu hình trong appsettings.json)

## 📚 API Endpoints

### 1. Sales Summary (Dữ liệu tổng hợp doanh số)

#### GET /api/reports/sales-summary

Lấy tất cả dữ liệu tổng hợp doanh số với các bộ lọc tùy chọn.

**Query Parameters:**

- `fromDate` (optional): Lọc từ ngày (DateTime)
- `toDate` (optional): Lọc đến ngày (DateTime)
- `dealerId` (optional): Lọc theo ID đại lý (Guid)

**Example:**

```bash
# Lấy tất cả doanh số
curl -X GET "https://localhost:5214/api/reports/sales-summary"

# Lấy doanh số trong khoảng thời gian
curl -X GET "https://localhost:5214/api/reports/sales-summary?fromDate=2025-01-01&toDate=2025-01-31"

# Lấy doanh số của một đại lý cụ thể
curl -X GET "https://localhost:5214/api/reports/sales-summary?dealerId=550e8400-e29b-41d4-a716-446655440000"
```

**Response (200 OK):**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "date": "2025-01-15T00:00:00Z",
      "dealerId": "550e8400-e29b-41d4-a716-446655440000",
      "dealerName": "Dealer Hà Nội",
      "salespersonId": "550e8400-e29b-41d4-a716-446655440002",
      "salespersonName": "Nguyễn Văn A",
      "totalOrders": 5,
      "totalRevenue": 1500000000,
      "lastUpdatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

#### GET /api/reports/sales-summary/{id}

Lấy chi tiết một doanh số cụ thể theo ID.

**Path Parameters:**

- `id`: ID của doanh số (Guid)

**Example:**

```bash
curl -X GET "https://localhost:5214/api/reports/sales-summary/550e8400-e29b-41d4-a716-446655440001"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "date": "2025-01-15T00:00:00Z",
    "dealerId": "550e8400-e29b-41d4-a716-446655440000",
    "dealerName": "Dealer Hà Nội",
    "salespersonId": "550e8400-e29b-41d4-a716-446655440002",
    "salespersonName": "Nguyễn Văn A",
    "totalOrders": 5,
    "totalRevenue": 1500000000,
    "lastUpdatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "message": "Sales summary not found"
}
```

---

#### POST /api/reports/sales-summary

Thêm một dữ liệu tổng hợp doanh số mới (dùng cho test).

**Request Body:**

```json
{
  "date": "2025-01-15T00:00:00Z",
  "dealerId": "550e8400-e29b-41d4-a716-446655440000",
  "dealerName": "Dealer Hà Nội",
  "salespersonId": "550e8400-e29b-41d4-a716-446655440002",
  "salespersonName": "Nguyễn Văn A",
  "totalOrders": 5,
  "totalRevenue": 1500000000
}
```

**Example (PowerShell):**

```powershell
$body = @{
    date = "2025-01-15T00:00:00Z"
    dealerId = "550e8400-e29b-41d4-a716-446655440000"
    dealerName = "Dealer Hà Nội"
    salespersonId = "550e8400-e29b-41d4-a716-446655440002"
    salespersonName = "Nguyễn Văn A"
    totalOrders = 5
    totalRevenue = 1500000000
} | ConvertTo-Json

curl -X POST "https://localhost:5214/api/reports/sales-summary" `
  -ContentType "application/json" `
  -Body $body
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "date": "2025-01-15T00:00:00Z",
    "dealerId": "550e8400-e29b-41d4-a716-446655440000",
    "dealerName": "Dealer Hà Nội",
    "salespersonId": "550e8400-e29b-41d4-a716-446655440002",
    "salespersonName": "Nguyễn Văn A",
    "totalOrders": 5,
    "totalRevenue": 1500000000,
    "lastUpdatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2. Inventory Summary (Dữ liệu tổng hợp tồn kho)

#### GET /api/reports/inventory-summary

Lấy tất cả dữ liệu tổng hợp tồn kho với các bộ lọc tùy chọn.

**Query Parameters:**

- `dealerId` (optional): Lọc theo ID đại lý (Guid)
- `vehicleId` (optional): Lọc theo ID xe (Guid)

**Example:**

```bash
# Lấy tất cả tồn kho
curl -X GET "https://localhost:5214/api/reports/inventory-summary"

# Lấy tồn kho của một đại lý
curl -X GET "https://localhost:5214/api/reports/inventory-summary?dealerId=550e8400-e29b-41d4-a716-446655440000"

# Lấy tồn kho của một loại xe
curl -X GET "https://localhost:5214/api/reports/inventory-summary?vehicleId=550e8400-e29b-41d4-a716-446655440003"
```

**Response (200 OK):**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "vehicleId": "550e8400-e29b-41d4-a716-446655440003",
      "vehicleName": "Tesla Model 3",
      "dealerId": "550e8400-e29b-41d4-a716-446655440000",
      "dealerName": "Dealer Hà Nội",
      "stockCount": 15,
      "lastUpdatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

#### GET /api/reports/inventory-summary/{id}

Lấy chi tiết một tồn kho cụ thể theo ID.

**Path Parameters:**

- `id`: ID của tồn kho (Guid)

**Example:**

```bash
curl -X GET "https://localhost:5214/api/reports/inventory-summary/550e8400-e29b-41d4-a716-446655440010"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440003",
    "vehicleName": "Tesla Model 3",
    "dealerId": "550e8400-e29b-41d4-a716-446655440000",
    "dealerName": "Dealer Hà Nội",
    "stockCount": 15,
    "lastUpdatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

#### POST /api/reports/inventory-summary

Thêm một dữ liệu tồn kho mới (dùng cho test).

**Request Body:**

```json
{
  "vehicleId": "550e8400-e29b-41d4-a716-446655440003",
  "vehicleName": "Tesla Model 3",
  "dealerId": "550e8400-e29b-41d4-a716-446655440000",
  "dealerName": "Dealer Hà Nội",
  "stockCount": 15
}
```

**Example (PowerShell):**

```powershell
$body = @{
    vehicleId = "550e8400-e29b-41d4-a716-446655440003"
    vehicleName = "Tesla Model 3"
    dealerId = "550e8400-e29b-41d4-a716-446655440000"
    dealerName = "Dealer Hà Nội"
    stockCount = 15
} | ConvertTo-Json

curl -X POST "https://localhost:5214/api/reports/inventory-summary" `
  -ContentType "application/json" `
  -Body $body
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "vehicleId": "550e8400-e29b-41d4-a716-446655440003",
    "vehicleName": "Tesla Model 3",
    "dealerId": "550e8400-e29b-41d4-a716-446655440000",
    "dealerName": "Dealer Hà Nội",
    "stockCount": 15,
    "lastUpdatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 🧪 Testing với Swagger UI

Khi ứng dụng chạy, bạn có thể truy cập Swagger UI tại:

```
https://localhost:5214/swagger/index.html
```

Từ đó, bạn có thể:

1. Xem tất cả các endpoint
2. Thực thi các request trực tiếp từ giao diện
3. Xem chi tiết request/response

---

## 💡 Ví dụ thực tế

### Tạo một bản ghi doanh số

```bash
curl -X POST "https://localhost:5214/api/reports/sales-summary" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15T00:00:00Z",
    "dealerId": "550e8400-e29b-41d4-a716-446655440000",
    "dealerName": "Dealer Hà Nội",
    "salespersonId": "550e8400-e29b-41d4-a716-446655440002",
    "salespersonName": "Nguyễn Văn A",
    "totalOrders": 5,
    "totalRevenue": 1500000000
  }'
```

### Lấy doanh số của tháng 1

```bash
curl -X GET "https://localhost:5214/api/reports/sales-summary?fromDate=2025-01-01&toDate=2025-01-31"
```

### Lấy tồn kho của Dealer Hà Nội

```bash
curl -X GET "https://localhost:5214/api/reports/inventory-summary?dealerId=550e8400-e29b-41d4-a716-446655440000"
```

---

## 🔒 Lưu ý bảo mật

- API hiện tại không có xác thực. Trong production, cần thêm:
  - JWT authentication
  - Role-based access control (RBAC)
  - API key validation
  - Rate limiting

---

## 📝 Notes

- Tất cả các timestamp được lưu trữ dưới dạng UTC
- ID được tạo tự động dưới dạng GUID
- `LastUpdatedAt` được cập nhật tự động khi tạo/sửa record
