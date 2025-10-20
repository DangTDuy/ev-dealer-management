import api from './api'

const authService = {
  // Login
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      // Save token and user info
      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
      }
      
      return response
    } catch (error) {
      throw error
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response
    } catch (error) {
      throw error
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response
    } catch (error) {
      throw error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    window.location.href = '/login'
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

export default authService

