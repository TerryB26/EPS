import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, AppBar, Toolbar, useMediaQuery } from '@mui/material';
import { MdMenu, MdHome, MdSettings, MdInfo } from 'react-icons/md';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { IoLibraryOutline,IoPersonCircleOutline } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaRegCalendarPlus, FaUserCog } from "react-icons/fa";

const theme = createTheme({
  palette: {
    primary: {
      main: '#800080', 
    },
  },
});

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:500px)');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex">
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{ 
            width: 240, 
            flexShrink: 0, 
            '& .MuiDrawer-paper': { 
              width: 240, 
              backgroundColor: 'rgba(128, 0, 128, 0.05)', 
              borderRight: '1px solid rgba(128, 0, 128, 0.25)',
              boxShadow: '2px 0px 8px -3px rgba(128, 0, 128, 0.4)',
            } 
          }}
        >
          <Box p={2} textAlign="center" mt={0}>
            <img src="/images/Earth.png" alt="System Logo" style={{ width: '80%' }} />
          </Box>
          <List sx={{ mt: 20 }}>
            {[
              { text: 'Dashboard', icon: <MdHome color="rgb(128, 0, 128)" />, path: '/Dashboard' },
              { text: 'Workforce Management', icon: <IoLibraryOutline color="rgb(128, 0, 128)" />, path: '/Workforce-Management' },
              { text: 'Account Management', icon: <RiUserSettingsLine color="rgb(128, 0, 128)" />, path: '/Account-Management' },
              { text: 'Employee Leaves', icon: <FaRegCalendarPlus color="rgb(128, 0, 128)" />, path: '/Employee-Leaves' },
              { text: 'Employee Self-Service', icon: <FaUserCog color="rgb(128, 0, 128)" />, path: '/Employee-Portal' },
              { text: 'Profile', icon: <IoPersonCircleOutline color="rgb(128, 0, 128)" />, path: '/Profile' },
            ].map((item, index) => (
              <ListItem
                button={true}
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  border: '1px solid rgba(128, 0, 128, 0.25)',
                  borderRight: 'none', 
                  borderRadius: '15px 0 0 15px', 
                  mx: 0, 
                  mb: 1,
                  marginLeft: '20px',
                  boxShadow: '-2px 0px 8px -3px rgba(128, 0, 128, 0.4)', 
                  paddingRight: 2,
                  cursor: 'pointer', 
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;