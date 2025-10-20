/**
 * Route Configuration
 * TODO: Configure all application routes with React Router
 */

import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth Pages
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ForgotPassword from '../pages/Auth/ForgotPassword'

// Main Pages
import Dashboard from '../pages/Dashboard/Dashboard'
import VehicleList from '../pages/Vehicles/VehicleList'
import VehicleDetail from '../pages/Vehicles/VehicleDetail'
import VehicleForm from '../pages/Vehicles/VehicleForm'
import SalesList from '../pages/Sales/SalesList'
import QuoteCreate from '../pages/Sales/QuoteCreate'
import OrderDetail from '../pages/Sales/OrderDetail'
import CustomerList from '../pages/Customers/CustomerList'
import CustomerDetail from '../pages/Customers/CustomerDetail'
import TestDriveForm from '../pages/Customers/TestDriveForm'
import DealerList from '../pages/Dealers/DealerList'
import DealerDetail from '../pages/Dealers/DealerDetail'
import Reports from '../pages/Reports/Reports'
import Notifications from '../pages/Notifications/Notifications'
import NotificationPreferences from '../pages/Notifications/NotificationPreferences'
import Settings from '../pages/Settings/Settings'

// Protected Route
import ProtectedRoute from '../components/common/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Vehicle Routes */}
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
        
        {/* Sales Routes */}
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/quote/new" element={<QuoteCreate />} />
        <Route path="/sales/:id" element={<OrderDetail />} />
        
        {/* Customer Routes */}
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/customers/test-drive/new" element={<TestDriveForm />} />
        
        {/* Dealer Routes */}
        <Route path="/dealers" element={<DealerList />} />
        <Route path="/dealers/:id" element={<DealerDetail />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/preferences" element={<NotificationPreferences />} />
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes

