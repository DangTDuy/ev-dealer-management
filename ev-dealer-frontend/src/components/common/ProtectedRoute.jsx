/**
 * Protected Route Component
 * TODO: Implement route protection based on authentication and role
 */

import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole }) => {
  // TODO: Get auth state from context/store
  const isAuthenticated = false // Replace with actual auth check
  const userRole = null // Replace with actual user role

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute

