/**
 * Vehicle List Page - Displays all vehicles in a card grid layout
 * Features: Search, Filter, Pagination, CRUD actions
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Rating,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalGasStation as BatteryIcon,
  Speed as SpeedIcon,
  DirectionsCar as CarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'

import vehicleService from '../../services/vehicleService'

const VehicleList = () => {
  const navigate = useNavigate()

  // State management
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    dealerId: '',
    minPrice: '',
    maxPrice: ''
  })

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Options for filters
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [dealers, setDealers] = useState([])

  // Load initial data
  useEffect(() => {
    loadVehicles()
    loadFilterOptions()
  }, [])

  // Reload when filters change
  useEffect(() => {
    loadVehicles()
  }, [pagination.page, pagination.limit, searchTerm, filters])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      }

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key]
        }
      })

      const response = await vehicleService.getVehicles(params)
      setVehicles(response.vehicles)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }))
    } catch (err) {
      setError(err.message || 'Failed to load vehicles')
      console.error('Error loading vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadFilterOptions = async () => {
    try {
      const [typesResponse, dealersResponse] = await Promise.all([
        vehicleService.getVehicleTypes(),
        vehicleService.getDealers()
      ])
      setVehicleTypes(typesResponse)
      setDealers(dealersResponse)
    } catch (err) {
      console.error('Error loading filter options:', err)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 })) // DataTable uses 0-based indexing
  }

  const handleView = (vehicle) => {
    navigate(`/vehicles/${vehicle.id}`)
  }

  const handleEdit = (vehicle) => {
    navigate(`/vehicles/${vehicle.id}/edit`)
  }

  const handleDelete = (vehicle) => {
    setVehicleToDelete(vehicle)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!vehicleToDelete) return

    try {
      setDeleting(true)
      await vehicleService.deleteVehicle(vehicleToDelete.id)
      setDeleteDialogOpen(false)
      setVehicleToDelete(null)
      // Reload the list
      loadVehicles()
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle')
      console.error('Error deleting vehicle:', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleAddNew = () => {
    navigate('/vehicles/new')
  }

  const handleRefresh = () => {
    loadVehicles()
  }

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }

  if (loading && vehicles.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải xe...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              🚗 Xe Điện
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Khám phá tương lai của giao thông bền vững
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Làm mới
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              size="large"
            >
              Thêm Xe Mới
            </Button>
          </Stack>
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters and Search */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm xe..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại xe</InputLabel>
                  <Select
                    value={filters.type}
                    label="Loại xe"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">Tất cả loại</MenuItem>
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Đại lý</InputLabel>
                  <Select
                    value={filters.dealerId}
                    label="Đại lý"
                    onChange={(e) => handleFilterChange('dealerId', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">Tất cả đại lý</MenuItem>
                    {dealers.map((dealer) => (
                      <MenuItem key={dealer.id} value={dealer.id}>
                        {dealer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Giá tối thiểu"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Giá tối đa"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Vehicles Grid */}
      <Grid container spacing={4}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              {/* Image */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={vehicle.images?.[0] || '/placeholder-car.jpg'}
                  alt={vehicle.model}
                  sx={{
                    borderRadius: '16px 16px 0 0',
                    objectFit: 'cover',
                    filter: 'brightness(1.05)',
                    transition: 'filter 0.3s ease'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Chip
                  label={vehicle.type === 'sedan' ? 'Sedan' : vehicle.type === 'suv' ? 'SUV' : vehicle.type === 'hatchback' ? 'Hatchback' : vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '1.1rem'
                  }}
                >
                  {vehicle.model}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2.5,
                    height: 42,
                    overflow: 'hidden',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {vehicle.description}
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
                  <Chip
                    icon={<BatteryIcon sx={{ fontSize: '1rem !important' }} />}
                    label={`${vehicle.batteryCapacity} kWh`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 28,
                      borderRadius: 2,
                      '& .MuiChip-icon': { marginLeft: '6px' }
                    }}
                  />
                  <Chip
                    icon={<SpeedIcon sx={{ fontSize: '1rem !important' }} />}
                    label={`${vehicle.range} km`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 28,
                      borderRadius: 2,
                      '& .MuiChip-icon': { marginLeft: '6px' }
                    }}
                  />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {vehicle.dealerName}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      fontSize: '1.2rem'
                    }}
                  >
                    ${vehicle.price.toLocaleString()} VND
                  </Typography>
                  <Chip
                    label={`${vehicle.stockQuantity} xe có sẵn`}
                    size="small"
                    color={vehicle.stockQuantity > 5 ? 'success' : vehicle.stockQuantity > 0 ? 'warning' : 'error'}
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 26,
                      borderRadius: 2
                    }}
                  />
                </Stack>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => handleView(vehicle)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    border: '1px solid rgba(25, 118, 210, 0.5)',
                    '&:hover': {
                      border: '1px solid #1976d2',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Xem
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(vehicle)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    border: '1px solid rgba(46, 125, 50, 0.5)',
                    '&:hover': {
                      border: '1px solid #2e7d32',
                      bgcolor: 'rgba(46, 125, 50, 0.04)'
                    }
                  }}
                >
                  Sửa
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(vehicle)}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid rgba(211, 47, 47, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                      border: '1px solid #d32f2f'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {pagination.page < pagination.totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleLoadMore}
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 6,
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              border: '2px solid',
              '&:hover': {
                border: '2px solid',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Tải thêm xe'}
          </Button>
        </Box>
      )}

      {/* No Results */}
      {!loading && vehicles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Không tìm thấy xe nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Thử điều chỉnh bộ lọc hoặc thêm xe mới
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Thêm Xe Mới
          </Button>
        </Box>
      )}

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
            Bạn có chắc chắn muốn xóa <strong>"{vehicleToDelete?.model}"</strong>?
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

export default VehicleList
