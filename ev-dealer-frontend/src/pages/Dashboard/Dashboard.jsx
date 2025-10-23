import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as SalesIcon,
  Assessment as ChartIcon,
  Notifications as NotificationIcon,
  Schedule as ScheduleIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PageHeader, ModernCard, DataTable } from "../../components/common";
import api from "../../services/api";
import authService from "../../services/authService";

// Custom Chart Components
const RevenuePieChart = ({ data }) => {
  const theme = useTheme();
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} VNĐ`, "Doanh thu"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SalesBarChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => [value, "Số lượng"]}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Legend />
        <Bar
          dataKey="sales"
          name="Xe bán ra"
          fill={theme.palette.primary.main}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="target"
          name="Mục tiêu"
          fill={theme.palette.secondary.main}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RevenueTrendChart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} VNĐ`, "Doanh thu"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Doanh thu thực tế"
          stroke={theme.palette.success.main}
          strokeWidth={3}
          dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Doanh thu mục tiêu"
          stroke={theme.palette.warning.main}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: theme.palette.warning.main, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);

  // Mock data for dashboard
  const initialStatsCards = [
    {
      title: "Tổng doanh thu",
      subtitle: "Tháng này",
      value: "2.4B VNĐ",
      change: "+12.5%",
      changeType: "positive",
      icon: <MoneyIcon />,
      color: "success",
      progress: 75,
    },
    {
      title: "Khách hàng",
      subtitle: "Tổng số khách hàng",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
      icon: <PeopleIcon />,
      color: "primary",
      progress: 60,
    },
    {
      title: "Xe bán được",
      subtitle: "Tháng này",
      value: "89",
      change: "+15.3%",
      changeType: "positive",
      icon: <CarIcon />,
      color: "info",
      progress: 85,
    },
    {
      title: "Đơn hàng",
      subtitle: "Đang xử lý",
      value: "156",
      change: "-2.1%",
      changeType: "negative",
      icon: <SalesIcon />,
      color: "warning",
      progress: 45,
    },
  ];

  // Chart Data
  const revenueByCategory = [
    { name: "Sedan", value: 800000000 },
    { name: "SUV", value: 600000000 },
    { name: "Hatchback", value: 400000000 },
    { name: "Luxury", value: 500000000 },
    { name: "Electric", value: 100000000 },
  ];

  const monthlySales = [
    { name: "1", sales: 65, target: 60 },
    { name: "2", sales: 78, target: 65 },
    { name: "3", sales: 82, target: 70 },
    { name: "4", sales: 89, target: 75 },
    { name: "5", sales: 76, target: 80 },
    { name: "6", sales: 85, target: 85 },
  ];

  const revenueTrend = [
    { month: "Tháng 1", revenue: 1200000000, target: 1100000000 },
    { month: "Tháng 2", revenue: 1500000000, target: 1300000000 },
    { month: "Tháng 3", revenue: 1800000000, target: 1500000000 },
    { month: "Tháng 4", revenue: 2100000000, target: 1800000000 },
    { month: "Tháng 5", revenue: 1900000000, target: 2000000000 },
    { month: "Tháng 6", revenue: 2400000000, target: 2200000000 },
  ];

  const vehiclePerformance = [
    { model: "Tesla Model 3", efficiency: 95, satisfaction: 92 },
    { model: "BMW i3", efficiency: 88, satisfaction: 85 },
    { model: "Audi e-tron", efficiency: 92, satisfaction: 90 },
    { model: "Mercedes EQC", efficiency: 85, satisfaction: 88 },
    { model: "Porsche Taycan", efficiency: 90, satisfaction: 94 },
  ];

  // State (start with mock data; will try to fetch real data)
  const [statsCards, setStatsCards] = useState(initialStatsCards);

  const initialRecentActivities = [
    {
      id: 1,
      type: "sale",
      message: "Đơn hàng mới #12345 từ Nguyễn Văn A",
      time: "2 phút trước",
      icon: <SalesIcon />,
      color: "success",
    },
    {
      id: 2,
      type: "customer",
      message: "Khách hàng mới đăng ký: Trần Thị B",
      time: "15 phút trước",
      icon: <PeopleIcon />,
      color: "primary",
    },
    {
      id: 3,
      type: "vehicle",
      message: "Xe Tesla Model 3 đã được thêm vào kho",
      time: "1 giờ trước",
      icon: <CarIcon />,
      color: "info",
    },
    {
      id: 4,
      type: "notification",
      message: "Báo cáo tháng đã sẵn sàng",
      time: "2 giờ trước",
      icon: <NotificationIcon />,
      color: "warning",
    },
  ];

  const [recentActivities, setRecentActivities] = useState(
    initialRecentActivities
  );

  const initialTopVehicles = [
    { id: 1, name: "Tesla Model 3", sales: 45, revenue: "1.2B VNĐ" },
    { id: 2, name: "BMW i3", sales: 32, revenue: "800M VNĐ" },
    { id: 3, name: "Audi e-tron", sales: 28, revenue: "1.5B VNĐ" },
    { id: 4, name: "Mercedes EQC", sales: 25, revenue: "1.8B VNĐ" },
    { id: 5, name: "Porsche Taycan", sales: 18, revenue: "2.1B VNĐ" },
  ];

  const [topVehicles, setTopVehicles] = useState(initialTopVehicles);

  const columns = [
    {
      field: "name",
      headerName: "Tên xe",
      width: 200,
    },
    {
      field: "sales",
      headerName: "Số lượng bán",
      type: "number",
      width: 150,
    },
    {
      field: "revenue",
      headerName: "Doanh thu",
      width: 150,
    },
  ];

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.get("/dashboard");
      if (data) {
        if (data.stats && Array.isArray(data.stats)) setStatsCards(data.stats);
        if (data.recentActivities && Array.isArray(data.recentActivities))
          setRecentActivities(data.recentActivities);
        if (data.topVehicles && Array.isArray(data.topVehicles))
          setTopVehicles(data.topVehicles);
      }
    } catch (err) {
      // fallback to mock data; log for debugging
      // eslint-disable-next-line no-console
      console.warn("Dashboard fetch failed, using mock data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User & role-based visibility
  const [currentUser] = useState(() => authService.getCurrentUser());
  const role = currentUser?.role
    ? String(currentUser.role).toLowerCase()
    : "customer";

  // Visible stats/cards based on role
  const visibleStats =
    role === "admin" || role === "branch"
      ? statsCards
      : statsCards.filter((c) => c.title === "Xe bán được");

  // Actions based on role
  const headerActions = (() => {
    if (role === "admin") {
      return [
        {
          label: "Admin Panel",
          icon: <TrendingUpIcon />,
          onClick: () => (window.location.href = "/admin"),
        },
        {
          label: "Quản lý chi nhánh",
          icon: <PeopleIcon />,
          onClick: () => (window.location.href = "/branches"),
        },
      ];
    }
    if (role === "branch") {
      return [
        {
          label: "Tạo đơn hàng",
          icon: <SalesIcon />,
          onClick: () => (window.location.href = "/sales"),
        },
        {
          label: "Thêm xe",
          icon: <CarIcon />,
          onClick: () => (window.location.href = "/vehicles/new"),
        },
      ];
    }
    // customer
    return [
      {
        label: "Mua xe",
        icon: <CarIcon />,
        onClick: () => (window.location.href = "/vehicles"),
      },
    ];
  })();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Bảng điều khiển"
        subtitle="Tổng quan về hoạt động kinh doanh và hiệu suất hệ thống"
        stats={[
          {
            icon: <TrendingUpIcon />,
            value: "+15.2%",
            label: "Tăng trưởng tháng này",
            color: "success.main",
          },
          {
            icon: <PeopleIcon />,
            value: "1,234",
            label: "Khách hàng hoạt động",
            color: "primary.main",
          },
          {
            icon: <CarIcon />,
            value: "89",
            label: "Xe trong kho",
            color: "info.main",
          },
        ]}
        showRefresh={true}
        onRefresh={fetchDashboard}
        actions={headerActions}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {visibleStats.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Chart Section with Tabs */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 3,
              pt: 2,
            }}
          >
            <Tab
              icon={<PieChartIcon />}
              label="Phân loại doanh thu"
              iconPosition="start"
            />
            <Tab
              icon={<BarChartIcon />}
              label="Doanh số theo tháng"
              iconPosition="start"
            />
            <Tab
              icon={<LineChartIcon />}
              label="Xu hướng doanh thu"
              iconPosition="start"
            />
            <Tab
              icon={<TrendingUpIcon />}
              label="Hiệu suất dòng xe"
              iconPosition="start"
            />
            <Tab
              icon={<ChartIcon />}
              label="Doanh số theo khu vực"
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PieChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Phân bổ Doanh thu theo Dòng xe
                </Typography>
                <RevenuePieChart data={revenueByCategory} />
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BarChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Doanh số Bán hàng 6 Tháng Gần đây
                </Typography>
                <SalesBarChart data={monthlySales} />
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LineChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Xu hướng Doanh thu & Mục tiêu
                </Typography>
                <RevenueTrendChart data={revenueTrend} />
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
                  Hiệu suất Dòng xe
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehiclePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="efficiency"
                      name="Hiệu suất (%)"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="satisfaction"
                      name="Hài lòng (%)"
                      fill={theme.palette.success.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {tabValue === 4 && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Doanh số theo Khu vực
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { region: "Miền Bắc", sales: 45, revenue: 1200000000 },
                      { region: "Miền Trung", sales: 28, revenue: 800000000 },
                      { region: "Miền Nam", sales: 62, revenue: 1600000000 },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales" ? `${value} xe` : `${value} VNĐ`,
                        name === "sales" ? "Số lượng" : "Doanh thu",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      name="Số lượng bán"
                      fill={theme.palette.info.main}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Charts and Activities */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ScheduleIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Hoạt động gần đây
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${activity.color}.main`,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Vehicles */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ChartIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Xe bán chạy nhất
              </Typography>
            </Box>
            <DataTable
              columns={columns}
              data={topVehicles}
              searchable={false}
              pagination={false}
              selectable={false}
              title=""
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
