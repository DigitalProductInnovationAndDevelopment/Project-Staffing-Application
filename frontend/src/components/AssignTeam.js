import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Slider, Avatar, Button } from '@mui/material';
import EditProfile from './EditProfile';
import addIcon from './../assets/images/add-icon.svg';
import removeIcon from './../assets/images/remove-icon.svg';
import AvatarEx4 from './../assets/images/icons/avatar_ex4.svg';
import AvatarGreen from './../assets/images/icons/green_avatar.svg';
import AvatarBlue from './../assets/images/icons/blue_avatar.svg';
import AvatarDB from './../assets/images/icons/dblue_avatar.svg';
import AvatarPurple from './../assets/images/icons/purple_avatar.svg';

const skillsets = {
  'PROJECT LEAD': [
    { skill: 'Technology', points: '5/20' },
    { skill: 'Solution Engineering', points: '7/15' },
    { skill: 'Self-Management', points: '5/12' },
    { skill: 'Communication Skills', points: '10/13' },
    { skill: 'Employee Leadership', points: '9/10' },
  ],
  'FULL-STACK DEVELOPER': [
    { skill: 'Technology', points: '18/20' },
    { skill: 'Solution Engineering', points: '12/15' },
    { skill: 'Self-Management', points: '8/12' },
    { skill: 'Communication Skills', points: '5/13' },
    { skill: 'Employee Leadership', points: '3/10' },
  ],
  'CLOUD EXPERT': [
    { skill: 'Technology', points: '19/20' },
    { skill: 'Solution Engineering', points: '9/15' },
    { skill: 'Self-Management', points: '8/12' },
    { skill: 'Communication Skills', points: '7/13' },
    { skill: 'Employee Leadership', points: '3/10' },
  ],
  'SOFTWARE TESTING': [
    { skill: 'Technology', points: '17/20' },
    { skill: 'Solution Engineering', points: '14/15' },
    { skill: 'Self-Management', points: '5/12' },
    { skill: 'Communication Skills', points: '2/13' },
    { skill: 'Employee Leadership', points: '2/10' },
  ],
};

const employees = [
  {
    name: 'Peter Drucker',
    email: 'drucker@itestra.com',
    avatar: AvatarEx4,
    skills: [
      { skill: 'Technology', points: '9/10' },
      { skill: 'Solution Engineering', points: '10/10' },
      { skill: 'Self-Management', points: '9/10' },
      { skill: 'Communication Skills', points: '6/10' },
      { skill: 'Employee Leadership', points: '9/10' },
    ],
  },
  {
    name: 'Andrej Karpathy',
    email: 'karpathy@itestra.com',
    avatar: AvatarDB,
    skills: [
      { skill: 'Technology', points: '8/10' },
      { skill: 'Solution Engineering', points: '10/10' },
      { skill: 'Self-Management', points: '7/10' },
      { skill: 'Communication Skills', points: '2/10' },
      { skill: 'Employee Leadership', points: '5/10' },
    ],
  },
  {
    name: 'Kales Urany',
    email: 'kurany@itestra.com',
    avatar: AvatarPurple,
    skills: [
      { skill: 'Technology', points: '5/10' },
      { skill: 'Solution Engineering', points: '4/10' },
      { skill: 'Self-Management', points: '6/10' },
      { skill: 'Communication Skills', points: '6/10' },
      { skill: 'Employee Leadership', points: '8/10' },
    ],
  },
  {
    name: 'Andrew Ng',
    email: 'andrew@itestra.com',
    avatar: AvatarBlue,
    skills: [
      { skill: 'Technology', points: '1/10' },
      { skill: 'Solution Engineering', points: '10/10' },
      { skill: 'Self-Management', points: '2/10' },
      { skill: 'Communication Skills', points: '5/10' },
      { skill: 'Employee Leadership', points: '6/10' },
    ],
  },
  {
    name: 'Paul Paulsen',
    email: 'paulsen@itestra.com',
    avatar: AvatarGreen,
    skills: [
      { skill: 'Technology', points: '6/10' },
      { skill: 'Solution Engineering', points: '1/10' },
      { skill: 'Self-Management', points: '6/10' },
      { skill: 'Communication Skills', points: '9/10' },
      { skill: 'Employee Leadership', points: '4/10' },
    ],
  },
];

const AssignTeam = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  const [assigned, setAssigned] = useState({
    'PROJECT LEAD': [],
    'FULL-STACK DEVELOPER': [],
    'CLOUD EXPERT': [],
    'SOFTWARE TESTING': [],
  });
 
  const totalSlots = {
    'PROJECT LEAD': 1,
    'FULL-STACK DEVELOPER': 3,
    'CLOUD EXPERT': 1,
    'SOFTWARE TESTING': 0,
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenEmployeeDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };
  const handleCloseEditDialog = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleOnBack = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAssign = (employee) => {
    const role = tabLabels[activeTab];
    setAssigned({
      ...assigned,
      [role]: [...assigned[role], employee],
    });
  };

  const handleRemove = (employee) => {
    const role = tabLabels[activeTab];
    setAssigned({
      ...assigned,
      [role]: assigned[role].filter((e) => e.email !== employee.email),
    });
  };

  const getColor = (employeeSkillPoints, targetSkillPoints) => {
    const employeePoints = parseInt(employeeSkillPoints.split('/')[0]);
    const targetPoints = parseInt(targetSkillPoints.split('/')[1]);
    const third = targetPoints / 3;

    if (employeePoints < third) {
      //red
      return '#D32F2F';
    } else if (employeePoints < 2 * third) {
      //yellow
      return '#ECB22E';
    } else {
      //green
      return '#2E7D32';
    }
  };

  const getFilteredEmployees = () => {
    const role = tabLabels[activeTab];
    const assignedEmails = assigned[role].map(e => e.email);
  
    return employees.filter((employee) =>
      !assignedEmails.includes(employee.email) &&
      currentSkillsets.every((skillset) =>
        employee.skills.some((skill) => skill.skill === skillset.skill)
      )
    );
  };

  const tabLabels = Object.keys(skillsets);
  const currentSkillsets = skillsets[tabLabels[activeTab]];
  const assignedCount = assigned[tabLabels[activeTab]].length;
  const totalSlotsForRole = totalSlots[tabLabels[activeTab]];
  const sliderValue = (assignedCount / totalSlotsForRole) * 100;

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
          {assigned[tabLabels[activeTab]].length}/{totalSlots[tabLabels[activeTab]]}
        </Typography>
        <Slider
          value={sliderValue}
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
        key={activeTab}
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

      <Box>
      <Box sx={{ marginTop: 4}}>
        <Typography sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBottom: 2 }}>
          Assigned {tabLabels[activeTab]}s ({assigned[tabLabels[activeTab]].length})
        </Typography>
        {assigned[tabLabels[activeTab]].map((employee) => (
          <Box key={employee.email} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, borderBottom: '1px solid #E2E8F0', paddingBottom: 1 }}>
            <Avatar src={employee.avatar} sx={{ marginRight: 2, borderRadius: '15px', overflow: 'hidden'}}>{employee.name[0]}</Avatar>
            <Box  sx={{ flex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: '30px'}}>
              <Typography
                sx={{fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBlock: '0'}}
              >{employee.name}</Typography>
              <Typography
                sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', color: '#718096', marginBlock: '0'}}
              >{employee.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              {currentSkillsets.map((skillset) => {
                const employeeSkill = employee.skills.find((s) => s.skill === skillset.skill);
                const color = employeeSkill ? getColor(employeeSkill.points, skillset.points) : 'grey';

                return (
                  <Typography
                    key={skillset.skill}
                    sx={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '13px',
                      lineHeight: '18px',
                      letterSpacing: '0.16px',
                      color: 'black',
                      backgroundColor: `${color}20`,
                      border: `1px solid ${color}`,
                      borderRadius: '100px',
                      padding: '4px 8px',
                      textAlign: 'center',
                      margin: '0 4px 4px 0',
                      display: 'inline-block',
                    }}
                  >
                    {skillset.skill}
                  </Typography>
                );
              })}
            </Box>
            <Button
              sx={{
                marginLeft: '16px',
                bgcolor: '#2196F3',
                color: 'white',
                borderRadius: '100px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                lineHeight: '24px',
                letterSpacing: '0.4px',
                padding: '6px 14px',
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                '&:hover': {
                  bgcolor: '#2D82C5',
                },
              }}
              onClick={() => handleOpenEmployeeDialog(employee)}
            >
              See Details
            </Button>

            <img
              onClick={() => handleRemove(employee)}
              src={removeIcon}
              alt="Remove"
              style={{
                marginLeft: '40px',
                marginRight: '30px',
                cursor: 'pointer',
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ marginTop: 3}}>
        <Typography sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBottom: 2 }}>
          Suitable Employees
        </Typography>
        {getFilteredEmployees().map((employee) => (
          <Box key={employee.email} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, borderBottom: '1px solid #E2E8F0', paddingBottom: 1 }}>
            <Avatar src={employee.avatar} sx={{ marginRight: 2, borderRadius: '15px', overflow: 'hidden'}}>{employee.name[0]}</Avatar>
            <Box sx={{ flex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: '30px' }}>
              <Typography
               sx={{fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBlock: '0'}}
              >{employee.name}</Typography>
              <Typography
                sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', color: '#718096', marginBlock: '0'}}
              >{employee.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              {currentSkillsets.map((skillset) => {
                const employeeSkill = employee.skills.find((s) => s.skill === skillset.skill);
                const color = employeeSkill ? getColor(employeeSkill.points, skillset.points) : 'grey';

                return (
                  <Typography
                    key={skillset.skill}
                    sx={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '13px',
                      lineHeight: '18px',
                      letterSpacing: '0.16px',
                      color: 'black',
                      backgroundColor: `${color}20`,
                      border: `1px solid ${color}`,
                      borderRadius: '100px',
                      padding: '4px 8px',
                      textAlign: 'center',
                      margin: '0 4px 4px 0',
                      display: 'inline-block',
                    }}
                  >
                    {skillset.skill}
                  </Typography>
                );
              })}
            </Box>

            <Button
              sx={{
                marginLeft: '16px',
                bgcolor: '#2196F3',
                color: 'white',
                borderRadius: '100px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                lineHeight: '24px',
                letterSpacing: '0.4px',
                padding: '6px 14px',
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                '&:hover': {
                  bgcolor: '#2D82C5',
                },
              }}
              onClick={() => handleOpenEmployeeDialog(employee)}
            >
              See Details
            </Button>

            <Button
              sx={{
                marginLeft: '10px',
                bgcolor: '#2196F3',
                color: 'white',
                borderRadius: '100px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                lineHeight: '24px',
                letterSpacing: '0.4px',
                padding: '6px 14px',
                boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                '&:hover': {
                  bgcolor: '#2D82C5',
                },
                '&:disabled': {
                  bgcolor: '#2D82C5',
                  color: 'white', 
                },
              }}
              onClick={() => handleAssign(employee)}
              disabled={assigned[tabLabels[activeTab]].some((e) => e.email === employee.email)}
            >
              Add <img src={addIcon} alt="Add" style={{ marginLeft: '8px' }} />
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
    {selectedEmployee && (
      <EditProfile open={open} onClose={handleCloseEditDialog} onBack={handleOnBack}
        employee={{ name: selectedEmployee.name, email: selectedEmployee.email, image: selectedEmployee.avatar }} 
        source="AssignTeam"
      />
    )}
  </Box>
  );
};

export default AssignTeam;