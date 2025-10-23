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
  Chip
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

const VehicleForm = () => {
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
              {/* Vehicle Name - Hero Section */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03), rgba(66, 165, 245, 0.03))',
                    border: '1px solid rgba(25, 118, 210, 0.08)',
                    borderLeft: '4px solid #1976d2'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CarIcon sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      Vehicle Identity
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Vehicle Name"
                    placeholder="e.g., Tesla Model S Plaid, BMW i8, Toyota Prius"
                    value={formData.vehicleName}
                    onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                    required
                    variant="outlined"
                    size="large"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: 'rgba(25, 118, 210, 0.2)'
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
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Paper>
              </Grid>

              {/* Brand and Model - Single Row */}
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.03), rgba(129, 199, 132, 0.03))',
                        border: '1px solid rgba(76, 175, 80, 0.08)',
                        borderLeft: '4px solid #4caf50',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BuildIcon sx={{ color: '#4caf50', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1rem' }}>
                          Brand
                        </Typography>
                      </Box>
                      <FormControl fullWidth required size="large">
                        <InputLabel sx={{ fontSize: '1rem', fontWeight: 500 }}>Choose Brand</InputLabel>
                        <Select
                          value={formData.brand}
                          label="Choose Brand"
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                              borderColor: 'rgba(76, 175, 80, 0.2)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#4caf50'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#4caf50',
                              borderWidth: 2
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
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.03), rgba(255, 183, 77, 0.03))',
                        border: '1px solid rgba(255, 152, 0, 0.08)',
                        borderLeft: '4px solid #ff9800',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#ff9800', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1rem' }}>
                          Model
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Model Name"
                        placeholder="e.g., Model S, i8, Prius"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        required
                        variant="outlined"
                        size="large"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(255, 152, 0, 0.2)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#ff9800'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff9800',
                              borderWidth: 2
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.03), rgba(186, 104, 200, 0.03))',
                        border: '1px solid rgba(156, 39, 176, 0.08)',
                        borderLeft: '4px solid #9c27b0',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#9c27b0', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9c27b0', fontSize: '1rem' }}>
                          Year
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Manufacturing Year"
                        type="number"
                        placeholder="2024"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                        variant="outlined"
                        size="large"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(156, 39, 176, 0.2)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#9c27b0'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#9c27b0',
                              borderWidth: 2
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Price and Status - Single Row */}
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.03), rgba(229, 115, 115, 0.03))',
                        border: '1px solid rgba(244, 67, 54, 0.08)',
                        borderLeft: '4px solid #f44336',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MoneyIcon sx={{ color: '#f44336', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '1rem' }}>
                          Price
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Vehicle Price"
                        type="number"
                        placeholder="50000"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><strong style={{ fontSize: '1.1rem' }}>$</strong></InputAdornment>,
                        }}
                        variant="outlined"
                        size="large"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '& fieldset': {
                              borderWidth: 2,
                              borderColor: 'rgba(244, 67, 54, 0.2)'
                            },
                            '&:hover fieldset': {
                              borderColor: '#f44336'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f44336',
                              borderWidth: 2
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '1rem',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.03), rgba(255, 213, 79, 0.03))',
                        border: '1px solid rgba(255, 193, 7, 0.08)',
                        borderLeft: '4px solid #ffc107',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ color: '#ffc107', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ffc107', fontSize: '1rem' }}>
                          Status
                        </Typography>
                      </Box>
                      <FormControl fullWidth size="large">
                        <InputLabel sx={{ fontSize: '1rem', fontWeight: 500 }}>Current Status</InputLabel>
                        <Select
                          value={formData.status}
                          label="Current Status"
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          sx={{
                            borderRadius: 2,
                            fontSize: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderWidth: 2,
                              borderColor: 'rgba(255, 193, 7, 0.2)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#ffc107'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#ffc107',
                              borderWidth: 2
                            }
                          }}
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status.value} value={status.value} sx={{ fontSize: '1rem' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ flexGrow: 1 }}>{status.label}</Typography>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: `${status.color}.main`,
                                    ml: 2
                                  }}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.03), rgba(77, 208, 225, 0.03))',
                    border: '1px solid rgba(0, 188, 212, 0.08)',
                    borderLeft: '4px solid #00bcd4'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <DescriptionIcon sx={{ color: '#00bcd4', mr: 2, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                      Description
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Vehicle Description"
                    placeholder="Describe the vehicle's features, condition, and any special notes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={6}
                    variant="outlined"
                    size="large"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: 'rgba(0, 188, 212, 0.2)'
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
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Paper>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.03), rgba(149, 117, 205, 0.03))',
                    border: '1px solid rgba(103, 58, 183, 0.08)',
                    borderLeft: '4px solid #673ab7'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PhotoCameraIcon sx={{ color: '#673ab7', mr: 2, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
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
                          fontSize: '1.1rem',
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
                    <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Vehicle preview"
                        sx={{
                          width: '100%',
                          maxWidth: 500,
                          height: 300,
                          objectFit: 'cover',
                          borderRadius: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          border: '3px solid rgba(103, 58, 183, 0.2)'
                        }}
                      />
                      <IconButton
                        size="large"
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
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
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      borderColor: '#9e9e9e',
                      color: '#616161',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      minWidth: 200,
                      '&:hover': {
                        borderColor: '#757575',
                        backgroundColor: 'rgba(117, 117, 117, 0.04)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      minWidth: 200,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                      },
                      '&:disabled': {
                        background: '#ccc',
                        color: '#666'
                      },
                      transition: 'all 0.2s ease'
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
