import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
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

// Mock Data
const mockCustomers = [
  { 
    id: 1, 
    name: 'Nguyễn Văn An', 
    email: 'nguyen.van.an@example.com', 
    phone: '0123-456-789', 
    purchases: 5, 
    status: 'active',
    avatar: { src: '', alt: 'NVA' },
    joinDate: '2023-01-15',
    lastPurchase: '2024-01-10'
  },
  { 
    id: 2, 
    name: 'Trần Thị Bình', 
    email: 'tran.thi.binh@example.com', 
    phone: '0987-654-321', 
    purchases: 2, 
    status: 'active',
    avatar: { src: '', alt: 'TTB' },
    joinDate: '2023-03-20',
    lastPurchase: '2024-01-05'
  },
  { 
    id: 3, 
    name: 'Lê Văn Cường', 
    email: 'le.van.cuong@example.com', 
    phone: '0555-555-555', 
    purchases: 0, 
    status: 'inactive',
    avatar: { src: '', alt: 'LVC' },
    joinDate: '2023-02-10',
    lastPurchase: null
  },
  { 
    id: 4, 
    name: 'Phạm Thị Dung', 
    email: 'pham.thi.dung@example.com', 
    phone: '0111-222-333', 
    purchases: 10, 
    status: 'active',
    avatar: { src: '', alt: 'PTD' },
    joinDate: '2022-12-01',
    lastPurchase: '2024-01-12'
  },
  { 
    id: 5, 
    name: 'Hoàng Văn Em', 
    email: 'hoang.van.em@example.com', 
    phone: '0444-777-888', 
    purchases: 3, 
    status: 'pending',
    avatar: { src: '', alt: 'HVE' },
    joinDate: '2023-11-15',
    lastPurchase: '2023-12-20'
  },
];

const CustomerList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');

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
      field: 'purchases',
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
      onClick: (row) => console.log('Delete customer:', row.id),
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
    { label: 'Quản lý khách hàng', href: '/customers' }
  ];

  const stats = [
    {
      icon: <PeopleIcon />,
      value: '1,234',
      label: 'Tổng khách hàng',
      color: 'primary.main'
    },
    {
      icon: <TrendingUpIcon />,
      value: '+12%',
      label: 'Tăng trưởng',
      color: 'success.main'
    },
    {
      icon: <ShoppingCartIcon />,
      value: '89',
      label: 'Đơn hàng hôm nay',
      color: 'warning.main'
    }
  ];

  const handleRowClick = (row) => {
    navigate(`/customers/${row.id}`);
  };

  const handleRefresh = () => {
    console.log('Refreshing customer data...');
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

      <DataTable
        columns={columns}
        data={mockCustomers}
        searchable={true}
        pagination={true}
        selectable={true}
        actions={actions}
        onRowClick={handleRowClick}
        title="Danh sách khách hàng"
      />
    </Container>
  );
};

export default CustomerList;