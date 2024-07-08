import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Avatar, Typography, Button, CircularProgress, TextField} from '@mui/material';
import Overview from './employee/Overview';
import DetailsOverview from './employee/DetailsOverview'
import backgroundImage from './../assets/images/employee_edit_bg.svg';
import '../style.scss';
import { useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation} from '../state/api/userApi';
import AvatarBlue from "./../assets/images/icons/blue_avatar.svg";
import deleteIcon from './../assets/images/delete-icon.svg';

const EditProfile = ({ open, onClose, employee, source, onBack}) => {

  const userId  = employee.userId;
  const { data: user, error, isLoading, refetch } = useGetUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [formData, setFormData] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        officeLocation: user.officeLocation,
        canWorkRemote: user.canWorkRemote,
        //weeklyAvailability: user.weeklyAvailability || 40,
      });
      setFullName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveAndClose = async () => {
   try {
      await updateUser({ userId: userId, patchData: formData });
      refetch();
      onClose();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = async () => {
   try {
      await deleteUser(userId);
      onClose();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFullNameClick = () => {
    setIsEditingName(true);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleFullNameBlur = () => {
    setIsEditingName(false);
    const nameParts = fullName.split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.join(' ');
    setFormData((prevData) => ({ ...prevData, firstName, lastName }));
  };

  const handleEmailClick = () => {
    setIsEditingEmail(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailBlur = () => {
    setIsEditingEmail(false);
    setFormData((prevData) => ({ ...prevData, email }));
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
              {source === 'Employees' ?  ' Start / Employees / Edit Profile' : ( 'Start / Projects / Assign Team / See Profile' )}
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
            {source === 'Employees' ? 
              'Edit Profile'
             : (
              'See Profile'
            )}
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
              <Avatar alt={`${user.firstName} ${user.lastName}`} src={AvatarBlue} sx={{ width: 78, height: 78, borderRadius: '15px', overflow: 'hidden', mr: 2 }} />
              <Box>
              {isEditingName ? (
                  <TextField
                    value={fullName}
                    onChange={handleFullNameChange}
                    onBlur={handleFullNameBlur}
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
            {source === 'Employees' ? (
              <Overview user={user} onFormDataChange={handleFormDataChange}/>
            ) : (
              <DetailsOverview user={user} />
            )}
          </DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          {source === 'Employees' ? (
             <>
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
                onClick={handleSaveAndClose}
              >
                Save & Close
              </Button>
              <Button
                variant="contained"
                color="error"
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
                }}
                onClick={handleDelete}
              >
               <img src={deleteIcon} alt="Delete" style={{ marginLeft: '2px', marginRight: '4px' }} /> Delete Profile
              </Button>
            </>
            ) : (
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
                }}
                onClick={onBack}
              >
                Back
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProfile;