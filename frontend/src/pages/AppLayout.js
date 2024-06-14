import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/NavBar';
import ProjectOverview from './Projects';

function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <ProjectOverview />
      </Box>
    </Box>
  );
}

export default AppLayout;
