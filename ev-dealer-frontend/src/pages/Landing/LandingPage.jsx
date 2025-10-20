/**
 * Landing Page - Public homepage
 * First page visitors see when accessing the website
 */

import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material'
import {
  ElectricCar,
  Speed,
  TrendingUp,
  People,
  Assessment,
  Security,
  ArrowForward,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material'
import bgImage from '../../assets/img/bg.jpg'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <ElectricCar sx={{ fontSize: 50 }} />,
      title: 'Quản Lý Xe Điện',
      description: 'Quản lý kho xe điện hiệu quả với thông tin chi tiết, hình ảnh và trạng thái tồn kho',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 50 }} />,
      title: 'Theo Dõi Doanh Số',
      description: 'Theo dõi doanh số bán hàng theo thời gian thực với báo cáo chi tiết',
    },
    {
      icon: <People sx={{ fontSize: 50 }} />,
      title: 'Quản Lý Khách Hàng',
      description: 'Lưu trữ thông tin khách hàng, lịch sử mua hàng và lịch hẹn lái thử',
    },
    {
      icon: <Assessment sx={{ fontSize: 50 }} />,
      title: 'Báo Cáo Thống Kê',
      description: 'Phân tích dữ liệu với biểu đồ trực quan và báo cáo tùy chỉnh',
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: 'Hiệu Suất Cao',
      description: 'Giao diện nhanh, mượt mà với công nghệ React hiện đại',
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Bảo Mật Cao',
      description: 'Hệ thống bảo mật đa lớp, mã hóa dữ liệu và xác thực an toàn',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ElectricCar
                sx={{
                  fontSize: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                EV Dealer Management
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5568d3',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  },
                }}
              >
                Đăng Nhập
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Đăng Ký
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Hệ Thống Quản Lý Đại Lý Xe Điện
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 4,
                  textShadow: '0 1px 5px rgba(0,0,0,0.2)',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                Giải pháp toàn diện cho việc quản lý đại lý xe điện hiện đại, 
                tối ưu hóa quy trình bán hàng và nâng cao trải nghiệm khách hàng
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: 'white',
                    color: '#667eea',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Bắt Đầu Ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Đăng Nhập
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tính Năng Nổi Bật
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Mọi công cụ bạn cần để quản lý đại lý xe điện hiệu quả
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      color: '#667eea',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            Sẵn Sàng Bắt Đầu?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
            }}
          >
            Tham gia cùng hàng trăm đại lý xe điện đang sử dụng hệ thống của chúng tôi
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                py: 1.5,
                px: 5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Đăng Ký Miễn Phí
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1a1a1a', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © 2025 EV Dealer Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage

