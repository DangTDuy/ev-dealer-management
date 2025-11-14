import React, { useState, useEffect, useMemo } from "react";
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
  Container,
  Card,
  CardContent,
  useTheme,
  Fade,
  Skeleton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Assessment as ChartIcon,
  FileDownload as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Store as StoreIcon,
  Percent as PercentIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
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
import { reportService } from "../../services/reportService";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6"];

// Simple metric card - matching Sales page style
const MetricCard = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#06B6D4",
  };
  
  const iconColor = colorMap[color] || colorMap.primary;
  
  return (
    <Card
      sx={{
        height: "100%",
        backgroundColor: "white",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "8px",
              backgroundColor: `${iconColor}15`,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "#0F172A",
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: "#0F172A",
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748B",
            fontSize: "0.875rem",
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regionalData, setRegionalData] = useState([]);
  const [proportionData, setProportionData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [topVehicles, setTopVehicles] = useState([]);

  // derived values for donut chart (sales share)
  const pieData = useMemo(
    () => proportionData.map((d) => ({ name: d.region, value: d.sales })),
    [proportionData]
  );

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        from: fromDate || undefined,
        to: toDate || undefined,
        type: reportType,
      };

      const [summaryRes, regionsRes, proportionRes, topRes] = await Promise.all([
        reportService.getSummary(params).catch((e) => {
          console.error("Error fetching summary:", e);
          return null;
        }),
        reportService.getSalesByRegion(params).catch((e) => {
          console.error("Error fetching sales by region:", e);
          return [];
        }),
        reportService.getSalesProportion(params).catch((e) => {
          console.error("Error fetching sales proportion:", e);
          return [];
        }),
        reportService.getTopVehicles({ ...params, limit: 5 }).catch((e) => {
          console.error("Error fetching top vehicles:", e);
          return [];
        }),
      ]);

      if (summaryRes) setSummary(summaryRes);
      if (regionsRes && Array.isArray(regionsRes)) {
        setRegionalData(regionsRes);
      }
      if (proportionRes && Array.isArray(proportionRes)) {
        setProportionData(proportionRes);
      }
      if (topRes && Array.isArray(topRes)) {
        setTopVehicles(topRes);
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []); // Load data on mount

  const handleGenerateReport = async () => {
    await fetchReportData();
  };

  const handleExport = async (type) => {
    setLoading(true);
    try {
      const blob = await reportService.exportReport({ type });
      // create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // prefer csv filename returned by backend — fallback
      a.download = `report_${type}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header - Centered */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#0F172A",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Báo cáo & Phân tích
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748B", fontSize: "1rem" }}
          >
            Tạo và xuất báo cáo chi tiết về doanh số, tồn kho và hiệu suất
          </Typography>
        </Box>

        {/* Filters - Simple Design - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              width: "100%",
              maxWidth: "1200px",
            }}
          >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              select
              fullWidth
              label="Loại báo cáo"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                  color: "#64748B",
                },
              }}
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
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                  color: "#64748B",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} md={3} lg={2}>
            <TextField
              type="date"
              fullWidth
              label="Đến ngày"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                  color: "#64748B",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={2} lg={3}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: "#3B82F6",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                  "&:disabled": {
                    backgroundColor: "#D1D5DB",
                    color: "#9CA3AF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Đang tải..." : "Tạo báo cáo"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport("excel")}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderColor: "#D1D5DB",
                  color: "#374151",
                  backgroundColor: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F3F4F6",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Xuất
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
        </Box>

        {/* Error Message */}
        {error && (
          <Fade in={true}>
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="error"
                sx={{
                  borderRadius: "8px",
                  border: "1px solid #FEE2E2",
                }}
              >
                {error}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Summary Cards - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Grid container spacing={3} sx={{ maxWidth: "1200px" }}>
            <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard
                title="Tổng doanh số"
                value={
                  summary?.totalSales
                    ? summary.totalSales.toLocaleString("vi-VN")
                    : "0"
                }
                subtitle="Số lượng xe"
                icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                color="primary"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard
                title="Doanh thu"
                value={
                  summary?.totalRevenue
                    ? `${(summary.totalRevenue / 1000000000).toFixed(1)}B VNĐ`
                    : "0B VNĐ"
                }
                subtitle="Tổng doanh thu"
                icon={<MoneyIcon sx={{ fontSize: 28 }} />}
                color="success"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard
                title="Đại lý hoạt động"
                value={
                  summary
                    ? `${summary.activeDealers || 0}/${summary.totalDealers || 0}`
                    : "0/0"
                }
                subtitle="Số lượng đại lý"
                icon={<StoreIcon sx={{ fontSize: 28 }} />}
                color="warning"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard
                title="Tỷ lệ chuyển đổi"
                value={
                  summary?.conversionRate
                    ? `${(summary.conversionRate * 100).toFixed(1)}%`
                    : "0%"
                }
                subtitle="Trung bình"
                icon={<PercentIcon sx={{ fontSize: 28 }} />}
                color="info"
              />
            )}
          </Grid>
          </Grid>
        </Box>

        {/* Charts - Equal Size and Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Grid container spacing={3} sx={{ maxWidth: "1200px" }}>
            {/* Bar Chart */}
            <Grid item xs={12} lg={6}>
            <Fade in={!loading} timeout={1000}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "500px",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#0F172A",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Doanh số theo khu vực
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: "#64748B", fontSize: "14px", textAlign: "center" }}
                  >
                    Phân tích doanh số và doanh thu theo từng khu vực
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "350px", width: "100%" }}>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : regionalData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={regionalData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E2E8F0"
                      />
                      <XAxis
                        dataKey="region"
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        axisLine={{ stroke: "#E2E8F0" }}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        axisLine={{ stroke: "#E2E8F0" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 20 }}
                        iconType="circle"
                      />
                      <Bar
                        dataKey="sales"
                        name="Số lượng"
                        fill="#3B82F6"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="revenue"
                        name="Doanh thu (VNĐ)"
                        fill="#10B981"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "350px",
                        width: "100%",
                        color: "#64748B",
                        textAlign: "center",
                      }}
                    >
                      <ChartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3, color: "#64748B" }} />
                      <Typography variant="h6" sx={{ color: "#0F172A", mb: 1, fontWeight: 600 }}>
                        Không có dữ liệu
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        Vui lòng tạo báo cáo để xem dữ liệu
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Donut Chart */}
          <Grid item xs={12} lg={6}>
            <Fade in={!loading} timeout={1200}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "500px",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#0F172A",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Tỷ trọng doanh số
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: "#64748B", fontSize: "14px", textAlign: "center" }}
                  >
                    Phân bổ doanh số theo khu vực
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "350px", width: "100%" }}>
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "350px",
                          width: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={75}
                          outerRadius={115}
                          paddingAngle={5}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 8,
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          }}
                        />
                      </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "350px",
                          width: "100%",
                          color: "#64748B",
                          textAlign: "center",
                        }}
                      >
                        <ChartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3, color: "#64748B" }} />
                        <Typography variant="h6" sx={{ color: "#0F172A", mb: 1, fontWeight: 600 }}>
                          Không có dữ liệu
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748B" }}>
                          Vui lòng tạo báo cáo để xem dữ liệu
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {proportionData.length > 0
                      ? proportionData.map((d, i) => (
                          <Box
                            key={d.region}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              p: 1.5,
                              borderRadius: 2,
                              background: `${COLORS[i % COLORS.length]}15`,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: `${COLORS[i % COLORS.length]}20`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: COLORS[i % COLORS.length],
                                boxShadow: `0 2px 4px ${COLORS[i % COLORS.length]}40`,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, mb: 0.25 }}
                              >
                                {d.region}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary" }}
                              >
                                {d.sales} xe • {(d.revenue / 1000000000).toFixed(1)}B VND
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: COLORS[i % COLORS.length],
                              }}
                            >
                              {d.salesPercentage?.toFixed(1) || 0}%
                            </Typography>
                          </Box>
                        ))
                      : !loading && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 2 }}
                          >
                            Không có dữ liệu
                          </Typography>
                        )}
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
        </Box>

        {/* Export Buttons - Centered */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("sales")}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "#10B981",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#059669",
              },
              "&:disabled": {
                backgroundColor: "#D1D5DB",
                color: "#9CA3AF",
              },
              transition: "all 0.2s ease",
            }}
          >
            Xuất Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("inventory")}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "#F59E0B",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#D97706",
              },
              "&:disabled": {
                backgroundColor: "#D1D5DB",
                color: "#9CA3AF",
              },
              transition: "all 0.2s ease",
            }}
          >
            Xuất PDF
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Reports;
