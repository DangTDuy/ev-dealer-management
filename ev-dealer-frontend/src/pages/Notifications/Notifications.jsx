/**
 * Notifications Page - Modern UI with Material-UI
 * Features:
 * - List of notifications with unread indicators
 * - Filter by type (Orders, Deliveries, Payments, System)
 * - Mark as read/unread functionality
 * - Delete notification
 * - Mark all as read button
 * - Link to notification preferences
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Container,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Fab,
  Fade,
  Breadcrumbs,
  Link
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Payment as PaymentsIcon,
  Settings as SystemIcon,
  DoneAll as MarkAllReadIcon,
  Settings as PreferencesIcon,
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
  RadioButtonUnchecked as UnreadIcon,
  NavigateNext as NextIcon,
  Home as HomeIcon,
  NotificationsActive as ActiveNotificationsIcon
} from '@mui/icons-material'

import notificationService from '../../services/notificationService'
import { notificationTypes } from '../../data/mockNotifications'

const Notifications = () => {
  const navigate = useNavigate()

  // State management
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [markingAll, setMarkingAll] = useState(false)

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  // Filter notifications when filter changes
  useEffect(() => {
    filterNotifications()
  }, [notifications, activeFilter])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const [notificationsResponse, statsResponse] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getNotificationStats()
      ])

      setNotifications(notificationsResponse.data)
      setStats(statsResponse.data)
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    if (activeFilter === 'all') {
      setFilteredNotifications(notifications)
    } else {
      setFilteredNotifications(
        notifications.filter(notification => notification.type === activeFilter)
      )
    }
  }

  const handleMarkAsRead = async (notificationId, isRead) => {
    try {
      await notificationService.markAsRead(notificationId, isRead)

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead }
            : notification
        )
      )

      // Update stats
      if (stats) {
        setStats(prev => ({
          ...prev,
          unread: isRead ? prev.unread - 1 : prev.unread + 1
        }))
      }
    } catch (err) {
      setError('Failed to update notification status')
      console.error('Error updating notification:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true)
      await notificationService.markAllAsRead()

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )

      // Update stats
      if (stats) {
        setStats(prev => ({ ...prev, unread: 0 }))
      }
    } catch (err) {
      setError('Failed to mark all notifications as read')
      console.error('Error marking all as read:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId)

      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )

      // Update stats
      if (stats) {
        const deletedNotification = notifications.find(n => n.id === notificationId)
        if (deletedNotification && !deletedNotification.isRead) {
          setStats(prev => ({
            ...prev,
            unread: prev.unread - 1,
            total: prev.total - 1,
            byType: {
              ...prev.byType,
              [deletedNotification.type]: prev.byType[deletedNotification.type] - 1
            }
          }))
        } else {
          setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            byType: {
              ...prev.byType,
              [deletedNotification.type]: prev.byType[deletedNotification.type] - 1
            }
          }))
        }
      }
    } catch (err) {
      setError('Failed to delete notification')
      console.error('Error deleting notification:', err)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'orders':
        return <OrdersIcon />
      case 'deliveries':
        return <DeliveriesIcon />
      case 'payments':
        return <PaymentsIcon />
      case 'system':
        return <SystemIcon />
      default:
        return <NotificationsIcon />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'orders':
        return '#2196f3'
      case 'deliveries':
        return '#ff9800'
      case 'payments':
        return '#4caf50'
      case 'system':
        return '#9c27b0'
      default:
        return '#757575'
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`

    return date.toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải thông báo...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Trang chủ
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ActiveNotificationsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Thông báo
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Badge badgeContent={stats?.unread || 0} color="error" sx={{ mr: 2 }}>
            <NotificationsIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          </Badge>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Thông báo
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          Theo dõi tất cả hoạt động và cập nhật quan trọng
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số thông báo
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffebee, #fce4ec)',
                border: '1px solid rgba(244, 67, 54, 0.1)'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {stats.unread}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chưa đọc
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
                border: '1px solid rgba(76, 175, 80, 0.1)'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.byType.orders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đơn hàng
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fff3e0, #fce4ec)',
                border: '1px solid rgba(255, 152, 0, 0.1)'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.byType.deliveries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giao hàng
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Actions Bar */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Bộ lọc:
            </Typography>
            {notificationTypes.map((type) => (
              <Chip
                key={type.value}
                label={`${type.icon} ${type.label}`}
                onClick={() => setActiveFilter(type.value)}
                variant={activeFilter === type.value ? 'filled' : 'outlined'}
                color={activeFilter === type.value ? 'primary' : 'default'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={markingAll ? <CircularProgress size={20} /> : <MarkAllReadIcon />}
              onClick={handleMarkAllAsRead}
              disabled={markingAll || stats?.unread === 0}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {markingAll ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<PreferencesIcon />}
              onClick={() => navigate('/notifications/preferences')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Tùy chọn
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Notifications List */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
              <NotificationsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Không có thông báo nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeFilter === 'all'
                  ? 'Bạn chưa có thông báo nào.'
                  : `Không có thông báo loại ${notificationTypes.find(t => t.value === activeFilter)?.label.toLowerCase()}.`
                }
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {filteredNotifications.map((notification, index) => (
                <Fade in={true} timeout={300 + index * 100} key={notification.id}>
                  <div>
                    <ListItem
                      sx={{
                        py: 3,
                        px: 4,
                        backgroundColor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.02)',
                        borderLeft: notification.isRead ? 'none' : `4px solid ${getNotificationColor(notification.type)}`,
                        '&:hover': {
                          backgroundColor: notification.isRead ? 'rgba(0,0,0,0.02)' : 'rgba(25, 118, 210, 0.04)',
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          variant="dot"
                          color="error"
                          invisible={notification.isRead}
                          sx={{
                            '& .MuiBadge-badge': {
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              border: '2px solid white'
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: getNotificationColor(notification.type),
                              width: 50,
                              height: 50,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: notification.isRead ? 'normal' : 'bold',
                                color: notification.isRead ? 'text.primary' : 'text.primary',
                                fontSize: '1.1rem'
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notificationTypes.find(t => t.value === notification.type)?.label}
                              size="small"
                              sx={{
                                bgcolor: getNotificationColor(notification.type),
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'text.primary',
                                mb: 1,
                                fontSize: '1rem'
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.875rem'
                              }}
                            >
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={notification.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}>
                            <IconButton
                              onClick={() => handleMarkAsRead(notification.id, !notification.isRead)}
                              sx={{
                                color: notification.isRead ? '#757575' : '#1976d2',
                                '&:hover': {
                                  backgroundColor: notification.isRead ? 'rgba(117, 117, 117, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {notification.isRead ? <UnreadIcon /> : <ReadIcon />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Xóa thông báo">
                            <IconButton
                              onClick={() => handleDeleteNotification(notification.id)}
                              sx={{
                                color: '#f44336',
                                '&:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && (
                      <Divider sx={{ mx: 4, borderColor: 'rgba(0,0,0,0.06)' }} />
                    )}
                  </div>
                </Fade>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={handleMarkAllAsRead}
        disabled={markingAll || stats?.unread === 0}
      >
        <MarkAllReadIcon />
      </Fab>
    </Container>
  )
}

export default Notifications

