import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Avatar,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { PageHeader } from '../../components/common';

const TestDriveForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    selectedVehicle: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    specialRequests: '',
    agreeTerms: false
  });

  const vehicles = [
    { id: 1, name: 'Tesla Model 3', image: '', price: '1.2B VNĐ', range: '500km' },
    { id: 2, name: 'Tesla Model Y', image: '', price: '1.5B VNĐ', range: '480km' },
    { id: 3, name: 'BMW i3', image: '', price: '800M VNĐ', range: '300km' },
    { id: 4, name: 'Audi e-tron', image: '', price: '1.5B VNĐ', range: '400km' },
    { id: 5, name: 'Mercedes EQC', image: '', price: '1.8B VNĐ', range: '450km' },
    { id: 6, name: 'Porsche Taycan', image: '', price: '2.1B VNĐ', range: '420km' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const steps = [
    'Thông tin khách hàng',
    'Chọn xe',
    'Đặt lịch',
    'Xác nhận'
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    console.log('Test drive booking submitted:', formData);
    // Here you would typically send the data to your API
    navigate('/customers');
  };

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/dashboard' },
    { label: 'Khách hàng', href: '/customers' },
    { label: 'Đặt lịch test drive', href: '/customers/test-drive/new' }
  ];

  const pageActions = [
    {
      label: 'Hủy',
      variant: 'outlined',
      color: 'secondary',
      onClick: () => navigate('/customers')
    }
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.customerName}
                onChange={handleInputChange('customerName')}
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.customerPhone}
                onChange={handleInputChange('customerPhone')}
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange('customerEmail')}
                required
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.location}
                onChange={handleInputChange('location')}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} md={6} key={vehicle.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: formData.selectedVehicle === vehicle.id ? 2 : 1,
                    borderColor: formData.selectedVehicle === vehicle.id ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                  onClick={() => setFormData({ ...formData, selectedVehicle: vehicle.id })}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <CarIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {vehicle.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.price} • {vehicle.range}
                        </Typography>
                      </Box>
                    </Box>
                    {formData.selectedVehicle === vehicle.id && (
                      <Chip
                        icon={<CheckIcon />}
                        label="Đã chọn"
                        color="primary"
                        size="small"
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày mong muốn"
                type="date"
                value={formData.preferredDate}
                onChange={handleInputChange('preferredDate')}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Giờ mong muốn</InputLabel>
                <Select
                  value={formData.preferredTime}
                  onChange={handleInputChange('preferredTime')}
                  startAdornment={<TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Yêu cầu đặc biệt"
                multiline
                rows={3}
                value={formData.specialRequests}
                onChange={handleInputChange('specialRequests')}
                placeholder="Vui lòng mô tả bất kỳ yêu cầu đặc biệt nào..."
              />
            </Grid>
          </Grid>
        );

      case 3:
        const selectedVehicle = vehicles.find(v => v.id === formData.selectedVehicle);
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch test drive.
            </Alert>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Thông tin khách hàng
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Họ tên</Typography>
                  <Typography variant="body1">{formData.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                  <Typography variant="body1">{formData.customerPhone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{formData.customerEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Địa chỉ</Typography>
                  <Typography variant="body1">{formData.location}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CarIcon sx={{ mr: 1 }} />
                Thông tin test drive
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Xe đã chọn</Typography>
                  <Typography variant="body1">{selectedVehicle?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Ngày</Typography>
                  <Typography variant="body1">{formData.preferredDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Giờ</Typography>
                  <Typography variant="body1">{formData.preferredTime}</Typography>
                </Grid>
                {formData.specialRequests && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Yêu cầu đặc biệt</Typography>
                    <Typography variant="body1">{formData.specialRequests}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
              }
              label="Tôi đồng ý với các điều khoản và điều kiện test drive"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Đặt lịch test drive"
        subtitle="Trải nghiệm xe điện trước khi quyết định mua"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
      />

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Quay lại
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.agreeTerms}
            >
              Xác nhận đặt lịch
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!formData.customerName || !formData.customerPhone || !formData.customerEmail)) ||
                (activeStep === 1 && !formData.selectedVehicle) ||
                (activeStep === 2 && (!formData.preferredDate || !formData.preferredTime))
              }
            >
              Tiếp theo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TestDriveForm;