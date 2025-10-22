import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardHeader,
  Paper,
  Grid,
  Rating,
  LinearProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  DirectionsCar as CarIcon,
  ShoppingCart as ShoppingIcon,
  History as HistoryIcon,
  Star as StarIcon,
  PhoneInTalk as PhoneInTalkIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  Engineering as EngineeringIcon,
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { PageHeader, DataTable } from '../../components/common';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customer data
  const customer = {
    id: parseInt(id),
    name: 'Nguyễn Văn An',
    email: 'nguyen.van.an@example.com',
    phone: '0123-456-789',
    avatar: { src: '', alt: 'NVA' },
    status: 'active',
    joinDate: '2023-01-15',
    lastPurchase: '2024-01-10',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    totalPurchases: 5,
    totalSpent: '2.5B VNĐ',
    loyaltyPoints: 1250,
    preferredBrand: 'Tesla',
    satisfaction: 4.5
  };

  const purchaseHistory = [
    { id: 1, date: '2024-01-10', vehicle: 'Tesla Model 3', amount: '1.2B VNĐ', status: 'completed' },
    { id: 2, date: '2023-12-15', vehicle: 'BMW i3', amount: '800M VNĐ', status: 'completed' },
    { id: 3, date: '2023-11-20', vehicle: 'Audi e-tron', amount: '1.5B VNĐ', status: 'completed' },
    { id: 4, date: '2023-10-05', vehicle: 'Mercedes EQC', amount: '1.8B VNĐ', status: 'completed' },
    { id: 5, date: '2023-09-12', vehicle: 'Porsche Taycan', amount: '2.1B VNĐ', status: 'completed' }
  ];

  const testDrives = [
    { id: 1, date: '2024-01-15', vehicle: 'Tesla Model Y', status: 'scheduled' },
    { id: 2, date: '2023-12-20', vehicle: 'BMW iX', status: 'completed' },
    { id: 3, date: '2023-11-25', vehicle: 'Audi Q4 e-tron', status: 'completed' }
  ];

  const recentInteractions = [
    { id: 1, type: 'call', date: '2024-01-20', summary: 'Gọi điện hỏi về chương trình khuyến mãi' },
    { id: 2, type: 'email', date: '2024-01-18', summary: 'Gửi email báo giá xe Model Y' },
    { id: 3, type: 'meeting', date: '2024-01-15', summary: 'Gặp mặt tại showroom để xem xe' },
  ];

  const customerPreferences = [
    { category: 'Dòng xe ưa thích', value: 'SUV Điện' },
    { category: 'Màu sắc ưa thích', value: 'Đen, Trắng' },
    { category: 'Ngân sách', value: '1-3 tỷ VNĐ' },
    { category: 'Tần suất thay xe', value: '6-12 tháng' }
  ];

  const serviceHistory = [
    { id: 1, date: '2024-01-05', service: 'Bảo dưỡng định kỳ', amount: '5M VNĐ', status: 'completed' },
    { id: 2, date: '2023-11-15', service: 'Thay lốp', amount: '12M VNĐ', status: 'completed' },
    { id: 3, date: '2023-09-20', service: 'Sửa chữa hệ thống phanh', amount: '8M VNĐ', status: 'completed' }
  ];

  const columns = [
    { field: 'date', headerName: 'Ngày', width: 120 },
    { field: 'vehicle', headerName: 'Xe', width: 200 },
    { field: 'amount', headerName: 'Số tiền', width: 150 },
    { field: 'status', headerName: 'Trạng thái', width: 120 }
  ];

  const testDriveColumns = [
    { field: 'date', headerName: 'Ngày', width: 150 },
    { field: 'vehicle', headerName: 'Xe', width: 200 },
    { field: 'status', headerName: 'Trạng thái', width: 120 }
  ];

  const serviceColumns = [
    { field: 'date', headerName: 'Ngày', width: 120 },
    { field: 'service', headerName: 'Dịch vụ', width: 200 },
    { field: 'amount', headerName: 'Chi phí', width: 150 },
    { field: 'status', headerName: 'Trạng thái', width: 120 }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/dashboard' },
    { label: 'Khách hàng', href: '/customers' },
    { label: 'Chi tiết khách hàng', href: `/customers/${id}` }
  ];

  const pageActions = [
    {
      label: 'Chỉnh sửa',
      icon: <EditIcon />,
      variant: 'outlined',
      color: 'primary',
      onClick: () => setEditDialogOpen(true)
    },
    {
      label: 'Đặt lịch test drive',
      icon: <CarIcon />,
      variant: 'contained',
      color: 'primary',
      onClick: () => navigate('/customers/test-drive/new')
    }
  ];

  const stats = [
    {
      icon: <ShoppingIcon />,
      value: customer.totalPurchases,
      label: 'Tổng mua hàng',
      color: 'primary.main'
    },
    {
      icon: <StarIcon />,
      value: customer.loyaltyPoints,
      label: 'Điểm thưởng',
      color: 'warning.main'
    },
    {
      icon: <CarIcon />,
      value: testDrives.length,
      label: 'Lần test drive',
      color: 'info.main'
    }
  ];

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call':
        return <PhoneInTalkIcon color="success" />;
      case 'email':
        return <MarkEmailReadIcon color="info" />;
      case 'meeting':
        return <EventIcon color="warning" />;
      default:
        return <HistoryIcon />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', borderRadius: 0 }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <PageHeader
          title={`${customer.name} - Chi tiết khách hàng`}
          subtitle="Thông tin chi tiết và lịch sử mua hàng"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
          stats={stats}
        />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          mt: 3
        }}
      >
        <Grid container spacing={3}>
          {/* Left Column - Customer Info */}
          <Grid item xs={12} md={4}>
            {/* Customer Info Card */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3, backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  {customer.avatar.alt}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {customer.name}
                  </Typography>
                  <Chip
                    label={customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    color={customer.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>

              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={customer.email}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Số điện thoại"
                    secondary={customer.phone}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Địa chỉ"
                    secondary={customer.address}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ngày tham gia"
                    secondary={customer.joinDate}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  {customer.totalSpent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng chi tiêu
                </Typography>
              </Box>
            </Paper>

            {/* Customer Preferences */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3, backgroundColor: '#ffffff' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Sở thích & Ưu tiên
              </Typography>
              <List sx={{ p: 0 }}>
                {customerPreferences.map((pref, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={pref.category}
                      secondary={pref.value}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Satisfaction Rating */}
            <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Đánh giá mức độ hài lòng
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={customer.satisfaction} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {customer.satisfaction}/5
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={customer.satisfaction * 20} 
                sx={{ height: 8, borderRadius: 4 }}
                color="primary"
              />
            </Paper>
          </Grid>

          {/* Right Column - Main Content */}
          <Grid item xs={12} md={8}>
            {/* Search Bar */}
            <Paper sx={{ p: 2, borderRadius: 3, mb: 3, backgroundColor: '#ffffff' }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm trong lịch sử..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            {/* Main Content with Tabs */}
            <Paper sx={{ borderRadius: 3, mb: 3, backgroundColor: '#ffffff' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
                centered
              >
                <Tab label="Lịch sử mua hàng" icon={<ShoppingIcon />} />
                <Tab label="Test Drive" icon={<CarIcon />} />
                <Tab label="Lịch sử dịch vụ" icon={<EngineeringIcon />} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <DataTable
                    columns={columns}
                    data={purchaseHistory}
                    searchable={false}
                    pagination={true}
                    selectable={false}
                    title=""
                  />
                )}

                {tabValue === 1 && (
                  <DataTable
                    columns={testDriveColumns}
                    data={testDrives}
                    searchable={false}
                    pagination={true}
                    selectable={false}
                    title=""
                  />
                )}

                {tabValue === 2 && (
                  <DataTable
                    columns={serviceColumns}
                    data={serviceHistory}
                    searchable={false}
                    pagination={true}
                    selectable={false}
                    title=""
                  />
                )}
              </Box>
            </Paper>

            {/* Recent Interactions */}
            <Card sx={{ mb: 3, backgroundColor: '#ffffff' }}>
              <CardHeader 
                title="Lịch sử tương tác gần đây" 
                action={
                  <Button variant="outlined" startIcon={<EditIcon />}>
                    Thêm tương tác
                  </Button>
                }
              />
              <CardContent>
                <List sx={{ p: 0 }}>
                  {recentInteractions.map(item => (
                    <ListItem key={item.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        {getInteractionIcon(item.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.summary}
                        secondary={item.date}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Hành động nhanh
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<PhoneIcon />}
                    onClick={() => window.open(`tel:${customer.phone}`)}
                  >
                    Gọi điện
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<EmailIcon />}
                    onClick={() => window.open(`mailto:${customer.email}`)}
                  >
                    Gửi email
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<CarIcon />}
                    onClick={() => navigate('/customers/test-drive/new')}
                  >
                    Đặt test drive
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<MoneyIcon />}
                    onClick={() => navigate('/customers/quote/new')}
                  >
                    Gửi báo giá
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
        <DialogContent>
          <Typography>Form chỉnh sửa sẽ được thêm vào đây...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetail;