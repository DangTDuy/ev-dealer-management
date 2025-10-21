import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { PageHeader, ModernCard, DataTable } from '../../components/common';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    preferredBrand: 'Tesla'
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

  const columns = [
    { field: 'date', headerName: 'Ngày', width: 120 },
    { field: 'vehicle', headerName: 'Xe', width: 200 },
    { field: 'amount', headerName: 'Số tiền', type: 'number', width: 150 },
    { field: 'status', headerName: 'Trạng thái', type: 'status', width: 120 }
  ];

  const testDriveColumns = [
    { field: 'date', headerName: 'Ngày', width: 150 },
    { field: 'vehicle', headerName: 'Xe', width: 200 },
    { field: 'status', headerName: 'Trạng thái', type: 'status', width: 120 }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const breadcrumbs = [
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

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={`${customer.name} - Chi tiết khách hàng`}
        subtitle="Thông tin chi tiết và lịch sử mua hàng"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
        stats={stats}
      />

      <Grid container spacing={3}>
        {/* Customer Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
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
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
            >
              <Tab label="Lịch sử mua hàng" icon={<HistoryIcon />} />
              <Tab label="Test Drive" icon={<CarIcon />} />
              <Tab label="Ghi chú" icon={<EditIcon />} />
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
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Ghi chú về khách hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng VIP, thường xuyên mua xe điện cao cấp. 
                    Ưa thích Tesla và có xu hướng mua xe mới mỗi 6 tháng.
                    Cần chăm sóc đặc biệt và ưu đãi tốt.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
    </Container>
  );
};

export default CustomerDetail;