/**
 * Dashboard Page
 * TODO: Implement dashboard with:
 * - Summary cards (Total Sales, Customers, Vehicles, Revenue)
 * - Monthly sales chart
 * - Top selling vehicles chart
 * - Recent activities table
 * - Quick actions
 */

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  TrendingUp,
  People,
  DirectionsCar,
  AttachMoney,
  Notifications,
  CheckCircle,
  Warning,
  Info,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import backgroundImage from "../../assets/img/fordashboard.jpg";

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const slideIn = keyframes`
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowText = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                 0 0 40px rgba(59, 130, 246, 0.3),
                 0 0 60px rgba(59, 130, 246, 0.1);
  }
  50% { 
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.8),
                 0 0 60px rgba(59, 130, 246, 0.5),
                 0 0 80px rgba(59, 130, 246, 0.2);
  }
`;

const pulseValue = keyframes`
  0%, 100% { 
    transform: scale(1);
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.4),
                 0 0 40px rgba(59, 130, 246, 0.2);
  }
  50% { 
    transform: scale(1.05);
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.6),
                 0 0 60px rgba(59, 130, 246, 0.3);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const StyledDashboard = styled("div")(() => ({
  minHeight: "100vh",
  padding: "24px",
  position: "relative",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
  "&::before": {
    content: '""',
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    opacity: 0.03,
    zIndex: -1,
  },
}));

const ElegantCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: `
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8)
  `,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.1),
      0 3px 10px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #64748b, #94a3b8, #64748b)",
    opacity: 0.6,
  },
}));

const MetricCard = styled(ElegantCard)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  "& .MuiSvgIcon-root": {
    fontSize: "2.5rem",
    marginBottom: theme.spacing(2),
    color: "#64748b",
    opacity: 0.8,
  },
}));

const ChartContainer = styled(ElegantCard)(() => ({
  height: "100%",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  animation: `${slideIn} 0.6s ease-out`,
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
  backgroundSize: "200% 200%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  animation: `${glowText} 3s ease-in-out infinite, ${gradientShift} 4s ease infinite`,
  marginBottom: theme.spacing(2),
  letterSpacing: "-1.5px",
  fontFamily: "'Inter', sans-serif",
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: 800,
  background: "linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)",
  backgroundSize: "200% 200%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  animation: `${pulseValue} 2s ease-in-out infinite, ${gradientShift} 3s ease infinite`,
  margin: theme.spacing(1, 0),
  letterSpacing: "-1px",
  fontFeatureSettings: "'tnum' on, 'lnum' on",
  fontFamily: "'Inter', sans-serif",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-5px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
    animation: `${glowText} 2s ease-in-out infinite`,
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 500,
  color: "#64748b",
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(10px)",
  padding: "12px 32px",
  borderRadius: "25px",
  display: "inline-block",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  fontFamily: "'Inter', sans-serif",
  animation: `${fadeIn} 1s ease-out`,
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  animation: `${glowText} 2s ease-in-out infinite`,
  marginBottom: theme.spacing(3),
  fontFamily: "'Inter', sans-serif",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "50px",
    height: "3px",
    background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    borderRadius: "2px",
  },
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  background: "rgba(248, 250, 252, 0.8)",
  borderRadius: "12px",
  marginBottom: theme.spacing(1),
  border: "1px solid rgba(226, 232, 240, 0.8)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 1)",
    borderColor: "#cbd5e1",
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
}));

const ProgressBar = styled(LinearProgress)(() => ({
  height: 6,
  borderRadius: 3,
  background: "rgba(226, 232, 240, 0.8)",
  "& .MuiLinearProgress-bar": {
    background: "linear-gradient(90deg, #475569, #64748b)",
    borderRadius: 3,
  },
}));

const Footer = styled("footer")(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  marginTop: theme.spacing(8),
  padding: theme.spacing(6, 0),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)",
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  background: "rgba(248, 250, 252, 0.8)",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  color: "#64748b",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 1)",
    color: "#475569",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
}));

const FooterLink = styled(Typography)(({ theme }) => ({
  color: "#64748b",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#1e293b",
    transform: "translateX(3px)",
  },
}));

const Dashboard = () => {
  const theme = useTheme();

  const metrics = [
    {
      title: "TOTAL SALES",
      value: "1,234",
      icon: <TrendingUp />,
      change: "+12%",
      color: "#475569",
    },
    {
      title: "CUSTOMERS",
      value: "567",
      icon: <People />,
      change: "+8%",
      color: "#475569",
    },
    {
      title: "VEHICLES",
      value: "89",
      icon: <DirectionsCar />,
      change: "+5%",
      color: "#475569",
    },
    {
      title: "REVENUE",
      value: "$1.2M",
      icon: <AttachMoney />,
      change: "+15%",
      color: "#475569",
    },
  ];

  const activities = [
    {
      icon: <CheckCircle sx={{ color: "#059669" }} />,
      text: "New sale: Ford Mustang 2024 - $45,000",
      time: "2 mins ago",
      type: "success",
    },
    {
      icon: <Warning sx={{ color: "#d97706" }} />,
      text: "Maintenance required for BMW X5",
      time: "1 hour ago",
      type: "warning",
    },
    {
      icon: <Info sx={{ color: "#2563eb" }} />,
      text: "New customer registration - John Smith",
      time: "3 hours ago",
      type: "info",
    },
    {
      icon: <Notifications sx={{ color: "#7c3aed" }} />,
      text: "Inventory update: 15 new vehicles added",
      time: "5 hours ago",
      type: "primary",
    },
  ];

  const topVehicles = [
    { name: "Ford Mustang", sales: 45, progress: 90 },
    { name: "BMW X5", sales: 32, progress: 72 },
    { name: "Toyota Camry", sales: 28, progress: 63 },
    { name: "Honda CR-V", sales: 24, progress: 55 },
  ];

  const footerLinks = {
    "Quick Links": ["Home", "Inventory", "Services", "About Us", "Contact"],
    Services: [
      "Car Sales",
      "Maintenance",
      "Financing",
      "Test Drive",
      "Trade-in",
    ],
    "Contact Info": [
      { icon: <Phone sx={{ fontSize: 16 }} />, text: "+1 (555) 123-4567" },
      { icon: <Email sx={{ fontSize: 16 }} />, text: "info@cardealership.com" },
      {
        icon: <LocationOn sx={{ fontSize: 16 }} />,
        text: "123 Auto Street, City, State",
      },
    ],
  };

  return (
    <StyledDashboard>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 6,
            textAlign: "center",
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          <MainTitle variant="h1">Dashboard Overview</MainTitle>
          <Subtitle variant="h6">Real-time insights and analytics</Subtitle>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <MetricCard>
                <Box
                  sx={{
                    color: metric.color,
                    opacity: 0.8,
                    marginBottom: 2,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    mb: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {metric.title}
                </Typography>
                <ValueText>{metric.value}</ValueText>
                <Chip
                  label={metric.change}
                  size="small"
                  sx={{
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#1e40af",
                    fontWeight: 700,
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    animation: `${pulseValue} 2s ease-in-out infinite`,
                  }}
                />
              </MetricCard>
            </Grid>
          ))}
        </Grid>

        {/* Charts and Activities */}
        <Grid container spacing={3}>
          {/* Sales Chart */}
          <Grid item xs={12} md={8}>
            <ChartContainer>
              <SectionTitle variant="h5">
                Monthly Sales Performance
              </SectionTitle>
              <Box
                sx={{
                  flex: 1,
                  background: "rgba(248, 250, 252, 0.8)",
                  borderRadius: "12px",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed rgba(148, 163, 184, 0.4)",
                }}
              >
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "1rem",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Interactive Chart Component
                </Typography>
              </Box>
            </ChartContainer>
          </Grid>

          {/* Top Vehicles */}
          <Grid item xs={12} md={4}>
            <ChartContainer>
              <SectionTitle variant="h5">Top Selling Vehicles</SectionTitle>
              <Box sx={{ mt: 2 }}>
                {topVehicles.map((vehicle, index) => (
                  <Box key={vehicle.name} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#374151",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {vehicle.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {vehicle.sales} sales
                      </Typography>
                    </Box>
                    <ProgressBar
                      variant="determinate"
                      value={vehicle.progress}
                    />
                  </Box>
                ))}
              </Box>
            </ChartContainer>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <ChartContainer>
              <SectionTitle variant="h5">Recent Activities</SectionTitle>
              <List>
                {activities.map((activity, index) => (
                  <ActivityItem key={index}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: "#1e293b",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {activity.text}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: "0.75rem",
                            mt: 0.5,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ActivityItem>
                ))}
              </List>
            </ChartContainer>
          </Grid>
        </Grid>

        {/* Footer */}
        <Footer>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* Company Info */}
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 300,
                    mb: 2,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.5px",
                  }}
                >
                  AutoElite
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    mb: 3,
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Your trusted partner for premium vehicles and exceptional
                  service. We're committed to delivering the best car buying
                  experience.
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <SocialIcon size="small">
                    <Facebook fontSize="small" />
                  </SocialIcon>
                  <SocialIcon size="small">
                    <Twitter fontSize="small" />
                  </SocialIcon>
                  <SocialIcon size="small">
                    <Instagram fontSize="small" />
                  </SocialIcon>
                  <SocialIcon size="small">
                    <LinkedIn fontSize="small" />
                  </SocialIcon>
                </Box>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} md={2}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Quick Links
                </Typography>
                {footerLinks["Quick Links"].map((link) => (
                  <FooterLink
                    key={link}
                    variant="body2"
                    sx={{ mb: 1.5, fontSize: "0.8rem" }}
                  >
                    {link}
                  </FooterLink>
                ))}
              </Grid>

              {/* Services */}
              <Grid item xs={12} md={2}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Services
                </Typography>
                {footerLinks["Services"].map((service) => (
                  <FooterLink
                    key={service}
                    variant="body2"
                    sx={{ mb: 1.5, fontSize: "0.8rem" }}
                  >
                    {service}
                  </FooterLink>
                ))}
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1e293b",
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Contact Info
                </Typography>
                {footerLinks["Contact Info"].map((contact, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Box
                      sx={{
                        color: "#64748b",
                        mr: 1.5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {contact.icon}
                    </Box>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {contact.text}
                    </Typography>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  sx={{
                    color: "#475569",
                    borderColor: "#cbd5e1",
                    fontWeight: 500,
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      background: "rgba(248, 250, 252, 0.8)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Get In Touch
                </Button>
              </Grid>
            </Grid>

            {/* Copyright */}
            <Box
              sx={{
                borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                mt: 4,
                pt: 3,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                © 2024 AutoElite Dealership. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Footer>
      </Container>
    </StyledDashboard>
  );
};

export default Dashboard;
