import React, { useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common';
import CustomerForm from '../../components/forms/CustomerForm';
import { customerService } from '../../services/customerService';

const CustomerNew = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/dashboard' },
    { label: 'Quản lý khách hàng', href: '/customers' },
    { label: 'Thêm khách hàng mới', href: '/customers/new' },
  ];

  const handleSubmit = async (customerData) => {
    try {
      setError(null);
      setSuccess(null);
      await customerService.createCustomer(customerData);
      setSuccess('Khách hàng đã được thêm thành công!');
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi thêm khách hàng.');
    }
  };

  const handleCancel = () => {
    navigate('/customers');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Thêm khách hàng mới"
        subtitle="Điền thông tin chi tiết để tạo khách hàng mới"
        breadcrumbs={breadcrumbs}
      />

      <Box sx={{ mt: 4 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Box>
    </Container>
  );
};

export default CustomerNew;