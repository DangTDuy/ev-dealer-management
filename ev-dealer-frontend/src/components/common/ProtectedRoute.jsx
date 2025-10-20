/**
 * Protected Route Component
 * Route protection based on authentication and role
 */

import { Navigate } from 'react-router-dom'
import authService from '../../services/authService'

const ProtectedRoute = ({ children, requiredRole }) => {
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getCurrentUser()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

