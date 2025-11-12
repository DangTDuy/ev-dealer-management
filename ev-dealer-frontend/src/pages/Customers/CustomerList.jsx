import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeader, DataTable } from '../../components/common';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5036'; // API Gateway URL

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/customers`);
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers. Please try again later.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Khách hàng',
      type: 'avatar',
      width: 200
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 150
    },
    {
      field: 'purchases', // This field might need adjustment based on actual backend data
      headerName: 'Tổng mua hàng',
      type: 'number',
      width: 120
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      type: 'status',
      width: 120
    },
    {
      field: 'joinDate',
      headerName: 'Ngày tham gia',
      width: 130
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      type: 'actions',
      width: 120
    }
  ];

  const actions = [
    {
      icon: <ViewIcon />,
      tooltip: 'Xem chi tiết',
      onClick: (row) => navigate(`/customers/${row.id}`),
      color: 'primary.main'
    },
    {
      icon: <EditIcon />,
      tooltip: 'Chỉnh sửa',
      onClick: (row) => navigate(`/customers/${row.id}/edit`),
      color: 'warning.main'
    },
    {
      icon: <DeleteIcon />,
      tooltip: 'Xóa',
      onClick: (row) => console.log('Delete customer:', row.id), // Implement actual delete logic later
      color: 'error.main'
    }
  ];

  const pageActions = [
    {
      label: 'Thêm khách hàng',
      icon: <AddIcon />,
      variant: 'contained',
      color: 'primary',
      onClick: () => navigate('/customers/new')
    }
  ];

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/dashboard' },
    { label: 'Quản lý khách hàng', href: '/customers' }
  ];

  const stats = [
    {
      icon: <PeopleIcon />,
      value: customers.length.toString(), // Dynamic count
      label: 'Tổng khách hàng',
      color: 'primary.main'
    },
    {
      icon: <TrendingUpIcon />,
      value: 'N/A', // Placeholder, implement actual logic if needed
      label: 'Tăng trưởng',
      color: 'success.main'
    },
    {
      icon: <ShoppingCartIcon />,
      value: 'N/A', // Placeholder, implement actual logic if needed
      label: 'Đơn hàng hôm nay',
      color: 'warning.main'
    }
  ];

  const handleRowClick = (row) => {
    navigate(`/customers/${row.id}`);
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Quản lý khách hàng"
        subtitle="Quản lý thông tin khách hàng và theo dõi hoạt động mua hàng"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
        stats={stats}
        showRefresh={true}
        onRefresh={handleRefresh}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <DataTable
          columns={columns}
          data={customers}
          searchable={true}
          pagination={true}
          selectable={true}
          actions={actions}
          onRowClick={handleRowClick}
          title="Danh sách khách hàng"
        />
      )}
    </Container>
  );
};

export default CustomerList;