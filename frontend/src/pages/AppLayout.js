import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/NavBar';
import ProjectOverview from './Projects';
import Employees from './Employees';

function AppLayout({ activeItem, setActiveItem }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <Box sx={{ flexGrow: 1 }}>
        {/* Render different components based on activeItem */}
        {activeItem === 'projects' && <ProjectOverview />}
        {activeItem === 'employees' && <Employees />}
      </Box>
    </Box>
  );
}

export default AppLayout;
