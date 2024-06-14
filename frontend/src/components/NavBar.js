import React, { useState } from 'react';
import { Typography, Box, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ProjectsIcon from '../assets/images/projects-icon.svg';
import EmployeesIcon from '../assets/images/employees-icon.svg';
import staffIcon from '../assets/images/logo-creative-tim-black.svg';

function Sidebar() {
  const [activeItem, setActiveItem] = useState('projects');

  const menuItems = [
    { text: 'Projects', icon: ProjectsIcon, key: 'projects' },
    { text: 'Employees', icon: EmployeesIcon, key: 'employees' },
  ];

  return (
    <Box 
      sx={{ 
        bgcolor: '#F8F9FA', 
        minHeight: '100vh', 
        padding: '20px', 
        width: { xs: '25%', sm: '18%', md: '12%' }, 
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box 
        sx={{ 
          marginBottom: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          padding: '10px', 
          borderRadius: '5px',
          width: '100%'
        }}
      >
        <img src={staffIcon} alt="Logo" style={{ marginRight: 8, height: 22, width: 22 }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: '#2D3748',
            fontFamily: 'Helvetica',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          GREAT STAFF
        </Typography>
      </Box>
      <Divider sx={{ width: '100%', mb: 2 }} />
      <List sx={{ width: '100%' }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            selected={activeItem === item.key}
            onClick={() => setActiveItem(item.key)}
            sx={{
              mb: 1,
              borderRadius: '12px',
              color: activeItem === item.key ? '#FFFFFF' : '#4FD1C5',
              bgcolor: activeItem === item.key ? '#4FD1C5' : 'transparent',
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 'auto', 
                mr: 1,
                bgcolor: activeItem === item.key ? '#4FD1C5' : '#FFFFFF', 
                borderRadius: '12px',
                padding: '5px'
              }}
            >
              <img 
                src={item.icon} 
                alt={item.text} 
                style={{ 
                  width: '20px', 
                  height: '20px',
                  filter: activeItem === item.key ? 'brightness(0) invert(1)' : 'none' 
                }} 
              />
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: '#2D3748',
                fontFamily: 'Helvetica',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
              }} 
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
