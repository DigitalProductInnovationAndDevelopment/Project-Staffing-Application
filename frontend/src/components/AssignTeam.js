import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Slider } from '@mui/material';

const AssignTeam = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography
          sx={{
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '0',
            fontWeight: 'bold',
            color: '#2D3748',
            marginBottom: 1,
          }}
        >
          Staffed Profiles
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            marginTop: 1,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'space-between',
            },
            '& .MuiTab-root': {
              minWidth: 'unset',
              color: '#666666',
              padding: '1px 10px',
              letterSpacing: '0',
              '&.Mui-selected': {
                color: '#2196F3',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2196F3',
            },
          }}
        >
          <Tab label="PROJECT LEAD" />
          <Tab label="FULL-STACK DEVELOPER" />
          <Tab label="CLOUD EXPERT" />
          <Tab label="SOFTWARE TESTING" />
        </Tabs>
      </Box>
      <Box
        sx={{
          padding: 2,
          maxHeight: '80px',
          minWidth: '160px',
          borderRadius: '15px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '0',
            fontWeight: 'bold',
            color: '#2D3748',
            alignSelf: 'flex-start',
          }}
        >
          Assigned Profiles
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '14px',
            lineHeight: '140%',
            letterSpacing: '0',
            color: 'secondary.main',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
          }}
        >
          1/3
        </Typography>
        <Slider
          value={33}
          sx={{
            width: '100%',
            height: '2px',
            color: 'secondary.main',
            '& .MuiSlider-thumb': {
              display: 'none',
            },
            '& .MuiSlider-rail': {
              color: '#e2e8f0',
            },
            '& .MuiSlider-track': {
              color: 'secondary.main',
            },
            '& .Mui-disabled': {
              pointerEvents: 'none',
              cursor: 'default',
              color: 'secondary.main',
            },
          }}
          disabled
        />
      </Box>
    </Box>
  </Box>
  );
};

export default AssignTeam;