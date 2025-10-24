# 📋 Task Checklist - EV Dealer Frontend

## 🎯 Phân công công việc cho team

> **Ghi chú:** Đánh dấu ✅ khi hoàn thành task

---

## 👤 Module 1: Authentication

**Người phụ trách:** Nguyen Chi Trung  
**Deadline:** 22/10/2025

### Tasks:

- [ ] **Login Page** (`src/pages/Auth/Login.jsx`)

  - [] Design UI form
  - [ ] Email/password validation
  - [ ] Remember me checkbox
  - [ ] Call login API
  - [ ] Save token to localStorage
  - [ ] Redirect to dashboard
  - [ ] Error handling

- [ ] **Register Page** (`src/pages/Auth/Register.jsx`)

  - [ ] Design registration form
  - [ ] Form validation (name, email, phone, password)
  - [ ] Password strength indicator
  - [ ] Confirm password matching
  - [ ] Call register API
  - [ ] Success message & redirect

- [ ] **Forgot Password** (`src/pages/Auth/ForgotPassword.jsx`)

  - [ ] Email input form
  - [ ] Call forgot password API
  - [ ] Success message
  - [ ] Link back to login

- [ ] **Auth Layout** (`src/layouts/AuthLayout.jsx`)
  - [ ] Centered layout design
  - [ ] Logo/branding
  - [ ] Responsive design

---

## 📊 Module 2: Dashboard

**Người phụ trách:** Dang Thanh Duy  
**Deadline:** 27/10/2025

### Tasks:

- [ ] **Dashboard Page** (`src/pages/Dashboard/Dashboard.jsx`)

  - [ ] Summary cards (4 cards)
  - [ ] Fetch dashboard stats API
  - [ ] Recent activities table
  - [ ] Quick action buttons
  - [ ] Responsive grid layout

- [ ] **Line Chart** (`src/components/charts/LineChart.jsx`)

  - [ ] Implement with Recharts
  - [ ] Monthly sales trend
  - [ ] Tooltips & legends
  - [ ] Responsive

- [ ] **Bar Chart** (`src/components/charts/BarChart.jsx`)

  - [ ] Sales by region/dealer
  - [ ] Color coding
  - [ ] Interactive tooltips

- [ ] **Pie Chart** (`src/components/charts/PieChart.jsx`)
  - [ ] Top vehicles distribution
  - [ ] Color palette
  - [ ] Percentage labels

---

## 🚗 Module 3: Vehicle Management

**Người phụ trách:** Huynh Nguyen Dang  
**Deadline:** 27/10/2025

### Tasks:

- [ ] **Vehicle List** (`src/pages/Vehicles/VehicleList.jsx`)

  - [ ] Table with columns (Image, Model, Type, Price, Stock, Dealer)
  - [ ] Search functionality
  - [ ] Filters (type, price, dealer)
  - [ ] Pagination
  - [ ] Add New button
  - [ ] View/Edit/Delete actions

- [ ] **Vehicle Detail** (`src/pages/Vehicles/VehicleDetail.jsx`)

  - [ ] Image gallery/carousel
  - [ ] Specifications display
  - [ ] Color variants
  - [ ] Stock information
  - [ ] Edit/Delete buttons
  - [ ] Fetch vehicle by ID API

- [ ] **Vehicle Form** (`src/pages/Vehicles/VehicleForm.jsx`)
  - [ ] Form fields (model, type, price, battery, range, etc.)
  - [ ] Image upload (multiple)
  - [ ] Color variant selector
  - [ ] Form validation
  - [ ] Create/Update API calls
  - [ ] Success/error messages

---

## 💰 Module 4: Sales Management

**Người phụ trách:** Tran Minh Nhut  
**Deadline:** 27/10/2025

### Tasks:

- [ ] **Sales List** (`src/pages/Sales/SalesList.jsx`)

  - [ ] Orders table
  - [ ] Status badges (Pending, Confirmed, Completed, Cancelled)
  - [ ] Filters (status, date range, payment type)
  - [ ] Search orders
  - [ ] View details button
  - [ ] Create Quote button

- [ ] **Quote Create** (`src/pages/Sales/QuoteCreate.jsx`)

  - [ ] Customer selection/creation
  - [ ] Vehicle selection
  - [ ] Quantity & pricing
  - [ ] Discount calculation
  - [ ] Payment type selector
  - [ ] Generate quote API
  - [ ] Print/Download quote

- [ ] **Order Detail** (`src/pages/Sales/OrderDetail.jsx`)
  - [] Order information display
  - [ ] Customer details
  - [ ] Vehicle details
  - [ ] Payment information
  - [ ] Payment schedule (installments)
  - [ ] Contract upload/view
  - [ ] Status update buttons
  - [ ] Record payment button

---

## 👥 Module 5: Customer Management

**Người phụ trách:** Nguyen Chi Trung  
**Deadline:** 23/10/2025

### Tasks:

- [ ] **Customer List** (`src/pages/Customers/CustomerList.jsx`)

  - [ ] Table (Name, Email, Phone, Purchases, Status)
  - [ ] Search customers
  - [ ] Filter by status
  - [ ] Add New Customer button
  - [ ] View details action

- [ ] **Customer Detail** (`src/pages/Customers/CustomerDetail.jsx`)

  - [ ] Customer profile display
  - [ ] Purchase history table
  - [ ] Test drive history
  - [ ] Feedback & complaints section
  - [ ] Edit customer button
  - [ ] Schedule test drive button

- [ ] **Test Drive Form** (`src/pages/Customers/TestDriveForm.jsx`)
  - [ ] Customer selection
  - [ ] Vehicle selection
  - [ ] Date & time picker
  - [ ] Duration selector
  - [ ] Notes field
  - [ ] Schedule API call
  - [ ] Confirmation message

---

## 🏢 Module 6: Dealer Management

**Người phụ trách:** Đặng Thanh Duy  
**Deadline:** 24/10/2025

### Tasks:

- [ ] **Dealer List** (`src/pages/Dealers/DealerList.jsx`)

  - [ ] Table (Name, Region, Contact, Target, Debt, Status)
  - [ ] Search dealers
  - [ ] Filter by region
  - [ ] Add New Dealer (Admin only)
  - [ ] View performance button

- [ ] **Dealer Detail** (`src/pages/Dealers/DealerDetail.jsx`)
  - [ ] Dealer information display
  - [ ] Performance metrics cards
  - [ ] Monthly performance chart
  - [ ] Debt information
  - [ ] Contract upload/view
  - [ ] Edit dealer button
  - [ ] Set targets form

---

## 📈 Module 7: Reports & Analytics

**Người phụ trách:** Đặng Thanh Duy  
**Deadline:** 27/10/2025

### Tasks:

- [ ] **Reports Page** (`src/pages/Reports/Reports.jsx`)
  - [ ] Report type selector
  - [ ] Date range picker
  - [ ] Filter options (region, dealer, vehicle)
  - [ ] Generate report button
  - [ ] Summary statistics cards
  - [ ] Charts display (sales by region, by dealer)
  - [ ] Export to Excel button
  - [ ] Export to PDF button
  - [ ] Download functionality

---

## 🔔 Module 8: Notifications

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] **Notifications Page** (`src/pages/Notifications/Notifications.jsx`)

  - [ ] Notification list
  - [ ] Unread indicator
  - [ ] Filter by type (Orders, Deliveries, Payments, System)
  - [ ] Mark as read/unread
  - [ ] Delete notification
  - [ ] Mark all as read button
  - [ ] Preferences link

- [ ] **Notification Preferences** (`src/pages/Notifications/NotificationPreferences.jsx`)

  - [ ] Email notifications toggle
  - [ ] SMS notifications toggle
  - [ ] In-app notifications toggle
  - [ ] Notification types checkboxes
  - [ ] Save preferences API
  - [ ] Success message

- [ ] **Topbar Notification Bell** (`src/components/common/Topbar.jsx`)
  - [ ] Notification icon with badge
  - [ ] Unread count
  - [ ] Dropdown preview
  - [ ] Real-time updates (optional)

---

## ⚙️ Module 9: Settings

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] **Settings Page** (`src/pages/Settings/Settings.jsx`)
  - [ ] Tab navigation (Profile, Password, Permissions)
  - [ ] Profile tab: Update name, email, phone, avatar
  - [ ] Password tab: Change password form
  - [ ] Permissions tab: Role management (Admin only)
  - [ ] Update profile API
  - [ ] Change password API
  - [ ] Success/error messages

---

## 🧩 Module 10: Common Components

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] **Sidebar** (`src/components/common/Sidebar.jsx`)

  - [ ] Menu items with icons
  - [ ] Active state highlighting
  - [ ] Collapsible (optional)
  - [ ] Logo/branding
  - [ ] Responsive (mobile drawer)

- [ ] **Topbar** (`src/components/common/Topbar.jsx`)

  - [ ] Search bar
  - [ ] Notification bell
  - [ ] User menu dropdown
  - [ ] Logout functionality

- [ ] **Table** (`src/components/common/Table.jsx`)

  - [ ] Sortable columns
  - [ ] Row actions
  - [ ] Empty state
  - [ ] Loading state

- [ ] **Modal** (`src/components/common/Modal.jsx`)

  - [ ] Backdrop
  - [ ] Close button
  - [ ] Responsive
  - [ ] Animation

- [ ] **Button** (`src/components/common/Button.jsx`)

  - [ ] Variants (primary, secondary, danger)
  - [ ] Sizes (small, medium, large)
  - [ ] Loading state
  - [ ] Disabled state

- [ ] **Input** (`src/components/common/Input.jsx`)

  - [ ] Label
  - [ ] Error message
  - [ ] Validation states
  - [ ] Different types

- [ ] **Card** (`src/components/common/Card.jsx`)

  - [ ] Header, body, footer
  - [ ] Shadow/border styles
  - [ ] Responsive

- [ ] **Pagination** (`src/components/common/Pagination.jsx`)

  - [ ] Page numbers
  - [ ] Previous/Next buttons
  - [ ] Page size selector
  - [ ] Total count display

- [ ] **Loading** (`src/components/common/Loading.jsx`)

  - [ ] Spinner animation
  - [ ] Skeleton loader (optional)
  - [ ] Full page overlay option

- [ ] **ProtectedRoute** (`src/components/common/ProtectedRoute.jsx`)
  - [ ] Check authentication
  - [ ] Check user role
  - [ ] Redirect to login if not authenticated
  - [ ] Redirect to unauthorized if wrong role

---

## 🎨 Module 11: Styling & Polish

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] **Global Styles**

  - [ ] Color palette consistency
  - [ ] Typography system
  - [ ] Spacing system
  - [ ] Responsive breakpoints

- [ ] **Responsive Design**

  - [ ] Mobile (< 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (> 1024px)

- [ ] **Accessibility**
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Color contrast
  - [ ] Focus states

---

## 🧪 Testing & QA

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] **Manual Testing**

  - [ ] All pages load correctly
  - [ ] All forms submit successfully
  - [ ] All API calls work
  - [ ] Error handling works
  - [ ] Loading states display
  - [ ] Navigation works

- [ ] **Cross-browser Testing**

  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Responsive Testing**
  - [ ] Mobile devices
  - [ ] Tablets
  - [ ] Desktop

---

## 📝 Documentation

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] Update README.md
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guide
- [ ] User manual (optional)

---

## 🚀 Deployment

**Người phụ trách:** **\*\*\*\***\_**\*\*\*\***  
**Deadline:** **\*\*\*\***\_**\*\*\*\***

### Tasks:

- [ ] Build production version
- [ ] Test production build
- [ ] Setup hosting (Vercel/Netlify/etc.)
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Test live site
- [ ] Setup CI/CD (optional)

---

## 📊 Progress Tracking

| Module            | Progress | Status         |
| ----------------- | -------- | -------------- |
| Authentication    | 0%       | ⏳ Not Started |
| Dashboard         | 0%       | ⏳ Not Started |
| Vehicles          | 0%       | ⏳ Not Started |
| Sales             | 0%       | ⏳ Not Started |
| Customers         | 0%       | ⏳ Not Started |
| Dealers           | 0%       | ⏳ Not Started |
| Reports           | 0%       | ⏳ Not Started |
| Notifications     | 0%       | ⏳ Not Started |
| Settings          | 0%       | ⏳ Not Started |
| Common Components | 0%       | ⏳ Not Started |
| Styling           | 0%       | ⏳ Not Started |
| Testing           | 0%       | ⏳ Not Started |

**Overall Progress:** 0%

---

## 📅 Timeline

| Week   | Focus                     | Deliverables                            |
| ------ | ------------------------- | --------------------------------------- |
| Week 1 | Setup & Common Components | Layouts, Sidebar, Topbar, Common UI     |
| Week 2 | Auth & Dashboard          | Login, Register, Dashboard with charts  |
| Week 3 | Vehicles & Sales          | Vehicle management, Sales/Orders        |
| Week 4 | Customers & Dealers       | Customer management, Dealer management  |
| Week 5 | Reports & Notifications   | Reports, Notifications, Settings        |
| Week 6 | Polish & Testing          | Styling, Responsive, Testing            |
| Week 7 | Deployment                | Production build, Deploy, Documentation |

---

**Last Updated:** **\*\***\_\_\_**\*\***  
**Next Review:** **\*\***\_\_\_**\*\***
