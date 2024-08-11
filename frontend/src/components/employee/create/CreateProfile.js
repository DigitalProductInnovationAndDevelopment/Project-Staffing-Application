import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Avatar, Typography, Button, TextField} from '@mui/material';
import Overview from './Overview';
import backgroundImage from './../../../assets/images/employee_edit_bg.svg';
import '../../../style.scss';
import {useCreateNewUserMutation} from '../../../state/api/userApi';
import AvatarBlue from "./../../../assets/images/icons/blue_avatar.svg";

const CreateProfile = ({ openCreate, onCloseCreate, onBackCreate}) => {

  const [createUser] = useCreateNewUserMutation();
  const [formData, setFormData] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [fullName, setFullName] = useState('Click & Enter Employee Name and Surname');
  const [email, setEmail] = useState('Click & Enter email');
  const [isFullNameInvalid, setIsFullNameInvalid] = useState(false);

  useEffect(() => {
      setFormData({
        password: '0000',
        officeLocation: '',
        canWorkRemote: false,
        skills: [],
        //weeklyAvailability: user.weeklyAvailability || 40,
      });
  }, []);

  const handleCreateAndClose = async () => {
   try {
      await createUser(formData);
      setFullName('Click & Enter Employee Name');
      setEmail('Click & Enter email');
      onCloseCreate();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFullNameClick = () => {
    setFullName('')
    setIsEditingName(true);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleFullNameBlur = () => {
    setIsEditingName(false);
    if(!fullName) setFullName('Click & Enter Employee Name')
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) {
      setIsFullNameInvalid(true);
    } else {
      setIsFullNameInvalid(false);
      const lastName = nameParts.pop();
      const firstName = nameParts.join(' ');
      setFormData((prevData) => ({ ...prevData, firstName, lastName }));
    }
  };

  const handleEmailClick = () => {
    setEmail('')
    setIsEditingEmail(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailBlur = () => {
    setIsEditingEmail(false);
    if(!email) setEmail('Click & Enter email')
    else setFormData((prevData) => ({ ...prevData, email }));
  };

  const isFormComplete = () => {
    const { firstName, lastName, email, officeLocation } = formData;
    return firstName && lastName && email && officeLocation;
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
               Start / Employees / Create Profile
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
              Create Profile
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
              <Avatar alt={fullName} src={AvatarBlue} sx={{ width: 78, height: 78, borderRadius: '15px', overflow: 'hidden', mr: 2 }} />
              <Box>
              {isEditingName ? (
                  <TextField
                    value={fullName}
                    onChange={handleFullNameChange}
                    onBlur={handleFullNameBlur}
                    autoFocus
                    error={isFullNameInvalid}
                    helperText={isFullNameInvalid ? 'Please enter both first name and last name.' : ''}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Helvetica, sans-serif',
                        fontSize: '18px',
                        lineHeight: '140%',
                        fontWeight: 'bold',
                        color: '#2D3748',
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: isFullNameInvalid ? 'red' : 'default',
                        },
                        '&:hover fieldset': {
                          borderColor: isFullNameInvalid ? 'red' : 'default',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: isFullNameInvalid ? 'red' : 'default',
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography
                    onClick={handleFullNameClick}
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
                    {fullName}
                  </Typography>
                )}
                {isEditingEmail ? (
                  <TextField
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    autoFocus
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'Helvetica, sans-serif',
                        fontSize: '14px',
                        lineHeight: '140%',
                        color: '#718096',
                      },
                    }}
                  />
                ) : (
                  <Typography
                    onClick={handleEmailClick}
                    sx={{
                      fontFamily: 'Helvetica, sans-serif',
                      fontSize: '14px',
                      lineHeight: '140%',
                      letterSpacing: '0',
                      color: '#718096',
                      cursor: 'pointer',
                    }}
                  >
                    {email}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <DialogContent>
            <Overview onFormDataChange={handleFormDataChange}/>
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
              <Button
                variant="contained"
                color="profBlue"
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
                color="profBlue"
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
                onClick={handleCreateAndClose}
                disabled={!isFormComplete()}
              >
                Create & Close
              </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateProfile;