import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const hideSidebar = router.pathname === '/Login' || router.pathname === '/Register' || router.pathname === '/';

  return (
    <Box display="flex">
      {!hideSidebar && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;