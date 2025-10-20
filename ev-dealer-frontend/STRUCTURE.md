# 📁 EV Dealer Frontend - Project Structure

## 🎯 Mục đích
Đây là cấu trúc dự án frontend cho hệ thống quản lý đại lý xe điện. Mỗi thành viên trong team có thể nhận một module để phát triển độc lập.

---

## 📂 Cấu trúc thư mục

```
ev-dealer-frontend/
├── src/
│   ├── components/          # Các component dùng chung
│   │   ├── common/         # UI components cơ bản
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── charts/         # Biểu đồ
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   └── PieChart.jsx
│   │   └── forms/          # Form components
│   │       ├── SearchBar.jsx
│   │       ├── FilterPanel.jsx
│   │       └── DateRangePicker.jsx
│   │
│   ├── layouts/            # Layout chính
│   │   ├── MainLayout.jsx  # Layout cho trang đã đăng nhập
│   │   └── AuthLayout.jsx  # Layout cho trang đăng nhập
│   │
│   ├── pages/              # Các trang chính
│   │   ├── Auth/           # Module Authentication
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── Dashboard/      # Module Dashboard
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── Vehicles/       # Module Quản lý xe
│   │   │   ├── VehicleList.jsx
│   │   │   ├── VehicleDetail.jsx
│   │   │   └── VehicleForm.jsx
│   │   │
│   │   ├── Sales/          # Module Quản lý bán hàng
│   │   │   ├── SalesList.jsx
│   │   │   ├── QuoteCreate.jsx
│   │   │   └── OrderDetail.jsx
│   │   │
│   │   ├── Customers/      # Module Quản lý khách hàng
│   │   │   ├── CustomerList.jsx
│   │   │   ├── CustomerDetail.jsx
│   │   │   └── TestDriveForm.jsx
│   │   │
│   │   ├── Dealers/        # Module Quản lý đại lý
│   │   │   ├── DealerList.jsx
│   │   │   └── DealerDetail.jsx
│   │   │
│   │   ├── Reports/        # Module Báo cáo
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── Notifications/  # Module Thông báo
│   │   │   ├── Notifications.jsx
│   │   │   └── NotificationPreferences.jsx
│   │   │
│   │   └── Settings/       # Module Cài đặt
│   │       └── Settings.jsx
│   │
│   ├── routes/             # Cấu hình routing
│   │   └── index.jsx
│   │
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js
│   │   ├── vehicleService.js
│   │   ├── salesService.js
│   │   ├── customerService.js
│   │   ├── dealerService.js
│   │   ├── reportService.js
│   │   └── notificationService.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── storage.js
│   │
│   ├── assets/             # Static files (images, icons)
│   │
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Public assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## 👥 Phân công công việc cho team

### 🔐 Module 1: Authentication (1 người)
**Files cần làm:**
- `src/pages/Auth/Login.jsx`
- `src/pages/Auth/Register.jsx`
- `src/pages/Auth/ForgotPassword.jsx`
- `src/layouts/AuthLayout.jsx`

**Nhiệm vụ:**
- Thiết kế UI form đăng nhập, đăng ký
- Tích hợp với `authService.js`
- Xử lý validation
- Lưu token vào localStorage

---

### 📊 Module 2: Dashboard (1 người)
**Files cần làm:**
- `src/pages/Dashboard/Dashboard.jsx`
- `src/components/charts/LineChart.jsx`
- `src/components/charts/BarChart.jsx`
- `src/components/charts/PieChart.jsx`

**Nhiệm vụ:**
- Tạo summary cards (tổng doanh số, khách hàng, xe...)
- Tích hợp biểu đồ Recharts
- Hiển thị hoạt động gần đây
- Gọi API từ `reportService.js`

---

### 🚗 Module 3: Vehicle Management (1-2 người)
**Files cần làm:**
- `src/pages/Vehicles/VehicleList.jsx`
- `src/pages/Vehicles/VehicleDetail.jsx`
- `src/pages/Vehicles/VehicleForm.jsx`

**Nhiệm vụ:**
- Danh sách xe với search, filter, pagination
- Trang chi tiết xe (gallery, specs)
- Form thêm/sửa xe
- Upload ảnh
- Tích hợp `vehicleService.js`

---

### 💰 Module 4: Sales Management (1-2 người)
**Files cần làm:**
- `src/pages/Sales/SalesList.jsx`
- `src/pages/Sales/QuoteCreate.jsx`
- `src/pages/Sales/OrderDetail.jsx`

**Nhiệm vụ:**
- Danh sách đơn hàng với filter theo trạng thái
- Tạo báo giá
- Chi tiết đơn hàng
- Theo dõi thanh toán
- Tích hợp `salesService.js`

---

### 👥 Module 5: Customer Management (1 người)
**Files cần làm:**
- `src/pages/Customers/CustomerList.jsx`
- `src/pages/Customers/CustomerDetail.jsx`
- `src/pages/Customers/TestDriveForm.jsx`

**Nhiệm vụ:**
- Danh sách khách hàng
- Chi tiết khách hàng (lịch sử mua, test drive)
- Đặt lịch test drive
- Quản lý feedback/complaint
- Tích hợp `customerService.js`

---

### 🏢 Module 6: Dealer Management (1 người)
**Files cần làm:**
- `src/pages/Dealers/DealerList.jsx`
- `src/pages/Dealers/DealerDetail.jsx`

**Nhiệm vụ:**
- Danh sách đại lý
- Chi tiết đại lý
- Biểu đồ hiệu suất
- Upload/view hợp đồng
- Tích hợp `dealerService.js`

---

### 📈 Module 7: Reports & Analytics (1 người)
**Files cần làm:**
- `src/pages/Reports/Reports.jsx`

**Nhiệm vụ:**
- Các loại báo cáo (doanh số, tồn kho, lợi nhuận)
- Filter theo thời gian, khu vực
- Export Excel/PDF
- Biểu đồ phân tích
- Tích hợp `reportService.js`

---

### 🔔 Module 8: Notifications (1 người)
**Files cần làm:**
- `src/pages/Notifications/Notifications.jsx`
- `src/pages/Notifications/NotificationPreferences.jsx`

**Nhiệm vụ:**
- Danh sách thông báo
- Mark as read/unread
- Cài đặt preferences
- Real-time notification badge
- Tích hợp `notificationService.js`

---

### ⚙️ Module 9: Settings & Common Components (1-2 người)
**Files cần làm:**
- `src/pages/Settings/Settings.jsx`
- `src/components/common/*` (tất cả components dùng chung)
- `src/layouts/MainLayout.jsx`

**Nhiệm vụ:**
- Trang cài đặt (profile, đổi mật khẩu)
- Sidebar navigation
- Topbar với user menu
- Các component dùng chung (Button, Table, Modal...)

---

## 🚀 Hướng dẫn bắt đầu

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file .env
```bash
cp .env.example .env
```

### 3. Chạy development server
```bash
npm run dev
```

### 4. Build production
```bash
npm run build
```

---

## 📝 Quy tắc code

1. **Component naming**: PascalCase (VehicleList.jsx)
2. **Function naming**: camelCase (handleSubmit, fetchData)
3. **CSS**: Sử dụng TailwindCSS hoặc MUI
4. **API calls**: Luôn dùng services trong `src/services/`
5. **Error handling**: Bắt lỗi và hiển thị message cho user
6. **Loading state**: Hiển thị loading spinner khi fetch data

---

## 🔗 API Endpoints

Tất cả API endpoints đã được định nghĩa trong các file service:
- `authService.js` - Authentication
- `vehicleService.js` - Vehicle CRUD
- `salesService.js` - Orders, Quotes, Payments
- `customerService.js` - Customers, Test Drives
- `dealerService.js` - Dealers, Performance
- `reportService.js` - Reports, Analytics
- `notificationService.js` - Notifications

---

## 📞 Liên hệ

Nếu có thắc mắc về cấu trúc hoặc phân công, liên hệ team lead.

**Happy Coding! 🚀**

