/**
 * Notification Preferences Page - Modern UI with Material-UI
 * Features:
 * - Email notifications toggle
 * - SMS notifications toggle
 * - In-app notifications toggle
 * - Notification types checkboxes
 * - Save preferences functionality
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Checkbox,
  Container,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Breadcrumbs,
  Link,
  FormGroup,
  FormControl,
  FormLabel,
  Chip,
  Avatar
} from '@mui/material'
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as NotificationsIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Payment as PaymentsIcon,
  Settings as SystemIcon,
  Campaign as PromotionsIcon,
  Save as SaveIcon,
  NavigateNext as NextIcon,
  Home as HomeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'

import notificationService from '../../services/notificationService'

const NotificationPreferences = () => {
  const navigate = useNavigate()

  // State management
  const [preferences, setPreferences] = useState({
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
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await notificationService.getNotificationPreferences()
      setPreferences(response.data)
    } catch (err) {
      setError(err.message || 'Không thể tải tùy chọn thông báo')
      console.error('Error loading preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChannelChange = (channel) => (event) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: event.target.checked
    }))
  }

  const handleTypeChange = (type) => (event) => {
    setPreferences(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: event.target.checked
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await notificationService.updateNotificationPreferences(preferences)
      setSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Không thể lưu tùy chọn thông báo')
      console.error('Error saving preferences:', err)
    } finally {
      setSaving(false)
    }
  }

  const notificationTypeOptions = [
    {
      key: 'orders',
      label: 'Đơn hàng mới',
      icon: <OrdersIcon />,
      description: 'Thông báo khi có đơn hàng mới'
    },
    {
      key: 'deliveries',
      label: 'Cập nhật giao hàng',
      icon: <DeliveriesIcon />,
      description: 'Thông báo về trạng thái giao hàng'
    },
    {
      key: 'payments',
      label: 'Thanh toán',
      icon: <PaymentsIcon />,
      description: 'Thông báo về thanh toán và hóa đơn'
    },
    {
      key: 'system',
      label: 'Hệ thống',
      icon: <SystemIcon />,
      description: 'Thông báo bảo mật và hệ thống'
    },
    {
      key: 'promotions',
      label: 'Khuyến mãi',
      icon: <PromotionsIcon />,
      description: 'Thông báo về chương trình khuyến mãi'
    }
  ]

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải tùy chọn thông báo...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#666' } }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, color: '#1976d2' }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/notifications')
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <NotificationsIcon sx={{ mr: 0.5, color: '#1976d2' }} fontSize="inherit" />
            Thông báo
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
            <SettingsIcon sx={{ mr: 0.5, color: '#1976d2' }} fontSize="inherit" />
            Tùy chọn
          </Typography>
        </Breadcrumbs>

        {/* Hero Header */}
        <Box
          sx={{
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            borderRadius: 4,
            p: 6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                border: '4px solid white',
                mr: 3
              }}
            >
              <SettingsIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5, #1565c0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.02em'
              }}
            >
              Tùy chọn thông báo
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              opacity: 0.8
            }}
          >
            Tùy chỉnh cách bạn nhận thông báo để không bỏ lỡ thông tin quan trọng
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Tùy chọn thông báo đã được lưu thành công!
          </Alert>
        )}

        <Grid container spacing={6}>
          {/* Notification Channels */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                height: '100%',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mr: 3,
                      width: 60,
                      height: 60,
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <NotificationsIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a202c' }}>
                      Kênh thông báo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                      Chọn cách nhận thông báo
                    </Typography>
                  </Box>
                </Box>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <FormGroup sx={{ gap: 3 }}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: '0 20px 45px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 120,
                          height: 120,
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%',
                          zIndex: 0
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.emailNotifications}
                            onChange={handleChannelChange('emailNotifications')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffffff',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: 'rgba(255,255,255,0.3)'
                                }
                              },
                              '& .MuiSwitch-switchBase': {
                                color: 'rgba(255,255,255,0.7)'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
                              <EmailIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                                Email
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                                Nhận thông báo qua email
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>

                    <Paper
                      elevation={4}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(245, 87, 108, 0.2)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: '0 20px 45px rgba(245, 87, 108, 0.3)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 120,
                          height: 120,
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%',
                          zIndex: 0
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.smsNotifications}
                            onChange={handleChannelChange('smsNotifications')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffffff',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: 'rgba(255,255,255,0.3)'
                                }
                              },
                              '& .MuiSwitch-switchBase': {
                                color: 'rgba(255,255,255,0.7)'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
                              <SmsIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                                SMS
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                                Nhận thông báo qua tin nhắn
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>

                    <Paper
                      elevation={4}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(79, 172, 254, 0.2)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: '0 20px 45px rgba(79, 172, 254, 0.3)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 120,
                          height: 120,
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%',
                          zIndex: 0
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={preferences.inAppNotifications}
                            onChange={handleChannelChange('inAppNotifications')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffffff',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: 'rgba(255,255,255,0.3)'
                                }
                              },
                              '& .MuiSwitch-switchBase': {
                                color: 'rgba(255,255,255,0.7)'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
                              <NotificationsIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                                Trong ứng dụng
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                                Hiển thị thông báo trong ứng dụng
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  </FormGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Types */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                height: '100%',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      mr: 3,
                      width: 60,
                      height: 60,
                      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a202c' }}>
                      Loại thông báo
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                      Chọn loại thông báo bạn muốn nhận
                    </Typography>
                  </Box>
                </Box>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <FormGroup sx={{ gap: 3 }}>
                    {notificationTypeOptions.map((option, index) => {
                      const gradients = [
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                      ]
                      const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a']

                      return (
                        <Paper
                          key={option.key}
                          elevation={4}
                          sx={{
                            p: 4,
                            borderRadius: 3,
                            background: gradients[index % gradients.length],
                            border: '2px solid rgba(255,255,255,0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: `0 15px 35px ${colors[index % colors.length]}33`,
                            '&:hover': {
                              transform: 'translateY(-4px) scale(1.02)',
                              boxShadow: `0 20px 45px ${colors[index % colors.length]}4D`,
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: -50,
                              right: -50,
                              width: 120,
                              height: 120,
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '50%',
                              zIndex: 0
                            }
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={preferences.notificationTypes[option.key]}
                                onChange={handleTypeChange(option.key)}
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#ffffff',
                                    '& .MuiSvgIcon-root': {
                                      backgroundColor: 'rgba(255,255,255,0.2)',
                                      borderRadius: '50%'
                                    }
                                  },
                                  '& .MuiSvgIcon-root': {
                                    color: 'rgba(255,255,255,0.8)'
                                  }
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
                                <Avatar sx={{ mr: 3, bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
                                  {option.icon}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                                    {option.label}
                                  </Typography>
                                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                                    {option.description}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                          />
                        </Paper>
                      )
                    })}
                  </FormGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)'
              },
              transition: 'all 0.3s ease',
              textTransform: 'none'
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu tùy chọn'}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default NotificationPreferences

