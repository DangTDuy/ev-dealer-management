import React, { useState, useEffect, useRef } from "react";
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
  Circle as CircleIcon,
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
import { PageHeader, DataTable } from "../../components/common";
import authService from "../../services/authService";
import { reportService } from "../../services/reportService";

// Enhanced Scrollable Stats Component with Swipe
const ScrollableStats = ({ stats, currentIndex, onIndexChange }) => {
  const theme = useTheme();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;
  const currentStat = stats[currentIndex];

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < stats.length - 1) {
      onIndexChange(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < stats.length - 1) {
      onIndexChange(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        height: "290px",
        position: "relative",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        cursor: "grab",
        userSelect: "none",
        width: "100%",
        "&:active": {
          cursor: "grabbing",
        },
        "&:hover": {
          boxShadow: 6,
        },
        transition: "all 0.2s ease",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <CardContent
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Progress Indicator Dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
            gap: 1,
          }}
        >
          {stats.map((_, index) => (
            <Box
              key={index}
              onClick={() => onIndexChange(index)}
              sx={{
                cursor: "pointer",
                padding: 0.5,
                color:
                  index === currentIndex
                    ? theme.palette.primary.main
                    : theme.palette.action.disabled,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <CircleIcon
                sx={{
                  fontSize: index === currentIndex ? 12 : 8,
                  transition: "font-size 0.2s ease",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* Text Content - Wider */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: { xs: "2.5rem", md: "3rem" },
                lineHeight: 1.1,
              }}
            >
              {currentStat.value}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "text.primary",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
              }}
            >
              {currentStat.title}
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              {currentStat.subtitle}
            </Typography>
          </Box>

          {/* Icon and Progress - Larger */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <Avatar
              sx={{
                bgcolor: `${currentStat.color}.main`,
                width: 80,
                height: 80,
                boxShadow: 3,
              }}
            >
              {React.cloneElement(currentStat.icon, {
                sx: { fontSize: 36 },
              })}
            </Avatar>

            {/* Progress Circle - Larger */}
            <Box sx={{ position: "relative", width: 90, height: 90 }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  fill="none"
                  stroke={theme.palette.action.disabledBackground}
                  strokeWidth="5"
                />
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  fill="none"
                  stroke={theme.palette[currentStat.color].main}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentStat.progress / 100) * 226} 226`}
                  transform="rotate(-90 45 45)"
                />
                <text
                  x="45"
                  y="50"
                  textAnchor="middle"
                  fill={theme.palette.text.primary}
                  fontSize="14"
                  fontWeight="700"
                >
                  {currentStat.progress}%
                </text>
              </svg>
            </Box>
          </Box>
        </Box>

        {/* Change Indicator */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
          }}
        >
          <Chip
            label={currentStat.change}
            size="medium"
            color={currentStat.changeType === "positive" ? "success" : "error"}
            variant="filled"
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              height: "32px",
            }}
          />
        </Box>

        {/* Swipe Hint */}
        {stats.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.6,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Kéo sang trái/phải để xem tiếp
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Custom Chart Components with larger containers
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
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
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
    <ResponsiveContainer width="100%" height={350}>
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
    <ResponsiveContainer width="100%" height={350}>
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
          dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Doanh thu mục tiêu"
          stroke={theme.palette.warning.main}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: theme.palette.warning.main, strokeWidth: 2, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statsCards, setStatsCards] = useState([
    {
      title: "Tổng doanh thu",
      subtitle: "Đang tải...",
      value: "...",
      change: "...",
      changeType: "positive",
      icon: <MoneyIcon />,
      color: "success",
      progress: 0,
    },
    {
      title: "Khách hàng",
      subtitle: "Đang tải...",
      value: "...",
      change: "...",
      changeType: "positive",
      icon: <PeopleIcon />,
      color: "primary",
      progress: 0,
    },
    {
      title: "Xe bán được",
      subtitle: "Đang tải...",
      value: "...",
      change: "...",
      changeType: "positive",
      icon: <CarIcon />,
      color: "info",
      progress: 0,
    },
    {
      title: "Đơn hàng",
      subtitle: "Đang tải...",
      value: "...",
      change: "...",
      changeType: "negative",
      icon: <SalesIcon />,
      color: "warning",
      progress: 0,
    },
  ]);

  const vehiclePerformance = [
    // Mock data as this API is not available yet
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

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [
        summaryData,
        salesProportionData,
        salesSummaryData,
        topVehiclesData,
      ] = await Promise.all([
        reportService.getSummary(),
        reportService.getSalesProportion(),
        reportService.getSalesSummary({ limit: 6 }), // Get last 6 months
        reportService.getTopVehicles({ limit: 5 }),
      ]);

      // 1. Process Summary Data for KPI cards
      setStatsCards((prevStats) => [
        {
          ...prevStats[0],
          value: summaryData.totalRevenue
            ? `${(summaryData.totalRevenue / 1e9).toFixed(1)}B VNĐ`
            : "0 VNĐ",
          subtitle: "Tổng doanh thu",
          progress: 75, // Mock progress
        },
        {
          ...prevStats[1],
          value: summaryData.totalCustomers?.toString() || "0",
          subtitle: "Tổng khách hàng",
          progress: 60, // Mock progress
        },
        {
          ...prevStats[2],
          value: summaryData.vehiclesSold?.toString() || "0",
          subtitle: "Xe bán được",
          progress: 85, // Mock progress
        },
        {
          ...prevStats[3],
          value: summaryData.pendingOrders?.toString() || "0",
          subtitle: "Đơn hàng chờ",
          progress: 45, // Mock progress
        },
      ]);

      // 2. Process Sales Proportion for Pie Chart
      setRevenueByCategory(salesProportionData);

      // 3. Process Sales Summary for Bar and Line charts
      const salesByMonth = (salesSummaryData.salesData || []).map((d) => ({
        name: new Date(d.period).getMonth() + 1,
        sales: d.totalOrders,
        revenue: d.totalSales,
        target: (d.totalOrders * 1.1).toFixed(0), // Mock target
      }));
      setMonthlySales(salesByMonth);
      setRevenueTrend(
        salesByMonth.map((s) => ({
          month: `Tháng ${s.name}`,
          revenue: s.revenue,
          target: s.revenue * 1.1,
        }))
      );

      // 4. Process Top Vehicles
      setTopVehicles(topVehiclesData);

      // Note: Recent Activities might need its own service/endpoint
      setRecentActivities(vehiclePerformance); // Using mock for now
    } catch (err) {
      console.warn("Dashboard fetch failed, using mock data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // User & role-based visibility
  const [currentUser] = useState(() => authService.getCurrentUser());
  const role = currentUser?.role?.toLowerCase() || "customer";

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

  const handleIndexChange = (newIndex) => {
    setCurrentStatIndex(newIndex);
  };

  const visibleStats =
    role === "admin" || role === "branch"
      ? statsCards
      : statsCards.filter((c) => c.title === "Xe bán được");

  useEffect(() => {
    if (visibleStats.length > 1) {
      const interval = setInterval(() => {
        setCurrentStatIndex((prev) =>
          prev < visibleStats.length - 1 ? prev + 1 : 0
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [visibleStats.length]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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

      {/* Scrollable Stats Cards - Full Width */}
      <Box sx={{ mb: 5, width: "100%" }}>
        <ScrollableStats
          stats={visibleStats}
          currentIndex={currentStatIndex}
          onIndexChange={handleIndexChange}
        />
      </Box>

      {/* Chart Section with Tabs - Wider */}
      <Card
        sx={{
          mb: 5,
          borderRadius: 3,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 4,
              pt: 2,
              "& .MuiTabs-flexContainer": {
                justifyContent: {
                  xs: "flex-start",
                },
              },
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

          <Box sx={{ p: 4, minHeight: "400px" }}>
            {tabValue === 0 && ( // Original Tab 0
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <PieChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Phân bổ Doanh thu theo Dòng xe
                </Typography>
                <RevenuePieChart data={revenueByCategory} />
              </Box>
            )}

            {tabValue === 1 && ( // Original Tab 1
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <BarChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Doanh số Bán hàng 6 Tháng Gần đây
                </Typography>
                <SalesBarChart data={monthlySales} />
              </Box>
            )}

            {tabValue === 2 && ( // Original Tab 2
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <LineChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Xu hướng Doanh thu & Mục tiêu
                </Typography>
                <RevenueTrendChart data={revenueTrend} />
              </Box>
            )}

            {tabValue === 3 && ( // Original Tab 3
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <TrendingUpIcon sx={{ mr: 1, color: "primary.main" }} />
                  Hiệu suất Dòng xe
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
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

            {tabValue === 4 && ( // Original Tab 4
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <ChartIcon sx={{ mr: 1, color: "primary.main" }} />
                  Doanh số theo Khu vực
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
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

      {/* ===== 2 CARD BÊN DƯỚI (Căn giữa giống phần KPI trên) ===== */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {/* Bảng Top Vehicles */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              minHeight: "450px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <ChartIcon
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    fontSize: "2.5rem",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ textAlign: "center" }}
                >
                  Xe bán chạy nhất
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <DataTable
                  columns={columns}
                  data={topVehicles}
                  searchable={false}
                  pagination={false}
                  selectable={false}
                  title=""
                  sx={{ height: "100%" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hoạt động gần đây */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              minHeight: "450px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <ScheduleIcon
                  sx={{
                    color: "primary.main",
                    mb: 2,
                    fontSize: "2.5rem",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ textAlign: "center" }}
                >
                  Hoạt động gần đây
                </Typography>
              </Box>
              <List sx={{ flex: 1, overflow: "auto" }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem
                      sx={{
                        px: 2,
                        py: 2,
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 60 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${activity.color}.main`,
                            width: 50,
                            height: 50,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              mt: 0.5,
                              fontSize: "0.9rem",
                            }}
                          >
                            {activity.time}
                          </Typography>
                        }
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
