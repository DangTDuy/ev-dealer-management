# 🚗 EV Dealer Management System - Frontend

A comprehensive web platform for managing electric vehicle sales through dealerships.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![MUI](https://img.shields.io/badge/MUI-5.15-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Team Workflow](#-team-workflow)

---

## ✨ Features

### 🔐 Multi-Role Access
- **Dealer Staff** - Manage sales, customers, test drives
- **Dealer Manager** - Oversee dealership operations, reports
- **EVM Staff** - Manage vehicles, dealers, inventory
- **Admin** - System administration, user management

### 🎯 Core Modules
- **Dashboard** - Real-time analytics and insights
- **Vehicle Management** - Inventory, specifications, pricing
- **Sales Management** - Quotes, orders, contracts, payments
- **Customer Management** - Profiles, test drives, feedback
- **Dealer Management** - Performance tracking, contracts
- **Reports & Analytics** - Sales reports, inventory summaries
- **Notification Center** - Real-time updates and alerts
- **Settings** - User profile and system configuration

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - UI library
- **Vite 7** - Build tool and dev server

### UI & Styling
- **Material-UI (MUI)** - Component library
- **TailwindCSS** - Utility-first CSS
- **Emotion** - CSS-in-JS

### Routing & State
- **React Router DOM v6** - Client-side routing
- **Zustand** - State management (optional)

### Data & Charts
- **Axios** - HTTP client
- **Recharts** - Chart library
- **date-fns** - Date utilities

### Forms & Validation
- **React Hook Form** - Form handling
- Custom validators

---

## 📁 Project Structure

```
ev-dealer-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # UI components (Button, Table, Modal, etc.)
│   │   ├── charts/         # Chart components (Line, Bar, Pie)
│   │   └── forms/          # Form components (Search, Filter, DatePicker)
│   │
│   ├── layouts/            # Layout components
│   │   ├── MainLayout.jsx  # Dashboard layout
│   │   └── AuthLayout.jsx  # Authentication layout
│   │
│   ├── pages/              # Page components (25+ pages)
│   │   ├── Auth/           # Login, Register, ForgotPassword
│   │   ├── Dashboard/      # Dashboard
│   │   ├── Vehicles/       # Vehicle management
│   │   ├── Sales/          # Sales & orders
│   │   ├── Customers/      # Customer management
│   │   ├── Dealers/        # Dealer management
│   │   ├── Reports/        # Reports & analytics
│   │   ├── Notifications/  # Notification center
│   │   └── Settings/       # Settings
│   │
│   ├── routes/             # Route configuration
│   ├── services/           # API services (7 services)
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
│
├── public/                 # Public assets
├── Documentation files     # STRUCTURE.md, TEAM_GUIDE.md, etc.
└── Configuration files     # vite.config.js, tailwind.config.js, etc.
```

**📖 See [STRUCTURE.md](./STRUCTURE.md) for detailed structure**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ev-dealer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API endpoints:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_USER_SERVICE_URL=http://localhost:5001/api
   VITE_VEHICLE_SERVICE_URL=http://localhost:5002/api
   # ... other services
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [STRUCTURE.md](./STRUCTURE.md) | Detailed project structure and module breakdown |
| [TEAM_GUIDE.md](./TEAM_GUIDE.md) | Development guidelines for team members |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Complete project summary and features |
| [TASK_CHECKLIST.md](./TASK_CHECKLIST.md) | Task assignment and progress tracking |

---

## 👥 Team Workflow

### Module Assignment
Each team member is assigned one or more modules. See [TASK_CHECKLIST.md](./TASK_CHECKLIST.md) for assignments.

### Development Process
1. Pick a module from the checklist
2. Read the TODO comments in the files
3. Implement UI/UX
4. Integrate with API services
5. Test thoroughly
6. Create pull request
7. Code review
8. Merge to main

### Coding Standards
- **Component naming:** PascalCase
- **Function naming:** camelCase
- **CSS:** TailwindCSS or MUI
- **API calls:** Use services in `src/services/`
- **Error handling:** Always catch and display errors
- **Loading states:** Show loading indicators

**📖 See [TEAM_GUIDE.md](./TEAM_GUIDE.md) for detailed guidelines**

---

## 🔌 API Integration

All API endpoints are defined in service files:

```javascript
// Example: Using vehicle service
import { getVehicles, createVehicle } from '@/services/vehicleService'

const fetchVehicles = async () => {
  try {
    const data = await getVehicles({ page: 1, limit: 10 })
    setVehicles(data)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
  }
}
```

Available services:
- `authService.js` - Authentication
- `vehicleService.js` - Vehicle CRUD
- `salesService.js` - Orders, Quotes, Payments
- `customerService.js` - Customers, Test Drives
- `dealerService.js` - Dealers, Performance
- `reportService.js` - Reports, Analytics
- `notificationService.js` - Notifications

---

## 🎨 UI Components

### Common Components
```javascript
import Button from '@/components/common/Button'
import Table from '@/components/common/Table'
import Modal from '@/components/common/Modal'
import Card from '@/components/common/Card'
```

### Charts
```javascript
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
```

### Forms
```javascript
import SearchBar from '@/components/forms/SearchBar'
import FilterPanel from '@/components/forms/FilterPanel'
import DateRangePicker from '@/components/forms/DateRangePicker'
```

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Manual testing checklist in TASK_CHECKLIST.md
```

---

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel/Netlify
# Follow platform-specific instructions
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Wait for code review
6. Merge after approval

---

## 📞 Support

For questions or issues:
- Check documentation files
- Ask in team chat
- Contact team lead

---

## 🎉 Acknowledgments

Built with ❤️ by the EV Dealer Management Team

**Happy Coding! 🚀**

