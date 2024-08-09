import React, { useState} from 'react';
import { Typography, Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import ProjectsIcon from '../assets/images/projects-icon.svg';
import EmployeesIcon from '../assets/images/employees-icon.svg';
import staffIcon from '../assets/images/logo-creative-tim-black.svg';
import { Link, useNavigate } from 'react-router-dom';
import SignOutIcon from '../assets/images/signout_icon.svg';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state/authSlice';
import { useLogoutMutation } from '../state/api/authApi';
import FrontendRoutes from '../utils/FrontendRoutes';
import SnackbarOptions from '../utils/SnackbarOptions';
import { useSnackbar } from 'notistack';
import EditSkills from './EditSkills';
import { Settings } from '@mui/icons-material';

function Sidebar({ setActiveItem, activeItem }) {

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  const [editSkillsOpen, setEditSkillsOpen] = useState(false);

  const handleItemClick = (itemKey) => {
    setActiveItem(itemKey); // Update activeItem in parent component
  };

  const handleSignOut = async () => {
    logoutMutation()
        .unwrap()
        .then((payload) => {
            dispatch(setLogin({loggedIn: false}))
            enqueueSnackbar("You were logged out successfully", SnackbarOptions.SUCCESS);
        })
        .catch((error) => {
            if (error.status === 'FETCH_ERROR') {
                navigate(FrontendRoutes.LOGIN);
                dispatch(setLogin({loggedIn: false}))
                enqueueSnackbar("Logout failed. Server not reachable.", SnackbarOptions.ERROR);
            }
        });
  };

  const menuItems = [
    { text: 'Projects', icon: ProjectsIcon, key: 'projects', link: '/projects' },
    { text: 'Employees', icon: EmployeesIcon, key: 'employees', link: '/employees' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#F5F7FA',
        padding: '20px',
        width: { xs: '25%', sm: '18%', md: '12%' },       
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
          width: '100%',
        }}
      >
        <img src={staffIcon} alt="Logo" style={{ marginRight: 8, height: 22, width: 22 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: '#2D3748',
            fontFamily: 'Helvetica',
            fontSize: 18,
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
            component={Link}
            to={item.link}
            selected={activeItem === item.key}
            onClick={() => handleItemClick(item.key)}
            sx={{
              mb: 1,
              borderRadius: '12px',
              color: activeItem === item.key ? '#FFFFFF' : '#4FD1C5',
              backgroundColor: activeItem === item.key ? '#FFFFFF' : 'transparent',
              '&.Mui-selected': {
                backgroundColor: '#FFFFFF',
              },
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
              minHeight: '54px',
              boxShadow: activeItem === item.key ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                mr: 1,
                bgcolor: activeItem === item.key ? '#4FD1C5' : '#FFFFFF',
                borderRadius: '12px',
                padding: '5px',
              }}
            >
              <img
                src={item.icon}
                alt={item.text}
                style={{
                  width: '20px',
                  height: '20px',
                  filter: activeItem === item.key ? 'brightness(0) invert(1)' : 'none',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  fontFamily: 'Helvetica, sans-serif',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '0',
                  lineHeight: '150%',
                  color: activeItem === item.key ? '#2D3748' : '#A0AEC0',
                }
              }}
            />
          </ListItemButton>
        ))}
      </List>
      {/* Skill Settings */}
      <Box
         sx={{ marginTop: 'auto', marginLeft: '12px', width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setEditSkillsOpen(true)}
      >
        <Settings sx={{ color: '#718096', fontSize: 24 }} />
        <Typography
          sx={{
            color: '#718096',
            fontFamily: 'Helvetica, sans-serif',
            fontWeight: 'Bold',
            fontSize: '14px',
            lineHeight: '150%',
            letterSpacing: '0',
            marginLeft: '10px',
          }}
        >
          Skill Settings
        </Typography>
      </Box>
      {/* Divider after Skill Settings */}
      <Divider sx={{ width: '100%', mt: 2 }} />
      {/* Sign Out */}
      <Box onClick={handleSignOut} sx={{ marginTop: 1.2, width: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <IconButton>
          <img src={SignOutIcon} alt="Sign Out" style={{ width: 24, height: 24 }} />
        </IconButton>
        <Typography
          sx={{ 
            color: '#718096',
            fontFamily: 'Helvetica, sans-serif',
            fontWeight: 'Bold',
            fontSize: '14px',
            lineHeight: '150%',
            letterSpacing: '0',}}
        >
          Sign Out
        </Typography>
      </Box>

      {/* EditSkills Dialog */}
      {editSkillsOpen && (
        <EditSkills
          open={editSkillsOpen}
          onClose={() => setEditSkillsOpen(false)}
        />
      )}
    </Box>
  );
}

export default Sidebar;
