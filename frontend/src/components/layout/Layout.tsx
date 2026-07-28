import { AppBar, Avatar, Box, Collapse, CssBaseline, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme, } from "@mui/material";
import { AttachMoney, Brightness4, Brightness7, Dashboard, Event, ExpandLess, ExpandMore, FolderOpen, Logout, Menu, Person,} from "@mui/icons-material";
import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UserSession } from "../../types";

interface LayoutProps {
  user: UserSession | null;
  onLogout: () => void;
  mode: "light" | "dark";
  onToggleMode: () => void;
  children?: ReactNode;
}

const drawerWidth = 240;

export function Layout({
  user,
  onLogout,
  mode,
  onToggleMode,
  children,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },     
      { label: "Agendamento", icon: <Event />, path: "/agendamento"},    
    ],
    [],
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        elevation={2}
        sx={{
          bgcolor: "#FDF6E3",
          color: "#4E342E",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={{ mr: 2, display: { md: "none" }, color: "#4E342E" }}>
              <Menu />
            </IconButton>
            <Typography variant="h6"
              sx={{
                  fontWeight: 700,
                  color: "#4E342E",
              }}>
              Prive das Thermas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={onToggleMode}
                        sx={{
                        color: "#4E342E",
                      }}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {user ? (
              <>
                <Avatar sx={{  bgcolor: "#B71C1C",
                               color: "#FFFFFF", }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ color: "#4E342E" }}
                >
                  {user.name}
                </Typography>
                <IconButton color="inherit" onClick={onLogout}>
                  <Logout />
                </IconButton>
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#B71C1C",
            color: "#FFFFFF",
            borderRight: "none",
          },
        }}
        open
      >
        <Toolbar />
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#D32F2F",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#FFFFFF",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          <ListItemButton
            onClick={() => setCadastroOpen(!cadastroOpen)}
            sx={{
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#FFFFFF",
                minWidth: 40,
              }}
            >
              <FolderOpen />
            </ListItemIcon>
            <ListItemText primary="Cadastrar" />
            {cadastroOpen ? (
              <ExpandLess sx={{ color: "#FFFFFF" }} />
            ) : (
              <ExpandMore sx={{ color: "#FFFFFF" }} />
            )}
          </ListItemButton>
          <Collapse in={cadastroOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#D32F2F",
                  },
                }}
                onClick={() => navigate("/clientes")}
              >
                <ListItemIcon
                  sx={{
                    color: "#FFFFFF",
                    minWidth: 40,
                  }}
                >
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Cadastrar Cliente" />
              </ListItemButton>

              <ListItemButton
                sx={{
                  pl: 4,
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#D32F2F",
                  },
                }}
                onClick={() => navigate("/despesas")}
              >
                <ListItemIcon
                  sx={{
                    color: "#FFFFFF",
                    minWidth: 40,
                  }}
                >
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText primary="Cadastrar Despesas" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
