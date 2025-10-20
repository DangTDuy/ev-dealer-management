# ⚡ Quick Start Guide

## 🎯 Bắt đầu nhanh trong 5 phút!

### 1️⃣ Cài đặt (2 phút)

```bash
# Clone project (nếu chưa có)
cd ev-dealer-frontend

# Cài dependencies
npm install

# Tạo file .env
cp .env.example .env
```

### 2️⃣ Chạy project (1 phút)

```bash
# Start dev server
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### 3️⃣ Xem cấu trúc (2 phút)

```bash
# Xem cấu trúc thư mục
tree src -L 2

# Hoặc dùng Windows
tree /F src
```

---

## 📂 Cấu trúc quan trọng

```
src/
├── pages/              ← Các trang chính (bắt đầu từ đây!)
│   ├── Auth/          ← Login, Register
│   ├── Dashboard/     ← Trang chủ
│   ├── Vehicles/      ← Quản lý xe
│   ├── Sales/         ← Quản lý bán hàng
│   └── ...
│
├── components/         ← Components dùng chung
│   ├── common/        ← Button, Table, Modal...
│   ├── charts/        ← Biểu đồ
│   └── forms/         ← Form components
│
├── services/          ← API calls (quan trọng!)
│   ├── authService.js
│   ├── vehicleService.js
│   └── ...
│
└── utils/             ← Helpers
    ├── constants.js
    ├── formatters.js
    └── validators.js
```

---

## 🎨 Làm việc với một module

### Ví dụ: Module Vehicle Management

#### 1. Mở file cần làm
```
src/pages/Vehicles/VehicleList.jsx
```

#### 2. Đọc TODO comments
```jsx
/**
 * Vehicle List Page
 * TODO: Implement vehicle list with:
 * - Search bar
 * - Filters (type, price range, dealer, stock status)
 * - Table with columns: Image, Model, Type, Price, Stock, Dealer, Actions
 * - Pagination
 * - Add New Vehicle button
 */
```

#### 3. Implement UI
```jsx
import { useState, useEffect } from 'react'
import { getVehicles } from '../../services/vehicleService'
import Table from '../../components/common/Table'
import SearchBar from '../../components/forms/SearchBar'

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const data = await getVehicles()
      setVehicles(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Vehicles</h1>
      <SearchBar onSearch={handleSearch} />
      <Table data={vehicles} columns={columns} />
    </div>
  )
}
```

#### 4. Test
- Chạy `npm run dev`
- Mở browser
- Navigate đến `/vehicles`
- Test các chức năng

---

## 🔌 Sử dụng API Services

### Ví dụ: Lấy danh sách xe

```jsx
import { getVehicles, createVehicle, updateVehicle } from '@/services/vehicleService'

// GET - Lấy danh sách
const vehicles = await getVehicles({ page: 1, limit: 10 })

// POST - Tạo mới
const newVehicle = await createVehicle({
  model: 'Tesla Model 3',
  type: 'SEDAN',
  price: 45000
})

// PUT - Cập nhật
const updated = await updateVehicle(vehicleId, {
  price: 42000
})
```

### Tất cả services có sẵn:
- `authService.js` - Login, Register, Logout
- `vehicleService.js` - CRUD vehicles
- `salesService.js` - Orders, Quotes
- `customerService.js` - Customers, Test drives
- `dealerService.js` - Dealers
- `reportService.js` - Reports
- `notificationService.js` - Notifications

---

## 🎨 Sử dụng Components

### Button
```jsx
import Button from '@/components/common/Button'

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

### Table
```jsx
import Table from '@/components/common/Table'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
]

<Table data={data} columns={columns} onRowClick={handleRowClick} />
```

### Modal
```jsx
import Modal from '@/components/common/Modal'

<Modal isOpen={isOpen} onClose={handleClose} title="Add Vehicle">
  <form>...</form>
</Modal>
```

### Charts
```jsx
import LineChart from '@/components/charts/LineChart'

const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 }
]

<LineChart data={data} xKey="month" yKey="sales" title="Monthly Sales" />
```

---

## 🎯 Workflow hàng ngày

### Morning (9:00 AM)
1. Pull latest code: `git pull origin main`
2. Check TASK_CHECKLIST.md
3. Pick a task
4. Create branch: `git checkout -b feature/vehicle-list`

### During Day
1. Code your feature
2. Test frequently
3. Commit often: `git commit -m "feat: add vehicle list"`

### End of Day (6:00 PM)
1. Test one more time
2. Push code: `git push origin feature/vehicle-list`
3. Create Pull Request
4. Update TASK_CHECKLIST.md

---

## 🐛 Common Issues

### Issue: Port already in use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or change port in vite.config.js
```

### Issue: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: API not working
```bash
# Check .env file
# Make sure backend is running
# Check API URL in services
```

---

## 📝 Checklist trước khi commit

- [ ] Code chạy được (`npm run dev`)
- [ ] Không có lỗi console
- [ ] UI responsive (test mobile)
- [ ] Loading states hoạt động
- [ ] Error handling đầy đủ
- [ ] Code đã format đẹp
- [ ] Đã test các chức năng chính

---

## 🎓 Học thêm

### React Basics
- [React Docs](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### Material-UI
- [MUI Components](https://mui.com/components/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)

### TailwindCSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### Recharts
- [Recharts Examples](https://recharts.org/en-US/examples)

---

## 💡 Tips & Tricks

### 1. Sử dụng React DevTools
- Install extension: React Developer Tools
- Debug components và state

### 2. Hot Module Replacement (HMR)
- Vite tự động reload khi save
- Không cần refresh browser

### 3. Code Snippets
- Install ES7+ React snippets extension
- Type `rafce` → React Arrow Function Component

### 4. Console.log debugging
```jsx
console.log('Data:', data)
console.table(vehicles)
console.error('Error:', error)
```

### 5. Organize imports
```jsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { Button } from '@mui/material'

// 3. Local imports
import MyComponent from './MyComponent'
import { myFunction } from './utils'
```

---

## 🚀 Next Steps

1. **Đọc TEAM_GUIDE.md** - Hướng dẫn chi tiết
2. **Xem STRUCTURE.md** - Hiểu cấu trúc project
3. **Check TASK_CHECKLIST.md** - Nhận task
4. **Bắt đầu code!** 💻

---

## 📞 Cần giúp đỡ?

1. Đọc documentation files
2. Hỏi team members
3. Google/StackOverflow
4. Contact team lead

---

**Chúc bạn code vui vẻ! 🎉**

