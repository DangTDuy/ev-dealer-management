/**
 * Register Page
 * Complete registration form with validation and password strength indicator
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
  CheckCircle,
} from '@mui/icons-material'
import authService from '../../services/authService'
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateRequired,
  getPasswordStrength,
} from '../../utils/validators'

const Register = () => {
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Password strength
  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null

  // Fix autocomplete text color
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll('input')
      inputs.forEach(input => {
        input.style.color = '#000000'
        input.style.webkitTextFillColor = '#000000'
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [formData])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validate = () => {
    const newErrors = {}

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Vui lòng nhập họ tên'
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự'
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)'
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate
    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      // Call register API
      await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 0.3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Tạo Tài Khoản
      </Typography>
      <Typography variant="caption" align="center" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Tham gia mạng lưới đại lý xe điện ngay hôm nay
      </Typography>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 0.5, py: 0.3, fontSize: '0.75rem' }}>
          <Typography variant="caption" fontSize="0.75rem">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</Typography>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 0.5, py: 0.3 }} onClose={() => setError('')}>
          <Typography variant="caption" fontSize="0.75rem">{error}</Typography>
        </Alert>
      )}


      {/* Name Field */}
      <TextField
        fullWidth
        label="Họ và Tên"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="name"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'words',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Email Field */}
      <TextField
        fullWidth
        label="Địa chỉ Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="email"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Phone Field */}
      <TextField
        fullWidth
        label="Số Điện Thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        disabled={loading}
        margin="dense"
        size="small"
        placeholder="0912345678"
        autoComplete="tel"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        fullWidth
        label="Mật khẩu"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="new-password"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Password Strength Indicator - Fixed Height */}
      <Box sx={{ height: '28px', mt: 0.2 }}>
        {formData.password && passwordStrength && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.1 }}>
              <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                Độ mạnh mật khẩu
              </Typography>
              <Typography variant="caption" color={`${passwordStrength.color}.main`} fontSize="0.6rem">
                {passwordStrength.text}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                passwordStrength.level === 'weak'
                  ? 33
                  : passwordStrength.level === 'medium'
                  ? 66
                  : 100
              }
              color={passwordStrength.color}
              sx={{ height: 2.5, borderRadius: 2 }}
            />
          </Box>
        )}
      </Box>

      {/* Confirm Password Field */}
      <TextField
        fullWidth
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="new-password"
        inputProps={{
          spellCheck: false,
          autoCorrect: 'off',
          autoCapitalize: 'off',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                size="small"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Register Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || success}
        sx={{
          mt: 1,
          mb: 1,
          py: 1,
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Tạo Tài Khoản'}
      </Button>

      {/* Login Link */}
      <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          style={{ textDecoration: 'none', color: '#667eea', fontWeight: 600 }}
        >
          Đăng nhập
        </Link>
      </Typography>
    </Box>
  )
}

export default Register

