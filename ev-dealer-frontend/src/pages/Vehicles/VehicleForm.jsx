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
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container,
  Paper,
  Divider,
  Avatar,
  InputAdornment
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  ColorLens as ColorLensIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'

const VehicleForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // Form state
  const [formData, setFormData] = useState({
    model: '',
    type: '',
    price: '',
    batteryCapacity: '',
    range: '',
    stockQuantity: '',
    dealerId: '',
    description: '',
    images: [],
    colorVariants: []
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Options
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [dealers, setDealers] = useState([])

  // Dialog states
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', stock: 1 })

  // Load data on mount
  useEffect(() => {
    loadOptions()
    if (isEditMode) {
      loadVehicle()
    }
  }, [id])

  const loadOptions = async () => {
    try {
      const [typesResponse, dealersResponse] = await Promise.all([
        vehicleService.getVehicleTypes(),
        vehicleService.getDealers()
      ])
      setVehicleTypes(typesResponse)
      setDealers(dealersResponse)
    } catch (err) {
      console.error('Error loading options:', err)
    }
  }

  const loadVehicle = async () => {
    try {
      setLoading(true)
      const vehicle = await vehicleService.getVehicleById(id)
      setFormData({
        model: vehicle.model || '',
        type: vehicle.type || '',
        price: vehicle.price || '',
        batteryCapacity: vehicle.batteryCapacity || '',
        range: vehicle.range || '',
        stockQuantity: vehicle.stockQuantity || '',
        dealerId: vehicle.dealerId || '',
        description: vehicle.description || '',
        images: vehicle.images || [],
        colorVariants: vehicle.colorVariants || []
      })
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
    const files = Array.from(event.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddColor = () => {
    if (newColor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        colorVariants: [...prev.colorVariants, { ...newColor, id: Date.now() }]
      }))
      setNewColor({ name: '', hex: '#000000', stock: 1 })
      setColorDialogOpen(false)
    }
  }

  const handleRemoveColor = (colorId) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(color => color.id !== colorId)
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Basic validation
    if (!formData.model || !formData.type || !formData.price || !formData.dealerId) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        batteryCapacity: parseFloat(formData.batteryCapacity),
        range: parseInt(formData.range),
        stockQuantity: parseInt(formData.stockQuantity)
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
      <Container maxWidth="md" sx={{ py: 4 }}>
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update vehicle information' : 'Enter vehicle details to add to inventory'}
        </Typography>
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Vehicle {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={formData.type}
                        label="Type"
                        onChange={(e) => handleInputChange('type', e.target.value)}
                      >
                        {vehicleTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Dealer</InputLabel>
                      <Select
                        value={formData.dealerId}
                        label="Dealer"
                        onChange={(e) => handleInputChange('dealerId', e.target.value)}
                      >
                        {dealers.map((dealer) => (
                          <MenuItem key={dealer.id} value={dealer.id}>
                            {dealer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Technical Specifications */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Technical Specifications
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Battery Capacity"
                      type="number"
                      value={formData.batteryCapacity}
                      onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                      }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Range"
                      type="number"
                      value={formData.range}
                      onChange={(e) => handleInputChange('range', e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">miles</InputAdornment>,
                      }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Vehicle Images
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Upload Images
                    </Button>
                  </label>
                </Box>

                {formData.images.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {formData.images.map((image, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Avatar
                          src={image}
                          variant="rounded"
                          sx={{ width: 100, height: 100 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': { backgroundColor: 'error.dark' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Color Variants */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Color Variants
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setColorDialogOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Color
                  </Button>
                </Box>

                {formData.colorVariants.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {formData.colorVariants.map((color) => (
                      <Chip
                        key={color.id}
                        label={`${color.name} (${color.stock})`}
                        sx={{
                          backgroundColor: color.hex,
                          color: color.hex === '#FFFFFF' ? 'black' : 'white',
                          '& .MuiChip-deleteIcon': {
                            color: color.hex === '#FFFFFF' ? 'black' : 'white'
                          }
                        }}
                        onDelete={() => handleRemoveColor(color.id)}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {saving ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Create Vehicle')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Add Color Dialog */}
      <Dialog open={colorDialogOpen} onClose={() => setColorDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Color Variant</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color Name"
                value={newColor.name}
                onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Hex Color"
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={newColor.stock}
                onChange={(e) => setNewColor(prev => ({ ...prev, stock: parseInt(e.target.value) || 1 }))}
                inputProps={{ min: 1 }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setColorDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddColor} variant="contained">
            Add Color
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default VehicleForm
