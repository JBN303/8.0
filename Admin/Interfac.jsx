import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout'; // Import LogoutIcon from Material-UI

const drawerWidth = 240;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear session (example: remove token from local storage)
    localStorage.removeItem('adminToken');

    // Redirect to login page
    navigate('/admin', { replace: true });
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#77d5cb' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {[
                { text: 'Dashboard', icon: <InboxIcon /> },
                { text: 'Doctors List', icon: <MailIcon />, link: '/doctorview' },
                { text: 'Patient List', icon: <InboxIcon />, link: '/pview' },
                // Add other menu items
              ].map(({ text, icon, link }, index) => (
                <ListItem key={text} disablePadding button onClick={() => navigateTo(link)}>
                  <ListItemButton>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />

            {/* Logout button */}
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </div>
      <div sx={{ flexGrow: 7, p: 3 }}>
        <Box component="main" sx={{ flexGrow: 7, p: 3 }}>
          {/* The content of the selected view will be rendered here */}
        </Box>
      </div>
    </Box>
  );
}