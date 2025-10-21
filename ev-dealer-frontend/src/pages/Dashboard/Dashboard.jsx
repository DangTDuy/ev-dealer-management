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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import backgroundImage from "../../assets/img/fordashboard.jpg";

// Styled components
const StyledDashboard = styled("div")(() => ({
  minHeight: "100vh",
  padding: "24px",
  position: "relative",
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
    opacity: 0.2,
    zIndex: -1,
  },
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.primary,
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    background: "rgba(255, 255, 255, 0.95)",
    "&::before": {
      transform: "translateX(100%)",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: -100,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "transform 0.5s ease-in-out",
  },
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "800",
  background: "linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginTop: "8px",
  letterSpacing: "-1px",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  boxShadow: "0 15px 50px rgba(0, 0, 0, 0.12)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.18)",
    background: "rgba(255, 255, 255, 0.92)",
  },
}));

const Dashboard = () => {
  return (
    <StyledDashboard>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 6,
            textAlign: "center",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "150px",
              height: "4px",
              background:
                "linear-gradient(90deg, #2196F3 0%, #21CBF3 50%, #2196F3 100%)",
              borderRadius: "2px",
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1a237e",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dashboard Overview
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom>
                Total Sales
              </Typography>
              <ValueText>1,234</ValueText>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom>
                Customers
              </Typography>
              <ValueText>567</ValueText>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom>
                Vehicles
              </Typography>
              <ValueText>89</ValueText>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <Typography variant="h6" gutterBottom>
                Revenue
              </Typography>
              <ValueText>$1.2M</ValueText>
            </DashboardCard>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <ChartContainer>
              <Typography variant="h6" gutterBottom>
                Monthly Sales
              </Typography>
              {/* TODO: Add Recharts line/bar chart */}
            </ChartContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChartContainer>
              <Typography variant="h6" gutterBottom>
                Top Vehicles
              </Typography>
              {/* TODO: Add Recharts pie chart */}
            </ChartContainer>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <ChartContainer>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {/* TODO: Add table component */}
            </ChartContainer>
          </Grid>
        </Grid>
      </Container>
    </StyledDashboard>
  );
};

export default Dashboard;
