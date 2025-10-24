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
} from "@mui/material";
import { PageHeader, ModernCard } from "../../components/common";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Handlers (minimal, non-destructive)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    fd.append("fullName", form.fullName?.value || "");
    fd.append("email", form.email?.value || "");
    fd.append("phone", form.phone?.value || "");
    const avatarFile = form.avatar?.files && form.avatar.files[0];
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      // Assume backend accepts multipart/form-data at PUT /users/me
      await api.put("/users/me", fd);
      alert("Cập nhật profile thành công");
    } catch (err) {
      alert("Cập nhật profile thất bại: " + (err || ""));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form.currentPassword?.value || "";
    const newPassword = form.newPassword?.value || "";
    const confirmPassword = form.confirmPassword?.value || "";

    if (!newPassword || newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp hoặc trống");
      return;
    }

    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      alert("Đổi mật khẩu thành công");
      form.reset();
    } catch (err) {
      alert("Đổi mật khẩu thất bại: " + (err || ""));
    }
  };

  const handleSaveRoles = async (e) => {
    e.preventDefault();
    // Minimal stub: in future, collect role data and call API
    alert("Lưu quyền (stub)");
  };

  const user = authService.getCurrentUser();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Cài đặt"
        subtitle="Quản lý thông tin người dùng và quyền truy cập"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Settings
              </Typography>
            </Box>

            <Box className="tabs" sx={{ mb: 2, display: "flex", gap: 1 }}>
              <Box
                component="button"
                sx={{
                  px: 2,
                  py: 1,
                  border: "none",
                  borderRadius: 1,
                  backgroundColor:
                    activeTab === "profile" ? "primary.main" : "grey.100",
                  color: activeTab === "profile" ? "white" : "text.primary",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "profile" ? "primary.dark" : "grey.200",
                  },
                }}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </Box>
              <Box
                component="button"
                sx={{
                  px: 2,
                  py: 1,
                  border: "none",
                  borderRadius: 1,
                  backgroundColor:
                    activeTab === "password" ? "primary.main" : "grey.100",
                  color: activeTab === "password" ? "white" : "text.primary",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "password" ? "primary.dark" : "grey.200",
                  },
                }}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </Box>
              <Box
                component="button"
                sx={{
                  px: 2,
                  py: 1,
                  border: "none",
                  borderRadius: 1,
                  backgroundColor:
                    activeTab === "permissions" ? "primary.main" : "grey.100",
                  color: activeTab === "permissions" ? "white" : "text.primary",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      activeTab === "permissions" ? "primary.dark" : "grey.200",
                  },
                }}
                onClick={() => setActiveTab("permissions")}
              >
                Permissions
              </Box>
            </Box>

            <div className="tab-content">
              {activeTab === "profile" && (
                <div className="profile-settings">
                  <h2>Profile Settings</h2>
                  <form onSubmit={handleProfileSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        name="fullName"
                        label="Full Name"
                        defaultValue="John Doe"
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="email"
                        type="email"
                        label="Email"
                        defaultValue="john@example.com"
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="phone"
                        type="tel"
                        label="Phone"
                        defaultValue="(123) 456-7890"
                        fullWidth
                        size="small"
                      />
                      <Box
                        component="input"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        sx={{
                          "::file-selector-button": {
                            px: 2,
                            py: 1,
                            border: "none",
                            borderRadius: 1,
                            backgroundColor: "grey.100",
                            cursor: "pointer",
                            mr: 2,
                            "&:hover": {
                              backgroundColor: "grey.200",
                            },
                          },
                        }}
                      />
                    </Box>
                    <Box
                      component="button"
                      type="submit"
                      sx={{
                        px: 3,
                        py: 1,
                        border: "none",
                        borderRadius: 1,
                        backgroundColor: "primary.main",
                        color: "white",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Update Profile
                    </Box>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="password-settings">
                  <h2>Change Password</h2>
                  <form onSubmit={handlePasswordSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        name="currentPassword"
                        type="password"
                        label="Current Password"
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="newPassword"
                        type="password"
                        label="New Password"
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="confirmPassword"
                        type="password"
                        label="Confirm New Password"
                        fullWidth
                        size="small"
                      />
                    </Box>
                    <Box
                      component="button"
                      type="submit"
                      sx={{
                        px: 3,
                        py: 1,
                        border: "none",
                        borderRadius: 1,
                        backgroundColor: "primary.main",
                        color: "white",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Change Password
                    </Box>
                  </form>
                </div>
              )}

              {activeTab === "permissions" && (
                <div className="permissions-settings">
                  <h2>Role & Permissions</h2>
                  {!user || user.role !== "Admin" ? (
                    <p>Bạn không có quyền truy cập vào phần quản lý quyền.</p>
                  ) : (
                    <form onSubmit={handleSaveRoles}>
                      <p>Quản lý vai trò (Admin)</p>
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Box
                            component="input"
                            type="checkbox"
                            name="manageUsers"
                            defaultChecked
                            sx={{
                              mr: 1,
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                          />
                          <Typography>Quản lý người dùng</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="input"
                            type="checkbox"
                            name="manageSettings"
                            sx={{
                              mr: 1,
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                          />
                          <Typography>Quản lý hệ thống</Typography>
                        </Box>
                      </Box>
                      <Box
                        component="button"
                        type="submit"
                        sx={{
                          px: 3,
                          py: 1,
                          border: "none",
                          borderRadius: 1,
                          backgroundColor: "primary.main",
                          color: "white",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                      >
                        Save Roles
                      </Box>
                    </form>
                  )}
                </div>
              )}
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <ModernCard
            title={user?.fullName || "Người dùng"}
            subtitle={user?.email || ""}
            value={user?.role || "—"}
            icon={
              user?.avatar ? (
                <Avatar src={user.avatar} />
              ) : (
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {(user?.fullName || "U").charAt(0)}
                </Avatar>
              )
            }
            color="primary"
          />

          <Paper sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Trợ giúp nhanh
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn có thể cập nhật thông tin hồ sơ và thay đổi mật khẩu ở đây.
              Quyền truy cập vào phần quản lý quyền chỉ dành cho Admin.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
