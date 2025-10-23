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
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  OutlinedInput,
  InputAdornment,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  AttachMoney as PriceIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const ModernTestDriveForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    { 
      id: 1, 
      name: 'Tesla Model 3', 
      image: '', 
      price: '1.2B VNĐ', 
      range: '500km',
      acceleration: '3.3s',
      features: ['Autopilot', 'Premium Interior', 'Supercharging']
    },
    { 
      id: 2, 
      name: 'Tesla Model Y', 
      image: '', 
      price: '1.5B VNĐ', 
      range: '480km',
      acceleration: '3.5s',
      features: ['7 Seats', 'Panoramic Roof', 'Tow Hitch']
    },
    { 
      id: 3, 
      name: 'BMW i3', 
      image: '', 
      price: '800M VNĐ', 
      range: '300km',
      acceleration: '4.2s',
      features: ['Carbon Fiber', 'Sustainable Materials', 'Compact Design']
    },
    { 
      id: 4, 
      name: 'Audi e-tron', 
      image: '', 
      price: '1.5B VNĐ', 
      range: '400km',
      acceleration: '4.1s',
      features: ['Quattro AWD', 'Virtual Mirrors', 'Air Suspension']
    },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const steps = [
    'Thông tin',
    'Chọn xe',
    'Thời gian',
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
    // API call would go here
    navigate('/customers');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Thông tin liên hệ
            </Typography>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={formData.customerName}
                  onChange={handleInputChange('customerName')}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.customerPhone}
                  onChange={handleInputChange('customerPhone')}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange('customerEmail')}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Chọn xe test drive
            </Typography>
            <Grid container spacing={2} direction="column">
              {vehicles.map((vehicle) => (
                <Grid item xs={12} key={vehicle.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.selectedVehicle === vehicle.id ? 2 : 1,
                      borderColor: formData.selectedVehicle === vehicle.id ?
                        'primary.main' : 'divider',
                      bgcolor: formData.selectedVehicle === vehicle.id ?
                        alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => setFormData({ ...formData, selectedVehicle: vehicle.id })}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main', 
                            mr: 2,
                            width: 40,
                            height: 40
                          }}
                        >
                          <CarIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {vehicle.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PriceIcon sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                {vehicle.price}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SpeedIcon sx={{ fontSize: 14, mr: 0.5, color: 'info.main' }} />
                              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                {vehicle.range}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {formData.selectedVehicle === vehicle.id && (
                          <CheckIcon color="primary" fontSize="small" />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {vehicle.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ height: 24, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Thời gian & Địa điểm
            </Typography>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày test drive"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleInputChange('preferredDate')}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Khung giờ</InputLabel>
                  <Select
                    value={formData.preferredTime}
                    onChange={handleInputChange('preferredTime')}
                    label="Khung giờ"
                    startAdornment={
                      <InputAdornment position="start">
                        <TimeIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                          {time}
                        </Box>
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
                  variant="outlined"
                  size="small"
                  placeholder="Vui lòng cho chúng tôi biết..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        const selectedVehicle = vehicles.find(v => v.id === formData.selectedVehicle);
        return (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Xác nhận đặt lịch
            </Typography>
            
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), p: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                      <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                      Thông tin khách hàng
                    </Typography>
                    <Box>
                      <InfoRow label="Họ tên" value={formData.customerName} />
                      <InfoRow label="Số điện thoại" value={formData.customerPhone} />
                      <InfoRow label="Email" value={formData.customerEmail} />
                      <InfoRow label="Địa chỉ" value={formData.location} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.02), p: 1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                      <CarIcon sx={{ mr: 1, fontSize: '1rem' }} />
                      Thông tin test drive
                    </Typography>
                    <Box>
                      <InfoRow label="Xe đã chọn" value={selectedVehicle?.name} />
                      <InfoRow label="Ngày" value={formData.preferredDate} />
                      <InfoRow label="Giờ" value={formData.preferredTime} />
                      {formData.specialRequests && (
                        <InfoRow label="Yêu cầu đặc biệt" value={formData.specialRequests} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" fontSize="0.8rem">
                  Tôi đồng ý với các <strong>điều khoản và điều kiện</strong> test drive
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const InfoRow = ({ label, value }) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block" fontSize="0.7rem">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }} fontSize="0.8rem">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1
          }}
        >
          Đặt Lịch Test Drive
        </Typography>
        <Typography variant="body1" color="text.secondary" fontSize="0.9rem">
          Trải nghiệm xe điện - Cảm nhận tương lai
        </Typography>
      </Box>

      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        {/* Stepper được sửa lại */}
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStep-root': {
              padding: isMobile ? '8px' : '16px',
            },
            '& .MuiStepLabel-root': {
              padding: 0,
            },
            '& .MuiStepLabel-label': {
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              fontWeight: 600,
            },
            '& .MuiStepConnector-root': {
              marginLeft: isMobile ? '4px' : '8px',
              marginRight: isMobile ? '4px' : '8px',
            },
            '& .MuiStepLabel-root .Mui-completed': {
              color: theme.palette.success.main,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: theme.palette.primary.main,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300, mb: 3 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="medium"
            sx={{ borderRadius: 2, minWidth: 100, fontSize: '0.8rem' }}
          >
            Quay lại
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.agreeTerms}
              size="medium"
              sx={{ 
                borderRadius: 2, 
                minWidth: 150,
                fontSize: '0.8rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
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
              size="medium"
              sx={{ 
                borderRadius: 2, 
                minWidth: 100,
                fontSize: '0.8rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
            >
              Tiếp theo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );  
};

export default ModernTestDriveForm;