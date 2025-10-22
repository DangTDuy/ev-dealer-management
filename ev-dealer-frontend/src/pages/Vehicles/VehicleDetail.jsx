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
  ThreeDRotation as ThreeDIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // State management
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
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
              <Chip
                label={vehicle.type === 'sedan' ? 'Sedan' : vehicle.type === 'suv' ? 'SUV' : vehicle.type === 'hatchback' ? 'Hatchback' : vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
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
                borderRadius: 2,
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
                borderRadius: 2,
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
              <CardMedia
                component="img"
                height="100%"
                image={vehicle.images?.[selectedImage] || '/placeholder-car.jpg'}
                alt={vehicle.model}
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />

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
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-50%) scale(1.1)'
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
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-50%) scale(1.1)'
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
                    onClick={() => handleImageChange(index)}
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
                      src={image}
                      alt={`${vehicle.model} ${index + 1}`}
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
                    transition: 'all 0.3s ease'
                  }}
                >
                  Đặt mua ngay
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
      <Box sx={{ mt: 6 }}>
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
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Tính năng nổi bật
                </Typography>
                <Grid container spacing={3}>
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
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          borderRadius: 2,
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                          border: '1px solid rgba(25, 118, 210, 0.1)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
