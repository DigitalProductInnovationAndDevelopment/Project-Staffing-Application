import React, { useState, useEffect} from 'react';
import { Dialog, DialogContent, Box, Avatar, Typography, Button, TextField} from '@mui/material';
import Overview from './Overview';
import backgroundImage from './../../../assets/images/edit_background.svg';
import AvatarGreen from "./../../../assets/images/icons/green_avatar.svg";
import { useCreateProjectMutation } from '../../../state/api/projectApi';
import { useCreateProfileForProjectMutation } from '../../../state/api/profileApi';
import '../../../style.scss';

const CreateProject = ({ openCreate, onCloseCreate, onBackCreate }) => {

  const [createProject] = useCreateProjectMutation();
  const [formData, setFormData] = useState({});
  const [formDataProfiles, setFormDataProfiles] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState('Click & Enter Project Name');
  const [createProfile] = useCreateProfileForProjectMutation();

  useEffect(() => {
      setFormData({
        kickoffDate: new Date(),
        deadlineDate: new Date(),
        priority: '',
        projectLocation: '',
      });
      setFormDataProfiles({
        profiles: [],
      }); 
  }, []);

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const handleFormDataChangeProfiles = (newData) => {
    setFormDataProfiles((prevData) => ({ ...prevData, ...newData }));
  };

  const handleCreateAndClose = async () => {
    const updatedProfiles = formDataProfiles.profiles.map(({ id, ...rest }) => rest);
    console.log('formdata profiles: ', updatedProfiles)

    try {
      const response = await createProject(formData);
      console.log('response: ', response)
      const projectId = response.data.data._id;
      console.log('data id: ', projectId)

      if(projectId) await createProfile({projectId: projectId, payload: updatedProfiles.profiles});

      setProjectName('Click & Enter Project Name');
      onCloseCreate();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleProjectNameClick = () => {
    setProjectName('')
    setIsEditingName(true);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleProjectNameBlur = () => {
    setIsEditingName(false);
    if(!projectName) setProjectName('Click & Enter Project Name');
    else setFormData((prevData) => ({ ...prevData, projectName: projectName }));
  };

  return (
    <Dialog open={openCreate} onClose={onCloseCreate} fullWidth maxWidth="lg">
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
              Start / Projects / Create Project
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
              Create Project
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
              <Avatar alt={projectName} src={AvatarGreen} sx={{ width: 78, height: 78, borderRadius: '15px', overflow: 'hidden', mr: 2 }} />
              <Box>
                {isEditingName ? (
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
                {/* <Typography
                  sx={{
                    fontFamily: 'Helvetica, sans-serif',
                    fontSize: '14px',
                    lineHeight: '140%',
                    letterSpacing: '0',
                    color: '#718096',
                  }}
                >
                  {project.company}
                </Typography> */}
              </Box>
            </Box>
          </Box>
          <DialogContent>
            <Overview onFormDataChange={handleFormDataChange} onFormDataChangeProfiles={handleFormDataChangeProfiles}/>
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
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
                  marginRight: 2
                }}
                onClick={onBackCreate}
              >
                Back
            </Button>
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
                padding: 0
              }}
              onClick={handleCreateAndClose}
            >
              Create & Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateProject;