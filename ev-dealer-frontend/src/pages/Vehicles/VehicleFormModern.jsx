/**
 * Vehicle Form Modern - Clean, Clear Dashboard Style
 * Enhanced clarity for better user input experience
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
  Info as InfoIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'

const VehicleFormModern = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // Form state
  const [formData, setFormData] = useState({
    vehicleName: '',
    brand: '',
    model: '',
    year: '',
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
    'Tesla', 'Nissan', 'BMW', 'Audi', 'Mercedes-Benz',
    'Volkswagen', 'Ford', 'Chevrolet', 'Toyota', 'Honda'
  ]

  const statuses = [
    { value: 'Available', label: 'Available', color: 'success' },
    { value: 'Sold', label: 'Sold', color: 'error' },
    { value: 'In Maintenance', label: 'In Maintenance', color: 'warning' }
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
        year: vehicle.year || '',
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={64} thickness={4} />
          <Typography variant="h6" sx={{ ml: 3, fontWeight: 500 }}>
            Loading vehicle...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CarIcon sx={{ fontSize: 36, color: '#1976d2', mr: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              fontFamily: 'Inter, Roboto, sans-serif',
              color: '#1976d2',
              letterSpacing: '-0.025em'
            }}
          >
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontFamily: 'Inter, Roboto, sans-serif'
          }}
        >
          {isEditMode ? 'Update vehicle information' : 'Create a new vehicle entry with rich details'}
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(129, 199, 132, 0.05))'
          }}
          icon={<CheckCircleIcon />}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Inter, Roboto, sans-serif' }}>
            Vehicle {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
          </Typography>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(229, 115, 115, 0.05))'
          }}
          icon={<ErrorIcon />}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Inter, Roboto, sans-serif' }}>
            {error}
          </Typography>
        </Alert>
      )}

      {/* Main Form Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2, #00bcd4)',
            borderRadius: '4px 4px 0 0'
          }
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              
              {/* Vehicle Identity Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BuildIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1.5 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, sans-serif',
                        color: '#1976d2'
                      }}
                    >
                      Vehicle Identity
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
                
                <Grid container spacing={3}>
                  {/* Vehicle Name */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Vehicle Name *"
                      placeholder="e.g., Tesla Model S Plaid, BMW i8, Toyota Prius"
                      value={formData.vehicleName}
                      onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                      required
                      variant="outlined"
                      size="large"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& fieldset': {
                            borderWidth: 2,
                            borderColor: 'rgba(25, 118, 210, 0.15)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1976d2'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#1976d2'
                        }
                      }}
                    />
                  </Grid>

                  {/* Brand, Model, Year */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required size="large">
                      <InputLabel
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#1976d2'
                        }}
                      >
                        Brand *
                      </InputLabel>
                      <Select
                        value={formData.brand}
                        label="Brand *"
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        sx={{
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                            borderColor: 'rgba(25, 118, 210, 0.15)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }}
                      >
                        {brands.map((brand) => (
                          <MenuItem
                            key={brand}
                            value={brand}
                            sx={{
                              fontSize: '1rem',
                              fontFamily: 'Inter, Roboto, sans-serif',
                              fontWeight: 500
                            }}
                          >
                            {brand}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Model *"
                      placeholder="e.g., Model S, i8, Prius"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      required
                      variant="outlined"
                      size="large"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& fieldset': {
                            borderWidth: 2,
                            borderColor: 'rgba(25, 118, 210, 0.15)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1976d2'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#1976d2'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      placeholder="2024"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                      variant="outlined"
                      size="large"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& fieldset': {
                            borderWidth: 2,
                            borderColor: 'rgba(25, 118, 210, 0.15)'
                          },
                          '&:hover fieldset': {
                            borderColor: '#1976d2'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#1976d2'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Price and Status Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ fontSize: 24, color: '#00bcd4', mr: 1.5 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, sans-serif',
                        color: '#00bcd4'
                      }}
                    >
                      Price & Status
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Price *"
                      type="number"
                      placeholder="50000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontWeight: 600, color: '#00bcd4', fontSize: '1.1rem' }}>
                              $
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="large"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& fieldset': {
                            borderWidth: 2,
                            borderColor: 'rgba(0, 188, 212, 0.15)'
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
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#00bcd4'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="large">
                      <InputLabel
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          color: '#1976d2'
                        }}
                      >
                        Current Status
                      </InputLabel>
                      <Select
                        value={formData.status}
                        label="Current Status"
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        sx={{
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontFamily: 'Inter, Roboto, sans-serif',
                          fontWeight: 500,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                            borderColor: 'rgba(25, 118, 210, 0.15)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                            borderWidth: 2
                          }
                        }}
                      >
                        {statuses.map((status) => (
                          <MenuItem
                            key={status.value}
                            value={status.value}
                            sx={{
                              fontSize: '1rem',
                              fontFamily: 'Inter, Roboto, sans-serif',
                              fontWeight: 500
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Typography sx={{ flexGrow: 1 }}>{status.label}</Typography>
                              <Chip
                                label={status.label}
                                color={status.color}
                                size="small"
                                sx={{
                                  ml: 2,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  fontFamily: 'Inter, Roboto, sans-serif'
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Description Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1.5 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, sans-serif',
                        color: '#1976d2'
                      }}
                    >
                      Description
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
                
                <TextField
                  fullWidth
                  label="Vehicle Description"
                  placeholder="Describe the vehicle's features, condition, and any special notes..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontFamily: 'Inter, Roboto, sans-serif',
                      fontWeight: 500,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '& fieldset': {
                        borderWidth: 2,
                        borderColor: 'rgba(25, 118, 210, 0.15)'
                      },
                      '&:hover fieldset': {
                        borderColor: '#1976d2'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem',
                      fontWeight: 600,
                      fontFamily: 'Inter, Roboto, sans-serif',
                      color: '#1976d2'
                    }
                  }}
                />
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhotoCameraIcon sx={{ fontSize: 24, color: '#1976d2', mr: 1.5 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, sans-serif',
                        color: '#1976d2'
                      }}
                    >
                      Vehicle Image
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '2px dashed rgba(25, 118, 210, 0.2)',
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02), rgba(0, 188, 212, 0.02))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(0, 188, 212, 0.05))'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <PhotoCameraIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2, opacity: 0.7 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, Roboto, sans-serif',
                        color: '#1976d2',
                        mb: 1
                      }}
                    >
                      Choose Vehicle Image
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontFamily: 'Inter, Roboto, sans-serif'
                      }}
                    >
                      Upload a high-quality image of the vehicle
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
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
                          border: '2px solid #1976d2',
                          color: '#1976d2',
                          py: 2,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: 'Inter, Roboto, sans-serif',
                          '&:hover': {
                            borderColor: '#1565c0',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.2)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Choose Image
                      </Button>
                    </label>
                  </Box>

                  {imagePreview && (
                    <Box sx={{ position: 'relative', display: 'inline-block', mt: 4, mx: 'auto' }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Vehicle preview"
                        sx={{
                          width: '100%',
                          maxWidth: 400,
                          height: 250,
                          objectFit: 'cover',
                          borderRadius: 3,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                          border: '2px solid rgba(25, 118, 210, 0.1)'
                        }}
                      />
                      <IconButton
                        size="large"
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'rgba(244, 67, 54, 0.9)',
                          color: 'white',
                          border: '2px solid white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          '&:hover': {
                            backgroundColor: '#d32f2f',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      borderColor: 'rgba(0,0,0,0.23)',
                      color: 'text.secondary',
                      fontSize: '1rem',
                      fontWeight: 600,
                      fontFamily: 'Inter, Roboto, sans-serif',
                      minWidth: 180,
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        color: '#1976d2',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
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
                      fontSize: '1rem',
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
                        background: '#ccc',
                        color: '#666'
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

export default VehicleFormModern