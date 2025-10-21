/**
 * Vehicle List Page - Modern UI with Material-UI and TailwindCSS
 * Features: Search, Filters, Grid/Table view, Pagination, Actions
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel,
  InputAdornment,
  Badge
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalGasStation as BatteryIcon,
  Speed as SpeedIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material'
import { mockVehicles, mockDealers, mockVehicleTypes } from '../../data/mockVehicles'

const VehicleList = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedDealer, setSelectedDealer] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [stockStatus, setStockStatus] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(12)

  // Load mock data
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setVehicles(mockVehicles)
      setFilteredVehicles(mockVehicles)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter vehicles
  useEffect(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !selectedType || vehicle.type === selectedType
      const matchesDealer = !selectedDealer || vehicle.dealerId === selectedDealer
      const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1]
      const matchesStock = !stockStatus || 
        (stockStatus === 'in_stock' && vehicle.stockQuantity > 5) ||
        (stockStatus === 'low_stock' && vehicle.stockQuantity > 0 && vehicle.stockQuantity <= 5) ||
        (stockStatus === 'out_of_stock' && vehicle.stockQuantity === 0)
      
      return matchesSearch && matchesType && matchesDealer && matchesPrice && matchesStock
    })
    setFilteredVehicles(filtered)
    setPage(0) // Reset to first page when filtering
  }, [vehicles, searchTerm, selectedType, selectedDealer, priceRange, stockStatus])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' }
    if (quantity <= 5) return { label: 'Low Stock', color: 'warning' }
    return { label: 'In Stock', color: 'success' }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const paginatedVehicles = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Vehicle Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vehicles/new')}
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          Add New Vehicle
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Vehicles
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {vehicles.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                In Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {vehicles.filter(v => v.stockQuantity > 5).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {vehicles.filter(v => v.stockQuantity > 0 && v.stockQuantity <= 5).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {vehicles.filter(v => v.stockQuantity === 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {mockVehicleTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Dealer</InputLabel>
              <Select
                value={selectedDealer}
                onChange={(e) => setSelectedDealer(e.target.value)}
                label="Dealer"
              >
                <MenuItem value="">All Dealers</MenuItem>
                {mockDealers.map(dealer => (
                  <MenuItem key={dealer.id} value={dealer.id}>
                    {dealer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                label="Stock Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="low_stock">Low Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  onClick={() => setViewMode('table')}
                  color={viewMode === 'table' ? 'primary' : 'default'}
                >
                  <ListViewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </Typography>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {paginatedVehicles.map((vehicle) => {
            const stockStatus = getStockStatus(vehicle.stockQuantity)
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.images[0]}
                    alt={vehicle.model}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {vehicle.model}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BatteryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.batteryCapacity} kWh
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.range} miles
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {formatPrice(vehicle.price)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={stockStatus.label} 
                        color={stockStatus.color} 
                        size="small" 
                      />
                      <Typography variant="body2" color="text.secondary">
                        Stock: {vehicle.stockQuantity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        sx={{ flex: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                        variant="outlined"
                        sx={{ flex: 1 }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Battery</TableCell>
                <TableCell>Range</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Dealer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVehicles.map((vehicle) => {
                const stockStatus = getStockStatus(vehicle.stockQuantity)
                return (
                  <TableRow key={vehicle.id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        src={vehicle.images[0]}
                        alt={vehicle.model}
                        sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {vehicle.model}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(vehicle.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>{vehicle.batteryCapacity} kWh</TableCell>
                    <TableCell>{vehicle.range} miles</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={stockStatus.label} 
                          color={stockStatus.color} 
                          size="small" 
                        />
                        <Typography variant="body2">
                          {vehicle.stockQuantity}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {mockDealers.find(d => d.id === vehicle.dealerId)?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredVehicles.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[6, 12, 24, 48]}
        labelRowsPerPage="Vehicles per page:"
      />
    </Box>
  )
}

export default VehicleList

