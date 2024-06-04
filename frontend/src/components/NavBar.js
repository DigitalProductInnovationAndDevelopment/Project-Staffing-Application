import React, { useState } from 'react';
import { Typography, Box, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ProjectsIcon from '../assets/images/projects-icon.svg'; // Adjust path
import EmployeesIcon from '../assets/images/employees-icon.svg'; // Adjust path
import staffIcon from '../assets/images/logo-creative-tim-black.svg'; // Adjust path

function Sidebar() {
  const [activeItem, setActiveItem] = useState(null);

  const menuItems = [
    { text: 'Projects', icon: ProjectsIcon, key: 'projects' },
    { text: 'Employees', icon: EmployeesIcon, key: 'employees' },
  ];

  return (
    <Box 
        sx={{ 
            bgcolor: '#f0f0f0', 
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
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '10px', 
                borderRadius: '5px',
                width: '100%'
            }}
        >
            <img src={staffIcon} alt="Logo" />
            <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                    ml: 2,
                    color: '#2D3748',
                    fontFamily: 'Helvetica',
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: '150%',
                    textAlign: 'center'
                }}
            >
                Great Staff
            </Typography>
        </Box>
        <Divider sx={{ width: '100%', mb: 2 }} />
        <List sx={{ width: '100%' }}>
        {menuItems.map((item, index) => (
            <ListItemButton
                key={index}
                selected={activeItem === index}
                onClick={() => setActiveItem(index)}
                sx={{
                    mb: 1,
                    borderRadius: '12px',
                    color: activeItem === index ? '#2D3748' : '#A0AEC0',
                    bgcolor: activeItem === index ? 'white' : 'transparent',
                    '&:hover': {
                        bgcolor: '#e0e0e0',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <ListItemIcon 
                    sx={{ 
                        minWidth: 'auto', 
                        mr: 1,
                        bgcolor: activeItem === index ? '#4FD1C5' : 'transparent',
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
                            filter: activeItem === index ? 'brightness(0) invert(1)' : 'none'
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
