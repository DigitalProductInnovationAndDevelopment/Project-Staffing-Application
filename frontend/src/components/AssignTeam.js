import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Slider, Avatar, Button, Badge} from '@mui/material';
import EditProfile from './EditProfile';
import addIcon from './../assets/images/add-icon.svg';
import removeIcon from './../assets/images/remove-icon.svg';
import AvatarBlue from './../assets/images/icons/blue_avatar.svg';
import GreenUp from './../assets/images/assign/green_up_vector.svg';
import YellowUp from './../assets/images/assign/yellow_up_vector.svg';
import RedUp from './../assets/images/assign/red_up_vector.svg';
import GreenEq from './../assets/images/assign/green_eq_vector.svg';
import YellowEq from './../assets/images/assign/yellow_eq_vector.svg';
import RedEq from './../assets/images/assign/red_eq_vector.svg';
import GreyEq from './../assets/images/assign/grey_eq_vector.svg';
import TargetIcon from './../assets/images/assign/target_vector.svg';
import { useGetProjectAssignmentByProfileIdQuery} from '../state/api/profileApi';

const AssignTeam = ({ project, onFormDataChange }) => {
  
  const {data: allDataForAssignment, refetch} = useGetProjectAssignmentByProfileIdQuery({projectId: project._id});

  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tabLabelsFor, setTabLabelsFor] = useState([]);
  const [formData, setFormData] = useState([]);
  const [assignedFor, setAssignedFor] = useState();
  const [suitableEmployees, setSuitableEmployees] = useState();
  const [currentSkillsetsFor, setCurrentSkillsetsFor] = useState([]);
  const [sliderValueFor, setSliderValueFor] = useState(0);
  const [totalSlotsFor, setTotalSlotsFor] = useState(0);
  const [assignedNum, setAssignedNum] = useState(0);

  // Initialize state from the fetched data
  useEffect(() => {
    refetch();

    if (allDataForAssignment) {
      const tabs = allDataForAssignment.data.map(profileData => ({
        profileId: profileData.profile._id,
        name: profileData.profile.name,
        assignedEmployees: profileData.assignedEmployees,
        suitableEmployees: profileData.suitableEmployees,
        targetSkills: profileData.profile.targetSkills,
        demand: profileData.profile.targetDemandId.now,
      }));
      setFormData(tabs);

      const tabLabels = tabs.map(tab => tab.name);
      setTabLabelsFor(tabLabels);

      if (tabs.length > 0) {
        const initialAssigned = tabs[0].assignedEmployees || [];
        const initialSuitable = tabs[0].suitableEmployees || [];
        setAssignedFor(initialAssigned);
        setSuitableEmployees(initialSuitable);
        setCurrentSkillsetsFor(tabs[0].targetSkills);
        setTotalSlotsFor(tabs[0].demand);
        setAssignedNum(initialAssigned.length);
        setSliderValueFor((initialAssigned.length / tabs[0].demand) * 100);
      }
    }
  }, [allDataForAssignment, refetch]);

  // Update state when activeTab changes
  useEffect(() => {
    if (formData.length > 0) {
      const currentProfile = formData[activeTab];
      setCurrentSkillsetsFor(currentProfile.targetSkills);
      setAssignedFor(currentProfile.assignedEmployees);
      setSuitableEmployees(currentProfile.suitableEmployees);
      setTotalSlotsFor(currentProfile.demand);
      setAssignedNum(currentProfile.assignedEmployees.length);
      setSliderValueFor((currentProfile.assignedEmployees.length / currentProfile.demand) * 100);
    }
  }, [activeTab, formData]);
 
  useEffect(() => {
    const formattedData = formData.map(profile => ({
      profileId: profile.profileId,
      assignedEmployees: profile.assignedEmployees.map(employee => employee._id),
    }));
    onFormDataChange(formattedData);
  }, [formData, onFormDataChange]);

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
    const updatedAssignedFor = [...assignedFor, employee];
    const updatedSuitableEmployees = suitableEmployees.filter((e) => e.email !== employee.email);

    setAssignedFor(updatedAssignedFor);
    setSuitableEmployees(updatedSuitableEmployees);
    setAssignedNum(updatedAssignedFor.length);
    setSliderValueFor((updatedAssignedFor.length / totalSlotsFor) * 100);

    const updatedFormData = [...formData];
    updatedFormData[activeTab].assignedEmployees = updatedAssignedFor;
    updatedFormData[activeTab].suitableEmployees = updatedSuitableEmployees;
    setFormData(updatedFormData);
  };

  const handleRemove = (employee) => {
    const updatedAssignedFor = assignedFor.filter((e) => e.email !== employee.email);
    const updatedSuitableEmployees = [...suitableEmployees, employee];

    setAssignedFor(updatedAssignedFor);
    setSuitableEmployees(updatedSuitableEmployees);
    setAssignedNum(updatedAssignedFor.length);
    setSliderValueFor((updatedAssignedFor.length / totalSlotsFor) * 100);

    const updatedFormData = [...formData];
    updatedFormData[activeTab].assignedEmployees = updatedAssignedFor;
    updatedFormData[activeTab].suitableEmployees = updatedSuitableEmployees;
    setFormData(updatedFormData);
  };
  
  const getColor = (employeePoints, targetPoints) => {
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

  const getTargetIcon = (employeePoints, targetPoints, delta) => {
    const third = targetPoints / 3;

    if (employeePoints < third) {
      //red
      if(delta > 0) return RedUp;
      else return RedEq;
    } else if (employeePoints < 2 * third) {
      //yellow
      if(delta > 0) return YellowUp;
      else return YellowEq;
    } else {
      //green
      if(delta > 0) return GreenUp;
      else return GreenEq;
    }
  };

  const getCategory = (category) => {
    if(category  === 'TECHNOLOGY') return 'Technology';
    else if (category  === 'SOLUTION_ENGINEERING') return 'Solution Engineering';
    else if (category  === 'COMMUNICATION_SKILLS') return 'Communication Skills';
    else if (category  === 'SELF_MANAGEMENT') return 'Self Management';
    else if (category  === 'EMPLOYEE_LEADERSHIP') return 'Employee Leadership';
    else return category
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
        {tabLabelsFor.map((label, index) => (
          <Tab
            key={label}
            label={
                formData[index]?.demand - formData[index]?.assignedEmployees.length > 0 ? (
             <Badge
                badgeContent={formData[index]?.demand - formData[index]?.assignedEmployees.length || 0}
                color="profBlue"
                anchorOrigin={{
                   vertical: 'top',
                   horizontal: 'right',
                }}
                sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#4FD1C5',
                      color: 'white',
                      fontSize: '12px',
                      height: '20px',
                      minWidth: '20px',
                      borderRadius: '10px',
                      padding: '0 6px',
                      transform: 'translate(50%, -75%)',
                    },
                }}
             >
                {label}
             </Badge>
             ) : (
                label
             )
            }
         />
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
          Assigned for Profile
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
          {assignedNum}/{totalSlotsFor}
        </Typography>
        <Slider
          value={sliderValueFor}
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
          gridTemplateColumns: `repeat(${currentSkillsetsFor.length + 1}, auto)`,
          maxWidth: '1072px',
          overflowX: 'auto',
          gap: 1
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
        {currentSkillsetsFor.map((skillset) => (
          <Box key={skillset.skillCategory} sx={{ display: 'flex'}}>
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
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <img src={TargetIcon} alt="Target" style={{ marginLeft:'2px', marginRight: '6px'}}/>
              {getCategory(skillset.skillCategory)}
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
        {currentSkillsetsFor.map((skillset) => (
          <Box key={skillset.skillCategory} sx={{ display: 'inline-block' }}>
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
                margin: '0',
                display: 'inline-block',
              }}
            >
              {skillset.skillPoints}/{skillset.maxSkillPoints}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box 
        sx={{
          display: 'grid',
          maxWidth: '2002px',
          overflowX: 'auto',
        }}
      >
      <Box sx={{ marginTop: 4}}>
        <Typography sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBottom: 2 }}>
          Assigned {tabLabelsFor[activeTab]}s ({assignedNum})
        </Typography>
        {assignedFor && assignedFor.length > 0 ?  ( assignedFor.map((employee) => (
          <Box key={employee._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, borderBottom: '1px solid #E2E8F0', paddingBottom: 1 }}>
            <Avatar onClick={() => handleOpenEmployeeDialog(employee)} 
              src={AvatarBlue} sx={{ cursor: 'pointer', marginRight: 2, borderRadius: '15px', overflow: 'hidden'}}
            >
                {employee.firstName[0]}
            </Avatar>
            <Box  sx={{ flex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: '30px'}}>
              <Typography
                onClick={() => handleOpenEmployeeDialog(employee)}
                sx={{fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBlock: '0', cursor: 'pointer'}}
              >{employee.firstName} {employee.lastName}</Typography>
              <Typography
                onClick={() => handleOpenEmployeeDialog(employee)}
                sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', color: '#718096', marginBlock: '0', cursor: 'pointer'}}
              >{employee.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              {currentSkillsetsFor.map((skillset) => {
                const employeeSkill = employee.skills.find((s) => s.skillCategory === skillset.skillCategory);
                const color = employeeSkill ? getColor(employeeSkill.skillPoints, skillset.skillPoints) : 'grey';
                const targetIcon = employeeSkill ? getTargetIcon(employeeSkill.skillPoints, skillset.skillPoints, employeeSkill.delta) : GreyEq;

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
                      margin: '0 4px 4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    
                    }}
                  >
                    <img src={targetIcon} alt="Target" style={{ marginLeft:'2px', marginRight: '6px'}}/>
                    {getCategory(skillset.skillCategory)}
                  </Typography>
                );
              })}
            </Box>

            <img
              onClick={() => handleRemove(employee)}
              src={removeIcon}
              alt="Remove"
              style={{
                marginLeft: '10px',
                cursor: 'pointer',
              }}
            />
          </Box>
        ))) : (
          <Typography variant="body2" color="textSecondary">
            Assignment for the profile not yet started.
          </Typography>
        )}
      </Box>

      <Box sx={{ marginTop: 3}}>
        <Typography sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '18px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBottom: 2 }}>
          Suitable Employees
        </Typography>
        { suitableEmployees && suitableEmployees.length > 0 ?  ( suitableEmployees.map((employee) => (
          <Box key={employee.email} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, borderBottom: '1px solid #E2E8F0', paddingBottom: 1 }}>
            <Avatar onClick={() => handleOpenEmployeeDialog(employee)}
              src={AvatarBlue} sx={{ cursor: 'pointer', marginRight: 2, borderRadius: '15px', overflow: 'hidden'}}
            >
                {employee.firstName[0]}
            </Avatar>
            <Box sx={{ flex: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: '30px' }}>
              <Typography
               onClick={() => handleOpenEmployeeDialog(employee)}
               sx={{fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', fontWeight: 'bold', color: '#2D3748', marginBlock: '0', cursor: 'pointer'}}
              >{employee.firstName} {employee.lastName} </Typography>
              <Typography
                onClick={() => handleOpenEmployeeDialog(employee)}
                sx={{ fontFamily: 'Helvetica, sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0', color: '#718096', marginBlock: '0', cursor: 'pointer'}}
              >{employee.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              {currentSkillsetsFor.map((skillset) => {
                const employeeSkill = employee.skills.find((s) => s.skillCategory === skillset.skillCategory);
                const color = employeeSkill ? getColor(employeeSkill.skillPoints, skillset.skillPoints) : 'grey';
                const targetIcon = employeeSkill ? getTargetIcon(employeeSkill.skillPoints, skillset.skillPoints, employeeSkill.delta) : GreyEq;

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
                      margin: '0 4px 4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <img src={targetIcon} alt="Target" style={{ marginLeft:'2px', marginRight: '6px'}}/>
                    {getCategory(skillset.skillCategory)}
                  </Typography>
                );
              })}
            </Box>

            <Button
              sx={{
                marginLeft: '10px',
                bgcolor: '#2196F3',
                minWidth: 'unset',
                color: 'white',
                borderRadius: '100px',
                fontFamily: 'Roboto, sans-serif',
                padding: '6px 7px',
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
              disabled={assignedNum === totalSlotsFor}
            >
              <img src={addIcon} alt="Add" />
            </Button>
          </Box>
        ))) : (
          <Typography variant="body2" color="textSecondary">
            No Suitable employees available for this profile.
          </Typography>
        )}
      </Box>
    </Box>
    {selectedEmployee && (
      <EditProfile open={open} onClose={handleCloseEditDialog} onBack={handleOnBack}
        employee={{ userId: selectedEmployee._id }} 
        source="AssignTeam"
      />
    )}
  </Box>
  );
};

export default AssignTeam;