import api from './api'
import { mockNotifications, mockNotificationStats } from '../data/mockNotifications'

class NotificationService {
  // ============ NotificationService Backend API Methods ============
  
  // Test send email
  async sendTestEmail(to, subject, htmlContent) {
    try {
      const response = await api.post('/notifications/test-email', {
        to,
        subject,
        htmlContent
      })
      return response.data
    } catch (error) {
      console.error('Error sending test email:', error)
      throw error
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData) {
    try {
      const response = await api.post('/notifications/order-confirmation', orderData)
      return response.data
    } catch (error) {
      console.error('Error sending order confirmation:', error)
      throw error
    }
  }

  // Send reservation confirmation SMS
  async sendReservationConfirmation(reservationData) {
    try {
      const response = await api.post('/notifications/reservation-confirmation', reservationData)
      return response.data
    } catch (error) {
      console.error('Error sending reservation confirmation:', error)
      throw error
    }
  }

  // Send test drive confirmation email
  async sendTestDriveConfirmation(testDriveData) {
    try {
      const response = await api.post('/notifications/test-drive-confirmation', testDriveData)
      return response.data
    } catch (error) {
      console.error('Error sending test drive confirmation:', error)
      throw error
    }
  }

  // Test send SMS
  async sendTestSms(phoneNumber, message) {
    try {
      const response = await api.post('/notifications/test-sms', {
        phoneNumber,
        message
      })
      return response.data
    } catch (error) {
      console.error('Error sending test SMS:', error)
      throw error
    }
  }

  // Check NotificationService health
  async checkHealth() {
    try {
      const response = await api.get('/notifications/health')
      return response.data
    } catch (error) {
      console.error('Error checking notification service health:', error)
      throw error
    }
  }

  // ============ Legacy Notification UI Methods ============
  
  // Get all notifications
  async getNotifications() {
    try {
      // TODO: Replace with real API call
      // return await api.get('/notifications')

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockNotifications,
            success: true
          })
        }, 500)
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  // Get notification stats
  async getNotificationStats() {
    try {
      // TODO: Replace with real API call
      // return await api.get('/notifications/stats')

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockNotificationStats,
            success: true
          })
        }, 300)
      })
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      throw error
    }
  }

  // Mark notification as read/unread
  async markAsRead(notificationId, isRead = true) {
    try {
      // TODO: Replace with real API call
      // return await api.patch(`/notifications/${notificationId}`, { isRead })

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: { id: notificationId, isRead },
            success: true,
            message: `Notification marked as ${isRead ? 'read' : 'unread'}`
          })
        }, 300)
      })
    } catch (error) {
      console.error('Error updating notification:', error)
      throw error
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      // TODO: Replace with real API call
      // return await api.patch('/notifications/mark-all-read')

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'All notifications marked as read'
          })
        }, 500)
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      // TODO: Replace with real API call
      // return await api.delete(`/notifications/${notificationId}`)

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Notification deleted successfully'
          })
        }, 300)
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  // Get notification preferences
  async getNotificationPreferences() {
    try {
      // TODO: Replace with real API call
      // return await api.get('/notifications/preferences')

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              emailNotifications: true,
              smsNotifications: false,
              inAppNotifications: true,
              notificationTypes: {
                orders: true,
                deliveries: true,
                payments: true,
                system: false,
                promotions: false
              }
            },
            success: true
          })
        }, 300)
      })
    } catch (error) {
      console.error('Error fetching notification preferences:', error)
      throw error
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences) {
    try {
      // TODO: Replace with real API call
      // return await api.put('/notifications/preferences', preferences)

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: preferences,
            success: true,
            message: 'Notification preferences updated successfully'
          })
        }, 500)
      })
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      throw error
    }
  }
}

export default new NotificationService()
