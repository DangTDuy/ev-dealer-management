# 🚀 Hướng dẫn phát triển cho Team

## 📋 Tổng quan dự án

**Tên dự án:** EV Dealer Management System  
**Frontend:** React 19 + Vite  
**UI Framework:** Material-UI + TailwindCSS  
**Charts:** Recharts  
**Routing:** React Router DOM v6  
**HTTP Client:** Axios  

---

## 🎯 Các module cần phát triển

### ✅ Module đã có skeleton (cần hoàn thiện UI/UX)

| Module | Files | Người phụ trách | Deadline |
|--------|-------|-----------------|----------|
| **Authentication** | Login, Register, ForgotPassword | | |
| **Dashboard** | Dashboard + Charts | | |
| **Vehicles** | VehicleList, VehicleDetail, VehicleForm | | |
| **Sales** | SalesList, QuoteCreate, OrderDetail | | |
| **Customers** | CustomerList, CustomerDetail, TestDriveForm | | |
| **Dealers** | DealerList, DealerDetail | | |
| **Reports** | Reports | | |
| **Notifications** | Notifications, NotificationPreferences | | |
| **Settings** | Settings | | |
| **Common Components** | Sidebar, Topbar, Table, Modal, etc. | | |

---

## 📝 Checklist cho mỗi module

### Khi nhận module, bạn cần:

- [ ] Đọc kỹ TODO comments trong file
- [ ] Thiết kế UI/UX cho trang (có thể dùng Figma)
- [ ] Implement UI với MUI hoặc TailwindCSS
- [ ] Tích hợp API từ services
- [ ] Xử lý loading state
- [ ] Xử lý error handling
- [ ] Validate form inputs
- [ ] Test chức năng
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Code review với team

---

## 🛠️ Công cụ và thư viện

### UI Components
```jsx
// Material-UI
import { Button, TextField, Card, Table } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'

// Hoặc TailwindCSS
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>
```

### Charts (Recharts)
```jsx
import { LineChart, BarChart, PieChart } from 'recharts'

// Đã có sẵn wrapper components trong src/components/charts/
import LineChart from '../components/charts/LineChart'
```

### API Calls
```jsx
import { getVehicles, createVehicle } from '../services/vehicleService'

// Trong component
const fetchData = async () => {
  try {
    const data = await getVehicles({ page: 1, limit: 10 })
    setVehicles(data)
  } catch (error) {
    console.error(error)
    // Show error message
  }
}
```

### Form Handling
```jsx
import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors } } = useForm()

const onSubmit = (data) => {
  // Call API
}
```

---

## 🎨 Design Guidelines

### Colors
- **Primary:** `#2196f3` (Blue)
- **Secondary:** `#9c27b0` (Purple)
- **Success:** `#4caf50` (Green)
- **Warning:** `#ff9800` (Orange)
- **Error:** `#f44336` (Red)

### Typography
- **Headings:** Bold, 24-32px
- **Body:** Regular, 14-16px
- **Small text:** 12px

### Spacing
- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **XLarge:** 32px

---

## 📂 Cách tổ chức code

### Component Structure
```jsx
/**
 * Component description
 * TODO: List of tasks
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MyComponent = () => {
  // 1. State
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 2. Hooks
  const navigate = useNavigate()
  
  // 3. Effects
  useEffect(() => {
    fetchData()
  }, [])
  
  // 4. Functions
  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await someService()
      setData(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  // 5. Render
  if (loading) return <Loading />
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default MyComponent
```

---

## 🔄 Git Workflow

### Branch naming
```
feature/module-name-feature
fix/module-name-bug
```

### Commit messages
```
feat: Add vehicle list page
fix: Fix pagination in customer list
style: Update dashboard layout
refactor: Improve API error handling
```

### Pull Request
1. Tạo branch từ `main`
2. Develop feature
3. Test kỹ
4. Tạo PR với description rõ ràng
5. Request review từ team lead
6. Merge sau khi approved

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Tất cả buttons hoạt động
- [ ] Forms validate đúng
- [ ] API calls thành công
- [ ] Loading states hiển thị
- [ ] Error messages rõ ràng
- [ ] Responsive trên mobile
- [ ] Navigation hoạt động
- [ ] Data hiển thị đúng format

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
```
Solution: Đảm bảo backend đã enable CORS
Hoặc dùng proxy trong vite.config.js
```

### Issue 2: 401 Unauthorized
```
Solution: Check token trong localStorage
Đảm bảo token được gửi trong header
```

### Issue 3: Component not rendering
```
Solution: Check import path
Đảm bảo export default đúng
```

---

## 📞 Communication

### Daily Standup (15 phút)
- Hôm qua làm gì?
- Hôm nay làm gì?
- Có vấn đề gì cần support?

### Code Review
- Review code của nhau
- Đưa feedback constructive
- Learn from each other

### Questions?
- Hỏi trên group chat
- Tạo issue trên GitHub
- Schedule 1-on-1 với team lead

---

## 🎓 Learning Resources

### React
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)

### Material-UI
- [MUI Docs](https://mui.com)

### TailwindCSS
- [Tailwind Docs](https://tailwindcss.com)

### Recharts
- [Recharts Docs](https://recharts.org)

---

## ✨ Best Practices

1. **Keep components small** - Một component chỉ làm một việc
2. **Reuse components** - Dùng lại components trong `src/components/common/`
3. **Handle errors** - Luôn có try-catch và hiển thị error
4. **Loading states** - Hiển thị loading khi fetch data
5. **Responsive design** - Test trên nhiều screen sizes
6. **Clean code** - Code dễ đọc, dễ maintain
7. **Comment when needed** - Giải thích logic phức tạp
8. **Test before commit** - Đảm bảo code chạy được

---

## 🚀 Let's Build Something Great!

Chúc các bạn code vui vẻ! Nếu có thắc mắc gì, đừng ngại hỏi team nhé! 💪

**Happy Coding! 🎉**

