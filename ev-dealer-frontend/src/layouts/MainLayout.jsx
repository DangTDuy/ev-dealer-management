import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  ShoppingCart as SalesIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const miniDrawerWidth = 70;

const navItems = [
  {
    text: 'Bảng điều khiển',
    icon: <DashboardIcon />,
    path: '/dashboard',
    badge: null
  },
  {
    text: 'Quản lý xe',
    icon: <CarIcon />,
    path: '/vehicles',
    badge: null
  },
  {
    text: 'Khách hàng',
    icon: <PeopleIcon />,
    path: '/customers',
    badge: '12'
  },
  {
    text: 'Bán hàng',
    icon: <SalesIcon />,
    path: '/sales',
    badge: '3'
  },
  {
    text: 'Thông báo',
    icon: <NotificationsIcon />,
    path: '/notifications',
    badge: '6'
  },
  {
    text: 'Báo cáo',
    icon: <ReportIcon />,
    path: '/reports',
    badge: null
  },
  {
    text: 'Cài đặt',
    icon: <SettingsIcon />,
    path: '/settings',
    badge: null
  },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniDrawer, setMiniDrawer] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMiniDrawerToggle = () => {
    setMiniDrawer(!miniDrawer);
  };

  const currentDrawerWidth = miniDrawer ? miniDrawerWidth : drawerWidth;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: miniDrawer ? 'center' : 'flex-start',
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!miniDrawer && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 32,
                height: 32,
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              EV
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              EV Dealer
            </Typography>
          </Box>
        )}
        {miniDrawer && (
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            EV
          </Avatar>
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={miniDrawer ? item.text : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      mx: 0.5,
                      minHeight: 48,
                      justifyContent: miniDrawer ? 'center' : 'flex-start',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: miniDrawer ? 'auto' : 40,
                        justifyContent: 'center',
                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                      }}
                    >
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error" size="small">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    {!miniDrawer && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Tooltip title={miniDrawer ? 'Admin User\nadmin@evdealer.com' : ''} placement="right">
          <ListItemButton
            sx={{
              borderRadius: 2,
              p: miniDrawer ? 1 : 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: miniDrawer ? 'center' : 'flex-start',
              gap: miniDrawer ? 0 : 1,
              minHeight: miniDrawer ? 48 : 'auto',
            }}
          >
            <Avatar
              sx={{
                width: miniDrawer ? 40 : 32,
                height: miniDrawer ? 40 : 32,
                bgcolor: 'secondary.main',
                fontSize: miniDrawer ? '1.1rem' : '1rem',
              }}
            >
              <AccountIcon />
            </Avatar>
            {!miniDrawer && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  admin@evdealer.com
                </Typography>
              </Box>
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? handleDrawerToggle : handleMiniDrawerToggle}
            sx={{ mr: 2 }}
          >
            {isMobile ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname === '/dashboard' && 'Bảng điều khiển'}
            {location.pathname === '/vehicles' && 'Quản lý xe'}
            {location.pathname === '/customers' && 'Quản lý khách hàng'}
            {location.pathname === '/sales' && 'Bán hàng'}
            {location.pathname === '/notifications' && 'Thông báo'}
            {location.pathname === '/reports' && 'Báo cáo'}
            {location.pathname === '/settings' && 'Cài đặt'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Chip
              label="Online"
              color="success"
              size="small"
              sx={{ 
                '& .MuiChip-label': { 
                  fontSize: '0.75rem',
                  fontWeight: 600 
                } 
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '1200px' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
