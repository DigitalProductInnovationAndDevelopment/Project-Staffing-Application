import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Slider } from '@mui/material';

const skillsets = {
  'PROJECT LEAD': [
    { skill: 'Technology', points: '5/10' },
    { skill: 'Solution Engineering', points: '8/10' },
    { skill: 'Self-Management', points: '7/10' },
    { skill: 'Communication Skills', points: '6/10' },
    { skill: 'Employee Leadership', points: '9/10' },
  ],
  'FULL-STACK DEVELOPER': [
    { skill: 'Frontend Development', points: '8/10' },
    { skill: 'Backend Development', points: '7/10' },
    { skill: 'Database Management', points: '6/10' },
    { skill: 'DevOps', points: '5/10' },
    { skill: 'Problem Solving', points: '9/10' },
  ],
  'CLOUD EXPERT': [
    { skill: 'Cloud Architecture', points: '9/10' },
    { skill: 'Security', points: '8/10' },
    { skill: 'Networking', points: '7/10' },
    { skill: 'Cost Management', points: '6/10' },
    { skill: 'Automation', points: '7/10' },
  ],
  'SOFTWARE TESTING': [
    { skill: 'Test Automation', points: '8/10' },
    { skill: 'Manual Testing', points: '7/10' },
    { skill: 'Performance Testing', points: '6/10' },
    { skill: 'Security Testing', points: '5/10' },
    { skill: 'Bug Reporting', points: '9/10' },
  ],
};

const AssignTeam = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabLabels = Object.keys(skillsets);
  const currentSkillsets = skillsets[tabLabels[activeTab]];

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
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
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

    <Box
        sx={{
          marginTop: 3,
          padding: 3,
          borderRadius: '15px',
          backgroundColor: 'white',
          boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
          display: 'grid',
          gridTemplateColumns: `repeat(${currentSkillsets.length + 1}, auto)`,
          gap: 1,
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
            marginRight: 2,
            alignSelf: 'center',
          }}
        >
          Target Skillsets
        </Typography>
        {currentSkillsets.map((skillset) => (
          <Box key={skillset.skill} sx={{ display: 'inline-block' }}>
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '13px',
                lineHeight: '18px',
                letterSpacing: '0.16px',
                color: 'black',
                backgroundColor: '#bdbdbd20',
                border: '1px solid #BDBDBD',
                borderRadius: '100px',
                padding: '4px 8px',
                textAlign: 'center',
                margin: '0',
                display: 'inline-block',
              }}
            >
              {skillset.skill}
            </Typography>
          </Box>
        ))}
        <Typography
          sx={{
            fontFamily: 'Helvetica, sans-serif',
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '0',
            fontWeight: 'bold',
            color: '#AEAEAE',
            marginRight: 2,
            alignSelf: 'center',
          }}
        >
          Target Points
        </Typography>
        {currentSkillsets.map((skillset) => (
          <Box key={skillset.points} sx={{ display: 'inline-block' }}>
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '13px',
                lineHeight: '18px',
                letterSpacing: '0.16px',
                color: '#718096',
                backgroundColor: 'white',
                border: '1px solid #BDBDBD',
                borderRadius: '100px',
                padding: '4px 8px',
                textAlign: 'center',
                margin: '0',
                display: 'inline-block',
              }}
            >
              {skillset.points}
            </Typography>
          </Box>
        ))}
      </Box>
  </Box>
  );
};

export default AssignTeam;