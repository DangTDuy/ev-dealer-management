/**
 * Vehicle Detail Page - Interactive and Engaging Vehicle Details
 * Features: Image gallery, specifications, color variants, 3D model, animations
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Avatar,
  Rating,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Badge
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocalGasStation as BatteryIcon,
  Speed as SpeedIcon,
  DirectionsCar as CarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  ShoppingCart as CartIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  ZoomIn as ZoomIcon,
  Close as CloseIcon,
  ThreeDRotation as ThreeDIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'
import resolveImagePath from '../../utils/imageUtils'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // State management
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [failedImages, setFailedImages] = useState(new Set())
  const [zoomOpen, setZoomOpen] = useState(false)

  // Reservation state
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false)
  const [reservationLoading, setReservationLoading] = useState(false)
  const [reservationData, setReservationData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    colorVariantId: null,
    notes: '',
    quantity: 1
  })
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [reservationResult, setReservationResult] = useState(null)

  const generatePlaceholderDataUrl = (text, width = 1200, height = 700) => {
    const bg = '#f3f6fb'
    const fg = '#546e7a'
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
        <rect width='100%' height='100%' fill='${bg}' />
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='36'>${text}</text>
      </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const getImageSrc = (index) => {
    if (vehicle?.images && vehicle.images[index] && !failedImages.has(index)) return resolveImagePath(vehicle.images[index])
    return generatePlaceholderDataUrl(vehicle?.model || 'No image')
  }
  const [activeTab, setActiveTab] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load vehicle data
  useEffect(() => {
    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehicleService.getVehicleById(id)
      setVehicle(response)
    } catch (err) {
      setError(err.message || 'Failed to load vehicle details')
      console.error('Error loading vehicle:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/vehicles/${id}/edit`)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleting(true)
      await vehicleService.deleteVehicle(id)
      navigate('/vehicles')
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle')
      console.error('Error deleting vehicle:', err)
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleImageChange = (index) => {
    setSelectedImage(index)
  }

  const handleColorChange = (index) => {
    setSelectedColor(index)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle?.model,
        text: vehicle?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could show a toast notification here
    }
  }

  const handleReserveClick = () => {
    setReservationData(prev => ({
      ...prev,
      colorVariantId: vehicle?.colorVariants[selectedColor]?.id || null
    }))
    setReservationDialogOpen(true)
  }

  const handleReservationInputChange = (field, value) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReservationSubmit = async () => {
    try {
      setReservationLoading(true)
      const result = await vehicleService.reserveVehicle(vehicle.id, reservationData)
      setReservationResult(result)
      setReservationSuccess(true)
      setReservationDialogOpen(false)
      // Reload vehicle data to update stock
      await loadVehicle()
    } catch (err) {
      setError(err.message || 'Failed to create reservation')
      console.error('Error creating reservation:', err)
    } finally {
      setReservationLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải chi tiết xe...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  if (!vehicle) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Không tìm thấy xe
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vehicles')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Quay lại danh sách xe
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {vehicle.model}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {vehicle.description}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Vehicle type chip and pinned model name (separate line) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                <Chip
                  label={vehicle.type === 'sedan' ? 'Sedan' : vehicle.type === 'suv' ? 'SUV' : vehicle.type === 'hatchback' ? 'Hatchback' : vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                />

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    maxWidth: 320,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={vehicle.model}
                >
                  {vehicle.model}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {vehicle.dealerName}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={toggleFavorite}
              sx={{
                bgcolor: isFavorite ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0,0,0,0.04)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: isFavorite ? 'rgba(244, 67, 54, 0.2)' : 'rgba(0,0,0,0.08)'
                }
              }}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              onClick={handleShare}
              sx={{
                bgcolor: 'rgba(0,0,0,0.04)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.08)'
                }
              }}
            >
              <ShareIcon />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Sửa
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Xóa
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Image Gallery */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            {/* Main Image */}
            <Box sx={{ position: 'relative', height: 700, overflow: 'hidden' }}>
                {imageLoading && (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                    <CircularProgress />
                  </Box>
                )}

                <img
                  src={getImageSrc(selectedImage)}
                  alt={vehicle.model}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setFailedImages(prev => { const s = new Set(prev); s.add(selectedImage); return s })}
                  onClick={() => setZoomOpen(true)}
                  role="button"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: imageLoading ? 'none' : 'block',
                    transition: 'transform 0.5s ease',
                    cursor: 'zoom-in'
                  }}
                />

                {/* Dots / Carousel indicators */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 6 }}>
                    {vehicle.images.map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => { setSelectedImage(i); setImageLoading(true) }}
                        sx={{
                          width: selectedImage === i ? 12 : 8,
                          height: selectedImage === i ? 12 : 8,
                          borderRadius: '50%',
                          bgcolor: selectedImage === i ? 'primary.main' : 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Box>
                )}
  {/* Hiện tên xe trên ảnh */}
  <Box
    sx={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      bgcolor: 'rgba(0,0,0,0.6)',
      color: 'white',
      px: 2,
      py: 1,
      borderRadius: 2,
      fontSize: '1.2rem',
      fontWeight: 'bold',
    }}
  >
    {vehicle.model}
  </Box>

              {/* Image Navigation */}
              {vehicle.images && vehicle.images.length > 1 && (
                <>
                  <IconButton
                    onClick={() => handleImageChange(selectedImage > 0 ? selectedImage - 1 : vehicle.images.length - 1)}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: 44,
                      height: 44,
                      p: 0,
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-50%) scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <PrevIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleImageChange(selectedImage < vehicle.images.length - 1 ? selectedImage + 1 : 0)}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: 44,
                      height: 44,
                      p: 0,
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-50%) scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <NextIcon />
                  </IconButton>
                </>
              )}

              {/* Image Counter */}
              {vehicle.images && vehicle.images.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {selectedImage + 1} / {vehicle.images.length}
                </Box>
              )}
            </Box>

            {/* Thumbnail Gallery */}
              {vehicle.images && vehicle.images.length > 1 && (
                <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {vehicle.images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => { setSelectedImage(index); setImageLoading(true) }}
                      sx={{
                        minWidth: 80,
                        height: 60,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #1976d2' : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'rgba(25, 118, 210, 0.5)',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <img
                        src={!failedImages.has(index) ? resolveImagePath(image) : generatePlaceholderDataUrl(vehicle.model, 240, 140)}
                        alt={`${vehicle.model} ${index + 1}`}
                        onError={() => setFailedImages(prev => { const s = new Set(prev); s.add(index); return s })}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
          </Card>
        </Grid>

        {/* Vehicle Info */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Price Card */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                  ${vehicle.price.toLocaleString()} VND
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Chip
                    label={`${vehicle.stockQuantity} xe có sẵn`}
                    size="small"
                    color={vehicle.stockQuantity > 5 ? 'success' : vehicle.stockQuantity > 0 ? 'warning' : 'error'}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    label="Đặt hàng ngay"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={handleReserveClick}
                  disabled={vehicle.stockQuantity === 0}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                      color: 'grey.500',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {vehicle.stockQuantity === 0 ? 'Hết hàng' : 'Đặt mua ngay'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Specs */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Thông số chính
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BatteryIcon color="action" />
                      <Typography variant="body2">Dung lượng pin</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vehicle.batteryCapacity} kWh
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SpeedIcon color="action" />
                      <Typography variant="body2">Quãng đường</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vehicle.range} km
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimeIcon color="action" />
                      <Typography variant="body2">Tăng tốc 0-60mph</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vehicle.specifications?.acceleration || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SecurityIcon color="action" />
                      <Typography variant="body2">Bảo hành</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {vehicle.specifications?.warranty || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Color Variants */}
            {vehicle.colorVariants && vehicle.colorVariants.length > 0 && (
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Màu sắc có sẵn
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {vehicle.colorVariants.map((color, index) => (
                      <Box
                        key={color.id}
                        onClick={() => handleColorChange(index)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: color.hex,
                          cursor: 'pointer',
                          border: selectedColor === index ? '3px solid #1976d2' : '3px solid rgba(0,0,0,0.1)',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            borderColor: 'rgba(25, 118, 210, 0.5)'
                          }
                        }}
                        title={`${color.name} (${color.stock} xe)`}
                      >
                        {color.stock === 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%) rotate(45deg)',
                              width: 2,
                              height: 40,
                              bgcolor: 'rgba(255,255,255,0.8)',
                              borderRadius: 1
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>

                  {vehicle.colorVariants[selectedColor] && (
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                      {vehicle.colorVariants[selectedColor].name} - {vehicle.colorVariants[selectedColor].stock} xe có sẵn
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Detailed Specifications Tabs */}
      <Box sx={{ mt: 8 }}>
        <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64
              }
            }}
          >
            <Tab label="Thông số kỹ thuật" />
            <Tab label="Tính năng" />
            <Tab label="Bảo hành & Hỗ trợ" />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Thông số động cơ & hiệu suất
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Tăng tốc 0-60 mph:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.specifications?.acceleration || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Tốc độ tối đa:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.specifications?.topSpeed || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Sạc nhanh:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.specifications?.charging || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                {/* Zoom Modal */}
                <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} maxWidth="lg" fullWidth>
                  <DialogContent sx={{ p: 0, backgroundColor: 'black' }}>
                    <Box sx={{ position: 'relative', width: '100%', height: { xs: '60vh', md: '80vh' }, bgcolor: 'black' }}>
                      <IconButton
                        onClick={() => setZoomOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: 40, height: 40, p: 0.5 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <img
                          src={getImageSrc(selectedImage)}
                          alt={vehicle.model}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    </Box>
                  </DialogContent>
                </Dialog>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    <CarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Kích thước & tiện nghi
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Số chỗ ngồi:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.specifications?.seats || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Dung tích cốp:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {vehicle.specifications?.cargo || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Trọng lượng:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        N/A
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 4, minHeight: 300, transition: 'all 0.3s ease' }}>

                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Tính năng nổi bật
                </Typography>
                <Grid container spacing={4}>
  {[
    'Lái xe tự động',
    'Hỗ trợ đỗ xe tự động',
    'Sạc không dây',
    'Kết nối smartphone',
    'Màn hình cảm ứng lớn',
    'Âm thanh cao cấp',
    'Ghế sưởi ấm/làm mát',
    'Cửa sổ trời toàn cảnh'
  ].map((feature, index) => (
    <Grid item xs={12} sm={6} md={6} key={index}>
      <Paper
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(25, 118, 210, 0.04)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(219, 92, 92, 0.1)'
          }
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {feature}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Bảo hành & Hỗ trợ
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Bảo hành xe
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {vehicle.specifications?.warranty || '4 năm hoặc 50,000 dặm, tùy điều kiện nào đến trước'}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Bảo hành pin & động cơ
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          8 năm hoặc 100,000 dặm cho pin và động cơ điện
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Hỗ trợ 24/7
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Đội ngũ kỹ thuật viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Mạng lưới trạm sạc
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Hơn 25,000 trạm sạc trên toàn quốc
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      {/* Reservation Dialog */}
      <Dialog
        open={reservationDialogOpen}
        onClose={() => !reservationLoading && setReservationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          🚗 Đặt mua {vehicle?.model}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Selected Color Display */}
            {vehicle?.colorVariants[selectedColor] && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Màu đã chọn:</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: vehicle.colorVariants[selectedColor].hex,
                      border: '2px solid rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {vehicle.colorVariants[selectedColor].name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({vehicle.colorVariants[selectedColor].stock} xe có sẵn)
                  </Typography>
                </Stack>
              </Box>
            )}

            {/* Customer Information */}
            <TextField
              label="Họ và tên"
              fullWidth
              required
              value={reservationData.customerName}
              onChange={(e) => handleReservationInputChange('customerName', e.target.value)}
              disabled={reservationLoading}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={reservationData.customerEmail}
              onChange={(e) => handleReservationInputChange('customerEmail', e.target.value)}
              disabled={reservationLoading}
            />

            <TextField
              label="Số điện thoại"
              fullWidth
              required
              value={reservationData.customerPhone}
              onChange={(e) => handleReservationInputChange('customerPhone', e.target.value)}
              disabled={reservationLoading}
            />

            <FormControl fullWidth>
              <InputLabel>Số lượng</InputLabel>
              <Select
                value={reservationData.quantity}
                onChange={(e) => handleReservationInputChange('quantity', e.target.value)}
                label="Số lượng"
                disabled={reservationLoading}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num} disabled={num > vehicle?.stockQuantity}>
                    {num} xe {num > vehicle?.stockQuantity && '(không đủ hàng)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Ghi chú (tùy chọn)"
              multiline
              rows={3}
              fullWidth
              value={reservationData.notes}
              onChange={(e) => handleReservationInputChange('notes', e.target.value)}
              disabled={reservationLoading}
              placeholder="Ví dụ: Muốn xem xe trực tiếp, thời gian rảnh..."
            />

            {/* Price Summary */}
            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Tổng tiền dự kiến:
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${((vehicle?.price || 0) * reservationData.quantity).toLocaleString()} VND
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giá có thể thay đổi tùy theo phụ kiện và khuyến mãi
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setReservationDialogOpen(false)}
            variant="outlined"
            disabled={reservationLoading}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleReservationSubmit}
            variant="contained"
            disabled={reservationLoading || !reservationData.customerName || !reservationData.customerEmail || !reservationData.customerPhone}
            startIcon={reservationLoading ? <CircularProgress size={20} /> : <CartIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            {reservationLoading ? 'Đang đặt...' : 'Xác nhận đặt mua'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reservation Success Dialog */}
      <Dialog
        open={reservationSuccess}
        onClose={() => setReservationSuccess(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pt: 4 }}>
          ✅ Đặt mua thành công!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Cảm ơn bạn đã đặt mua {vehicle?.model}
          </Typography>
          {reservationResult && (
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Mã đặt hàng:</strong> #{reservationResult.id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Tên khách hàng:</strong> {reservationResult.customerName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {reservationResult.customerEmail}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Số lượng:</strong> {reservationResult.quantity} xe
              </Typography>
              <Typography variant="body2">
                <strong>Tổng tiền:</strong> ${reservationResult.totalPrice?.toLocaleString()} VND
              </Typography>
            </Box>
          )}
          <Typography variant="body1" color="text.secondary">
            Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đơn hàng và hướng dẫn các bước tiếp theo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button
            onClick={() => setReservationSuccess(false)}
            variant="contained"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}>
          🗑️ Xóa Xe
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ fontSize: '1.1rem' }}>
            Bạn có chắc chắn muốn xóa <strong>"{vehicle?.model}"</strong>?
            Hành động này không thể hoàn tác và tất cả dữ liệu xe sẽ bị mất vĩnh viễn.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            {deleting ? 'Đang xóa...' : 'Xóa Xe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default VehicleDetail
