import { AppBar, Avatar, Box, CssBaseline, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme } from '@mui/material';
import { Brightness4, Brightness7, Dashboard, Logout, Menu } from '@mui/icons-material';
import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserSession } from '../../types';

interface LayoutProps {
  user: UserSession | null;
  onLogout: () => void;
  mode: 'light' | 'dark';
  onToggleMode: () => void;
  children?: ReactNode;
}

const drawerWidth = 240;

export function Layout({ user, onLogout, mode, onToggleMode, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = useMemo(() => [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  ], []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((prev) => !prev)} sx={{ mr: 2, display: { md: 'none' } }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              PRIVE Admin
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={onToggleMode}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {user ? (
              <>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>{user.name}</Typography>
                <IconButton color="inherit" onClick={onLogout}>
                  <Logout />
                </IconButton>
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItemButton key={item.label} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid rgba(0,0,0,0.08)' } }} open>
        <Toolbar />
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton key={item.label} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
