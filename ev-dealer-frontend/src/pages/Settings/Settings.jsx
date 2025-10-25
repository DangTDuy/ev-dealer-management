/**
 * Settings Page
 * TODO: Implement settings with tabs:
 * - Profile (name, email, phone, avatar)
 * - Change Password
 * - Role & Permissions (Admin only)
 * - System Settings (Admin only)
 */

import React, { useState } from "react";
import api from "../../services/api";
import authService from "../../services/authService";
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
} from "@mui/material";
import {
  Person,
  Lock,
  Security,
  Help,
  Save,
  Key,
  Email,
  Phone,
  Upload,
  Notifications,
  Language,
} from "@mui/icons-material";
import { PageHeader, ModernCard } from "../../components/common";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const fd = new FormData();
    fd.append("fullName", form.fullName?.value || "");
    fd.append("email", form.email?.value || "");
    fd.append("phone", form.phone?.value || "");
    const avatarFile = form.avatar?.files && form.avatar.files[0];
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      await api.put("/users/me", fd);
      alert("Cập nhật profile thành công");
    } catch (err) {
      alert("Cập nhật profile thất bại: " + (err || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const currentPassword = form.currentPassword?.value || "";
    const newPassword = form.newPassword?.value || "";
    const confirmPassword = form.confirmPassword?.value || "";

    if (!newPassword || newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp hoặc trống");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      alert("Đổi mật khẩu thành công");
      form.reset();
    } catch (err) {
      alert("Đổi mật khẩu thất bại: " + (err || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRoles = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      alert("Lưu quyền (stub)");
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = authService.getCurrentUser();

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
        // Thêm padding để tránh chồng chéo với sidebar fixed
        pr: { lg: "400px", xs: 0 },
        transition: "padding-right 0.3s ease-in-out",
      }}
    >
      <PageHeader
        title="Cài đặt"
        subtitle="Quản lý thông tin người dùng và quyền truy cập"
      />

      <Grid container spacing={3}>
        {/* Main Content - Chiếm toàn bộ không gian có sẵn */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              boxShadow: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
              minHeight: "600px",
              // Đảm bảo không bị ẩn sau sidebar
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                <Security fontSize="large" /> Cài đặt hệ thống
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 1, ml: { xs: 0, md: 6 } }}
              >
                Quản lý thông tin cá nhân, bảo mật và phân quyền
              </Typography>
            </Box>

            {/* Tabs với full width */}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 3,
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    py: 2,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    fontWeight: 600,
                    minHeight: "60px",
                    minWidth: { xs: "120px", md: "auto" },
                  },
                }}
              >
                <Tab
                  icon={<Person />}
                  iconPosition="start"
                  label="Hồ sơ cá nhân"
                />
                <Tab
                  icon={<Lock />}
                  iconPosition="start"
                  label="Bảo mật & Mật khẩu"
                />
                <Tab
                  icon={<Security />}
                  iconPosition="start"
                  label="Phân quyền hệ thống"
                />
              </Tabs>
            </Box>

            <Box className="tab-content" sx={{ width: "100%" }}>
              {/* Tab 1: Profile */}
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={8}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: "primary.main",
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                      }}
                    >
                      <Person sx={{ mr: 2, verticalAlign: "middle" }} />
                      Cập nhật thông tin cá nhân
                    </Typography>

                    <form onSubmit={handleProfileSubmit}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          mb: 4,
                        }}
                      >
                        <TextField
                          name="fullName"
                          label="Họ và tên"
                          defaultValue={user?.fullName || ""}
                          fullWidth
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <Person sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                        <TextField
                          name="email"
                          type="email"
                          label="Địa chỉ email"
                          defaultValue={user?.email || ""}
                          fullWidth
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <Email sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                        <TextField
                          name="phone"
                          type="tel"
                          label="Số điện thoại"
                          defaultValue={user?.phone || ""}
                          fullWidth
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <Phone sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />

                        <Box
                          sx={{
                            border: `2px dashed ${theme.palette.primary.main}`,
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                          >
                            <Upload sx={{ mr: 1, verticalAlign: "middle" }} />
                            Ảnh đại diện
                          </Typography>
                          <Box
                            component="input"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            sx={{
                              width: "100%",
                              p: 2,
                              "::file-selector-button": {
                                px: 3,
                                py: 1.5,
                                border: "none",
                                borderRadius: 2,
                                backgroundColor: "primary.main",
                                color: "white",
                                cursor: "pointer",
                                mr: 2,
                                fontWeight: 600,
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Chọn file ảnh với định dạng JPG, PNG hoặc GIF (tối
                            đa 5MB)
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: { xs: "center", md: "flex-start" },
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<Save />}
                          disabled={isSubmitting}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "1rem",
                            minWidth: { xs: "140px", md: "auto" },
                          }}
                        >
                          {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            minWidth: { xs: "140px", md: "auto" },
                          }}
                        >
                          Hủy bỏ
                        </Button>
                      </Box>
                    </form>
                  </Grid>

                  {/* Info Cards Column */}
                  <Grid item xs={12} lg={4}>
                    <Card
                      sx={{
                        bgcolor: "primary.light",
                        color: "white",
                        mb: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          💡 Mẹo hồ sơ
                        </Typography>
                        <Typography variant="body2">
                          • Sử dụng ảnh đại diện rõ ràng, chuyên nghiệp
                        </Typography>
                        <Typography variant="body2">
                          • Cập nhật số điện thoại chính xác
                        </Typography>
                        <Typography variant="body2">
                          • Email sẽ được dùng để khôi phục tài khoản
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Thông tin tài khoản
                        </Typography>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">Trạng thái:</Typography>
                            <Chip
                              label="Đang hoạt động"
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Ngày tham gia:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              15/12/2024
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Lần đăng nhập cuối:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              Hôm nay
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab 2: Security - Giữ nguyên code gốc */}
              <TabPanel value={activeTab} index={1}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: "primary.main",
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                      }}
                    >
                      <Key sx={{ mr: 2, verticalAlign: "middle" }} />
                      Quản lý bảo mật
                    </Typography>

                    <Alert severity="info" sx={{ mb: 4 }}>
                      Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                      thường, số và ký tự đặc biệt.
                    </Alert>

                    <form onSubmit={handlePasswordSubmit}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          mb: 4,
                        }}
                      >
                        <TextField
                          name="currentPassword"
                          type="password"
                          label="Mật khẩu hiện tại"
                          fullWidth
                          variant="outlined"
                          size="medium"
                          required
                          InputProps={{
                            startAdornment: (
                              <Lock sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                        <TextField
                          name="newPassword"
                          type="password"
                          label="Mật khẩu mới"
                          fullWidth
                          variant="outlined"
                          size="medium"
                          required
                          InputProps={{
                            startAdornment: (
                              <Key sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                        <TextField
                          name="confirmPassword"
                          type="password"
                          label="Xác nhận mật khẩu mới"
                          fullWidth
                          variant="outlined"
                          size="medium"
                          required
                          InputProps={{
                            startAdornment: (
                              <Key sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          border: `2px dashed ${theme.palette.primary.main}`,
                          borderRadius: 2,
                          p: 3,
                          textAlign: "center",
                          backgroundColor: "action.hover",
                          mb: 4,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          <Security sx={{ mr: 1, verticalAlign: "middle" }} />
                          Xác thực hai yếu tố (2FA)
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          Bảo vệ tài khoản của bạn bằng cách kích hoạt xác thực
                          hai yếu tố
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Security />}
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                          }}
                        >
                          Thiết lập xác thực 2FA
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: { xs: "center", md: "flex-start" },
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<Save />}
                          disabled={isSubmitting}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "1rem",
                            minWidth: { xs: "140px", md: "auto" },
                          }}
                        >
                          {isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            minWidth: { xs: "140px", md: "auto" },
                          }}
                        >
                          Hủy bỏ
                        </Button>
                      </Box>
                    </form>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card
                      sx={{
                        bgcolor: "error.lighter",
                        color: "error.dark",
                        mb: 2,
                        border: 1,
                        borderColor: "error.light",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          🛡️ Lưu ý bảo mật
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • Đổi mật khẩu định kỳ 3 tháng/lần
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • Không sử dụng mật khẩu cũ
                        </Typography>
                        <Typography variant="body2">
                          • Bật xác thực 2 yếu tố nếu có
                        </Typography>
                      </CardContent>
                    </Card>

                    <Card
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 2,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Lịch sử bảo mật
                        </Typography>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Lần đổi mật khẩu cuối:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              1 tuần trước
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Trạng thái 2FA:
                            </Typography>
                            <Chip
                              label="Chưa kích hoạt"
                              color="warning"
                              size="small"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2">
                              Thiết bị đăng nhập:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              2 thiết bị
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab 3: Permissions - Giữ nguyên code gốc */}
              <TabPanel value={activeTab} index={2}>
                <div className="permissions-settings">
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    <Security sx={{ mr: 2, verticalAlign: "middle" }} />
                    Quản lý phân quyền hệ thống
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                      {!user || user.role !== "Admin" ? (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                          Bạn không có quyền truy cập vào phần quản lý quyền.
                        </Alert>
                      ) : (
                        <form onSubmit={handleSaveRoles}>
                          <Alert severity="info" sx={{ mb: 4 }}>
                            Quản lý vai trò và quyền truy cập cho người dùng hệ
                            thống.
                          </Alert>

                          <Card sx={{ mb: 3, p: 3, borderRadius: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, fontWeight: 600 }}
                            >
                              Quyền quản trị
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="manageUsers"
                                    defaultChecked
                                    color="primary"
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      Quản lý người dùng
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Cho phép thêm, sửa, xóa người dùng hệ
                                      thống
                                    </Typography>
                                  </Box>
                                }
                              />
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="manageSettings"
                                    color="primary"
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      fontWeight={600}
                                    >
                                      Quản lý hệ thống
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Cho phép thay đổi cấu hình hệ thống
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Box>
                          </Card>

                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            disabled={isSubmitting}
                            sx={{
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                            }}
                          >
                            {isSubmitting
                              ? "Đang lưu..."
                              : "Lưu cài đặt phân quyền"}
                          </Button>
                        </form>
                      )}
                    </Grid>
                  </Grid>
                </div>
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sidebar bên phải - FIXED POSITION */}
      <Box
        sx={{
          position: "fixed",
          top: "100px",
          right: "24px",
          width: "350px",
          height: "calc(100vh - 140px)",
          overflowY: "auto",
          display: { xs: "none", lg: "block" },
          zIndex: 1000,
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "divider",
            borderRadius: "4px",
          },
        }}
      >
        <ModernCard
          title={user?.fullName || "Người dùng"}
          subtitle={user?.email || ""}
          value={user?.role || "—"}
          icon={
            user?.avatar ? (
              <Avatar src={user.avatar} sx={{ width: 60, height: 60 }} />
            ) : (
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 60,
                  height: 60,
                  fontSize: "1.5rem",
                }}
              >
                {(user?.fullName || "U").charAt(0).toUpperCase()}
              </Avatar>
            )
          }
          color="primary"
        />

        <Card
          sx={{
            mt: 3,
            borderRadius: 3,
            boxShadow: 2,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Help /> Trợ giúp & Hỗ trợ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Hướng dẫn sử dụng
              </Button>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Bảo mật tài khoản
              </Button>
              <Button
                variant="outlined"
                startIcon={<Security />}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Quản lý phân quyền
              </Button>
              <Button
                variant="outlined"
                startIcon={<Notifications />}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Cài đặt thông báo
              </Button>
              <Button
                variant="outlined"
                startIcon={<Language />}
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Ngôn ngữ & Vùng
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Thêm card thống kê */}
        <Card sx={{ mt: 3, p: 2, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              📊 Hoạt động gần đây
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  Đăng nhập thành công
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Hôm nay, 14:30
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  Cập nhật hồ sơ
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  2 ngày trước
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  Đổi mật khẩu
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  1 tuần trước
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Settings;
