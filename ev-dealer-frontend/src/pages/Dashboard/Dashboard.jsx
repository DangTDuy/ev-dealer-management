import React from "react";
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
} from "@mui/icons-material";
import { PageHeader, ModernCard, DataTable } from "../../components/common";

const Dashboard = () => {
  // Mock data for dashboard
  const statsCards = [
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

  const recentActivities = [
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

  const topVehicles = [
    { id: 1, name: "Tesla Model 3", sales: 45, revenue: "1.2B VNĐ" },
    { id: 2, name: "BMW i3", sales: 32, revenue: "800M VNĐ" },
    { id: 3, name: "Audi e-tron", sales: 28, revenue: "1.5B VNĐ" },
    { id: 4, name: "Mercedes EQC", sales: 25, revenue: "1.8B VNĐ" },
    { id: 5, name: "Porsche Taycan", sales: 18, revenue: "2.1B VNĐ" },
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

  return (
    <Container maxWidth="xl">
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
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ModernCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Charts and Activities */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow:
                "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
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
              boxShadow:
                "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
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
