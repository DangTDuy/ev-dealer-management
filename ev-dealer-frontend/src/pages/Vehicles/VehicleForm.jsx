/**
 * Vehicle Form (Add/Edit)
 * Supports both create and update modes
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Divider
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  DriveEta as CarIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'

const VehicleForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // Form state
  const [formData, setFormData] = useState({
    vehicleName: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    status: 'Available',
    description: '',
    image: null
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  // Options
  const brands = [
    'Tesla', 'Toyota', 'Honda', 'Ford', 'Chevrolet',
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Nissan',
    'Hyundai', 'Kia', 'Lexus', 'Porsche', 'Jaguar'
  ]

  const statuses = [
    { value: 'Available', label: 'Available', color: 'success' },
    { value: 'Sold', label: 'Sold', color: 'error' },
    { value: 'In Maintenance', label: 'In Maintenance', color: 'warning' },
    { value: 'Reserved', label: 'Reserved', color: 'info' }
  ]

  // Load data on mount
  useEffect(() => {
    if (isEditMode) {
      loadVehicle()
    }
  }, [id])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      const vehicle = await vehicleService.getVehicleById(id)
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        price: vehicle.price || '',
        status: vehicle.status || 'Available',
        description: vehicle.description || '',
        image: null
      })
      if (vehicle.images && vehicle.images[0]) {
        setImagePreview(vehicle.images[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load vehicle')
      console.error('Error loading vehicle:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Basic validation
    if (!formData.vehicleName || !formData.brand || !formData.model || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        year: parseInt(formData.year)
      }

      if (isEditMode) {
        await vehicleService.updateVehicle(id, submitData)
      } else {
        await vehicleService.createVehicle(submitData)
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/vehicles')
      }, 1500)

    } catch (err) {
      setError(err.message || 'Failed to save vehicle')
      console.error('Error saving vehicle:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/vehicles')
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading vehicle...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <IconButton
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CarIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
          {isEditMode ? 'Update vehicle information with modern interface' : 'Create a new vehicle entry with rich details'}
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}
          icon={<CheckCircleIcon />}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Vehicle {isEditMode ? 'updated' : 'created'} successfully! Redirecting to vehicle list...
          </Typography>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
            border: '1px solid rgba(244, 67, 54, 0.3)'
          }}
          icon={<ErrorIcon />}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {error}
          </Typography>
        </Alert>
      )}

      {/* Form Card */}
      <Card
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0f7ff 100%)',
          border: '2px solid rgba(25, 118, 210, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              
              {/* Row 1: Vehicle Identity */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05))',
                    border: '2px solid rgba(25, 118, 210, 0.1)',
                    borderLeft: '6px solid #1976d2'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BuildIcon sx={{ color: '#1976d2', mr: 2, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      Vehicle Identity
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Vehicle Name"
                        placeholder="e.g., Tesla Model S Plaid, BMW i8, Toyota Prius"
                        value={formData.vehicleName}
                        onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(25, 118, 210, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#1976d2'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1976d2',
                              borderWidth: 3
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel sx={{ fontSize: '1rem', fontWeight: 600 }}>Brand</InputLabel>
                        <Select
                          value={formData.brand}
                          label="Brand"
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                              borderColor: 'rgba(25, 118, 210, 0.3)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#1976d2'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#1976d2',
                              borderWidth: 3
                            }
                          }}
                        >
                          {brands.map((brand) => (
                            <MenuItem key={brand} value={brand} sx={{ fontSize: '1rem' }}>
                              {brand}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Row 2: Model, Year, Price */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {/* Model */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(129, 199, 132, 0.05))',
                        border: '2px solid rgba(76, 175, 80, 0.1)',
                        borderLeft: '4px solid #4caf50',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CarIcon sx={{ color: '#4caf50', mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          Model
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Model Name"
                        placeholder="e.g., Model 3, i8, Prius"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(76, 175, 80, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#4caf50'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Paper>
                  </Grid>

                  {/* Year */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05), rgba(255, 183, 77, 0.05))',
                        border: '2px solid rgba(255, 152, 0, 0.1)',
                        borderLeft: '4px solid #ff9800',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarIcon sx={{ color: '#ff9800', mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                          Year
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Manufacturing Year"
                        type="number"
                        placeholder="2025"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        inputProps={{ 
                          min: 1900, 
                          max: new Date().getFullYear() + 1,
                          step: 1
                        }}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(255, 152, 0, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#ff9800'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff9800',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Paper>
                  </Grid>

                  {/* Price */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.05), rgba(186, 104, 200, 0.05))',
                        border: '2px solid rgba(156, 39, 176, 0.1)',
                        borderLeft: '4px solid #9c27b0',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MoneyIcon sx={{ color: '#9c27b0', mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                          Price
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Vehicle Price"
                        type="number"
                        placeholder="45000"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <strong style={{ fontSize: '1rem' }}>$</strong>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(156, 39, 176, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#9c27b0'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#9c27b0',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Row 3: Status and Description - Cùng hàng */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/* Status - Cột trái */}
                  <Grid size={{ xs: 40, md: 8 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(229, 115, 115, 0.05))',
                        border: '2px solid rgba(244, 67, 54, 0.1)',
                        borderLeft: '4px solid #f44336',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ color: '#f44336', mr: 1.5, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                          Status
                        </Typography>
                      </Box>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: '1rem', fontWeight: 600 }}>Current Status</InputLabel>
                        <Select
                          value={formData.status}
                          label="Current Status"
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                              borderColor: 'rgba(244, 67, 54, 0.3)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#f44336'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#f44336',
                              borderWidth: 2
                            }
                          }}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status.value} value={status.value} sx={{ fontSize: '1rem' }}>
                              <Chip 
                                label={status.label}
                                color={status.color}
                                size="medium"
                                variant="filled"
                                sx={{ 
                                  fontWeight: 'bold',
                                  minWidth: 120
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* Description - Cột phải */}
                  <Grid size={{ xs: 40, md: 10 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.05), rgba(77, 208, 225, 0.05))',
                        border: '2px solid rgba(0, 188, 212, 0.1)',
                        borderLeft: '4px solid #00bcd4',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DescriptionIcon sx={{ color: '#00bcd4', mr: 2, fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                          Description
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Vehicle Description"
                        placeholder="Describe the vehicle's features, condition, specifications, and any special notes..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(0, 188, 212, 0.3)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#00bcd4'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00bcd4',
                              borderWidth: 2
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Row 4: Vehicle Image - Riêng hàng */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p:3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.05), rgba(149, 117, 205, 0.05))',
                    border: '2px solid rgba(103, 58, 183, 0.1)',
                    borderLeft: '4px solid #673ab7'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PhotoCameraIcon sx={{ color: '#673ab7', mr: 2, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                      Vehicle Image
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                          borderRadius: 3,
                          border: '2px dashed #673ab7',
                          color: '#673ab7',
                          py: 2,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          '&:hover': {
                            borderColor: '#5e35b1',
                            backgroundColor: 'rgba(103, 58, 183, 0.04)',
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Choose Vehicle Image
                      </Button>
                    </label>
                  </Box>

                  {imagePreview && (
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Vehicle preview"
                        sx={{
                          width: '100%',
                          maxWidth: 1200,
                          height:  600,
                          objectFit: 'cover',
                          borderRadius: 3,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          border: '3px solid rgba(103, 58, 183, 0.3)'
                        }}
                      />
                      <IconButton
                        size="large"
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: 24,
                          right: 24,
                          backgroundColor: 'rgba(244, 67, 54, 0.95)',
                          color: 'white',
                          border: '2px solid white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          '&:hover': {
                            backgroundColor: '#d32f2f',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4, borderColor: 'rgba(25, 118, 210, 0.2)' }} />
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      borderColor: '#e0e0e0',
                      color: '#666666',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      fontFamily: 'Inter, Roboto, sans-serif',
                      minWidth: 180,
                      backgroundColor: '#ffffff',
                      border: '2px solid #e0e0e0',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: '#f8f9ff',
                        color: '#1976d2',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      background: 'linear-gradient(135deg, #1976d2, #00bcd4)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      fontFamily: 'Inter, Roboto, sans-serif',
                      minWidth: 180,
                      boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0, #0097a7)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4)'
                      },
                      '&:disabled': {
                        background: '#cccccc',
                        color: '#999999',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Vehicle')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default VehicleForm