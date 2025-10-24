import api from './api'
import { mockNotifications, mockNotificationStats } from '../data/mockNotifications'

class NotificationService {
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
