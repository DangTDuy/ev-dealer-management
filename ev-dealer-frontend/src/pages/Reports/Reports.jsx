import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import {
  Assessment as ChartIcon,
  FileDownload as DownloadIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader, ModernCard } from "../../components/common";

// Mock data
const mockRegionalData = [
  { region: "Miền Bắc", sales: 450, value: 12500000000 },
  { region: "Miền Trung", sales: 280, value: 8000000000 },
  { region: "Miền Nam", sales: 620, value: 16000000000 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(false);

  // derived values for donut chart (sales share)
  const pieData = useMemo(
    () => mockRegionalData.map((d) => ({ name: d.region, value: d.sales })),
    []
  );

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleExport = (type) => {
    // placeholder - integrate real export logic later
    alert(`Exporting ${type}...`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Báo cáo & Phân tích"
        subtitle="Tạo và xuất báo cáo chi tiết về doanh số, tồn kho và hiệu suất"
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              select
              fullWidth
              label="Loại báo cáo"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="sales">Báo cáo doanh số</MenuItem>
              <MenuItem value="inventory">Báo cáo tồn kho</MenuItem>
              <MenuItem value="revenue">Báo cáo doanh thu</MenuItem>
              <MenuItem value="performance">Báo cáo hiệu suất</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} md={3} lg={2}>
            <TextField
              type="date"
              fullWidth
              label="Từ ngày"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6} md={3} lg={2}>
            <TextField
              type="date"
              fullWidth
              label="Đến ngày"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2} lg={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={<ChartIcon />}
              >
                {loading ? "Đang tạo..." : "Tạo báo cáo"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport("excel")}
              >
                Xuất
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <ModernCard
            title="Tổng doanh số"
            value="1,350"
            subtitle="Số lượng xe"
            icon={<ChartIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ModernCard
            title="Doanh thu"
            value="36.5B VNĐ"
            subtitle="Tổng doanh thu"
            icon={<ChartIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ModernCard
            title="Đại lý hoạt động"
            value="24/30"
            subtitle="Số lượng đại lý"
            icon={<ChartIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ModernCard
            title="Tỷ lệ chuyển đổi"
            value="5.2%"
            subtitle="Trung bình"
            icon={<ChartIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Left: Bar chart, Right: Donut */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh số theo khu vực
            </Typography>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={mockRegionalData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Số lượng" fill="#8884d8" />
                <Bar dataKey="value" name="Doanh thu (VNĐ)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Tỷ trọng doanh số
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {mockRegionalData.map((d, i) => (
                <Box
                  key={d.region}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: COLORS[i % COLORS.length],
                      borderRadius: 0.5,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {d.region}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {d.sales} xe • {(d.value / 1000000000).toFixed(1)}B VND
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Export Buttons */}
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => handleExport("excel")}
          sx={{ mr: 1 }}
        >
          Xuất Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => handleExport("pdf")}
        >
          Xuất PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Reports;
