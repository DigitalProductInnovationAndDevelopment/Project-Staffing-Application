import React, { useState, useEffect} from 'react';
import { Dialog, DialogContent, Tabs, Tab, Box, Avatar, Typography, Button, CircularProgress, TextField} from '@mui/material';
import Overview from './Overview';
import AssignTeam from './AssignTeam';
import backgroundImage from './../assets/images/edit_background.svg';
import OverviewIcon from './../assets/images/overview-icon.svg';
import AssignTeamIcon from './../assets/images/assign-icon.svg';
import AvatarGreen from "./../assets/images/icons/green_avatar.svg";
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../state/api/projectApi';
import { useUpdateProjectAssignmentByProfileIdMutation } from '../state/api/profileApi';
import '../style.scss';

const EditProject = ({ open, onClose, project }) => {
  const projectId  = project?.projectId;
  const [activeTab, setActiveTab] = useState(project?.tab);
  const { data: projectData, error, isLoading, refetch } = useGetProjectByIdQuery(projectId);
  const [updateProject] = useUpdateProjectMutation();
  const [assignEmployees] = useUpdateProjectAssignmentByProfileIdMutation();
  const [formData, setFormData] = useState({});
  const [formDataAssignment, setFormDataAssignment] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(project?.name);
  const [checkForAssignment, setCheckForAssignment] = useState(false); 

  useEffect(() => {
    if (projectData) {
      setFormData({
        kickoffDate: projectData.startDate,
        deadlineDate: projectData.endDates,
        priority: projectData.priority,
        projectLocation: projectData.location,
        projectName: projectData.projectName, 
      });
    }
    setActiveTab(project?.tab);
  }, [projectData, project?.tab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFormDataChangeAssignment = (newData) => {
    setFormDataAssignment((prevData) => ({ ...prevData, ...newData }));
    setCheckForAssignment(true); 
  };

  const handleSaveAndClose = async () => {
    try {
      await updateProject({ projectId: projectId, patchData: formData });
      if(checkForAssignment) await assignEmployees({ projectId: projectId, patchData: formDataAssignment });
      refetch();
      onClose();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleProjectNameClick = () => {
    setIsEditing(true);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleProjectNameBlur = () => {
    setIsEditing(false);
    setFormData((prevData) => ({ ...prevData, projectName: projectName }));
  };


  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
   return <Typography color="error">Error fetching user: {error.message}</Typography>;
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Box sx={{ backgroundColor: '#F8F9FA', padding: 2}}>
        <Box
          sx={{
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '100%',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              color: 'white',
              borderRadius: '15px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Helvetica, sans-serif',
                fontSize: 12,
                lineHeight: '150%',
                letterSpacing: 0,
                mb: 1, mt: 2, ml: 2,
              }}
            >
              Start / Projects / Edit Project
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Helvetica, sans-serif !important',
                fontWeight: 'bold',
                fontSize: 14,
                lineHeight: '140%',
                letterSpacing: 0,
                mb: 15, ml: 2,
              }}
            >
              Edit Project
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.90)',
              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
              marginTop: '-56px',
              ml: 2, mr: 2,
              padding: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt={project?.name} src={AvatarGreen} sx={{ width: 78, height: 78, borderRadius: '15px', overflow: 'hidden', mr: 2 }} />
              <Box>
                {isEditing ? (
                  <TextField
                    value={projectName}
                    onChange={handleProjectNameChange}
                    onBlur={handleProjectNameBlur}
                    autoFocus
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Helvetica, sans-serif',
                        fontSize: '18px',
                        lineHeight: '140%',
                        fontWeight: 'bold',
                        color: '#2D3748',
                      },
                    }}
                  />
                ) : (
                  <Typography
                    onClick={handleProjectNameClick}
                    sx={{
                      fontFamily: 'Helvetica, sans-serif',
                      fontSize: '18px',
                      lineHeight: '140%',
                      letterSpacing: '0',
                      fontWeight: 'bold',
                      color: '#2D3748',
                      cursor: 'pointer',
                    }}
                  >
                    {projectName}
                  </Typography>
                )}
                <Typography
                  sx={{
                    fontFamily: 'Helvetica, sans-serif',
                    fontSize: '14px',
                    lineHeight: '140%',
                    letterSpacing: '0',
                    color: '#718096',
                  }}
                >
                  {project?.company}
                </Typography>
              </Box>
            </Box>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ '& .MuiTabs-indicator': { backgroundColor: 'transparent' }, mt: '6px'}}>
              <Tab
              icon={<img src={OverviewIcon} alt="Overview" />}
              label={<Typography sx={{
                fontFamily: 'Helvetica, sans-serif',
                color: '#2D3748',
                fontWeight: 'bold',
                fontSize: '10px',
                lineHeight: '150%',
                letterSpacing: '0', 
                ml: '3px'
              }}>OVERVIEW</Typography>}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                backgroundColor: activeTab === 0 ? '#fff' : 'transparent',
                boxShadow: activeTab === 0 ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                minHeight: '10px',
                '& .MuiTab-iconWrapper': { marginBottom: 0 },
              }}
              />
              <Tab
              icon={<img src={AssignTeamIcon} alt="Assign Team" />}
              label={<Typography sx={{
                fontFamily: 'Helvetica, sans-serif',
                color: '#2D3748',
                fontWeight: 'bold',
                fontSize: '10px',
                lineHeight: '150%',
                letterSpacing: '0', 
                ml: '3px'
              }}>ASSIGN TEAM</Typography>}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                backgroundColor: activeTab === 1 ? '#fff' : 'transparent',
                boxShadow: activeTab === 1 ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                minHeight: '10px',
                '& .MuiTab-iconWrapper': { marginBottom: 0 },
              }}
              />
            </Tabs>
          </Box>
          <DialogContent>
            {activeTab === 0 && <Overview project={projectData} onFormDataChange={handleFormDataChange}/>}
            {activeTab === 1 && <AssignTeam project={projectData} onFormDataChange={handleFormDataChangeAssignment}/>}
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
            <Button 
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                color: 'white',
                height: '40px',
                fontFamily: 'Halvetica, sans-serif',
                fontWeight: 'Bold',
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0',
                width: '120px',
                padding: 0,
                marginRight: 2,
              }}
              onClick={handleSaveAndClose}
            >
              Save & Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProject;