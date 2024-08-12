import React, { useState } from 'react';
import { Dialog, Box, Typography, Button, CircularProgress, TextField, Paper } from '@mui/material';
import backgroundImage from './../assets/images/orange_bg.svg';
import deleteIcon from './../assets/images/delete-icon.svg';
import { useGetSkillsQuery, useUpdateSkillMutation, useCreateSkillMutation, useDeleteSkillMutation } from '../state/api/skillApi';
import '../style.scss';

const EditSkills = ({ open, onClose }) => {
  const { data: skillsData, error, isLoading, refetch } = useGetSkillsQuery();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [createSkill] = useCreateSkillMutation();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPoints, setNewSkillPoints] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPoints, setEditedPoints] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const handleAddSkill = async () => {
    if (newSkillName && newSkillPoints) {
      await createSkill({ name: newSkillName, maxPoints: newSkillPoints });
      setNewSkillName('');
      setNewSkillPoints('');
      refetch();
    }
  };

  const handleEditClick = (skill) => {
    setEditingSkillId(skill._id);
    setEditedName(skill.name);
    setEditedPoints(skill.maxPoints);
  };

  const handleSaveClick = async (id) => {
    await updateSkill({ skillId: id, patchData: { name: editedName, maxPoints: editedPoints } });
    setEditingSkillId(null);
    refetch();
  };

  const handleOpenDeleteDialog = (skillId) => {
    setSkillToDelete(skillId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSkill = async () => {
    try {
      if (skillToDelete) {
        await deleteSkill(skillToDelete);
        setDeleteDialogOpen(false);
        refetch();
      }
    } 
    catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const getCategory = (category) => {
    if(category  === 'TECHNOLOGY') return 'Technology';
    else if (category  === 'SOLUTION_ENGINEERING') return 'Solution Engineering';
    else if (category  === 'COMMUNICATION_SKILLS') return 'Communication Skills';
    else if (category  === 'SELF_MANAGEMENT') return 'Self Management';
    else if (category  === 'EMPLOYEE_LEADERSHIP') return 'Employee Leadership';
    else return category;
  };
  
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching skills: {error.message}</Typography>;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Box sx={{ backgroundColor: '#F8F9FA', padding: 2 }}>
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
              Pages / Settings
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
              Edit Skill Categories
            </Typography>
          </Box>
          <Paper
            sx={{
              backgroundColor: 'white',
              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              marginTop: '-86px',
              ml: 25, mr: 25,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              maxHeight: '63vh'
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0",
                fontWeight: "medium",
                color: "black",
                pb: 2,
              }}
            >
              Edit Skill Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  variant="outlined"
                  label="New Skill Category Name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  sx={{ width: '300px' }}
                />
                <TextField
                  variant="outlined"
                  label="Scale Maximum Points"
                  value={newSkillPoints}
                  onChange={(e) => setNewSkillPoints(e.target.value)}
                  type="number"
                  sx={{ maxWidth: '150px' }}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <Button
                  variant="contained"
                  sx={{ 
                    fontSize: "12px",
                    bgcolor: '#2196F3',
                    color: 'white',
                    fontFamily: 'Roboto, sans-serif',
                    lineHeight: '24px',
                    letterSpacing: '0.16px',
                    padding: '6px 14px',
                    ml: 2,
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: '#2D82C5',
                      
                    },
                  }}
                  onClick={handleAddSkill}
                >
                  Add Globally
                </Button>
              </Box>
              {skillsData && skillsData.data.map((skill) => (
                <Box key={skill._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {editingSkillId === skill._id ? (
                      <>
                        <TextField
                          variant="outlined"
                          value={getCategory(editedName)}
                          onChange={(e) => setEditedName(e.target.value)}
                          sx={{ width: '300px' }}
                        />
                        <TextField
                          variant="outlined"
                          label="Maximum Points"
                          value={editedPoints}
                          onChange={(e) => setEditedPoints(e.target.value)}
                          type="number"
                          sx={{ maxWidth: '150px' }}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </>
                    ) : (
                      <>
                        <Typography 
                          sx={{ 
                            fontSize: "14px", 
                            width: '300px',
                            color: "#828282",
                            fontFamily: "Inter, sans-serif",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                          }}>{getCategory(skill.name)}</Typography>
                          
                        <TextField
                          variant="outlined"
                          label="Maximum Points"
                          value={skill.maxPoints}
                          InputProps={{
                            readOnly: true,
                            inputProps: { min: 0 },
                          }}
                          type="number"
                          sx={{ maxWidth: '150px' }}
                        />
                      </>
                    )}
                    {editingSkillId === skill._id ? (
                      <Button
                        variant="contained"
                        sx={{ 
                          fontSize: "12px",
                          bgcolor: '#2196F3',
                          color: 'white',
                          fontFamily: 'Roboto, sans-serif',
                          lineHeight: '24px',
                          letterSpacing: '0.16px',
                          padding: '6px 14px',
                          mr: 0.5,
                          ml: 2,
                          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                          '&:hover': {
                            bgcolor: '#2D82C5',
                            
                          },
                        }}
                        onClick={() => handleSaveClick(skill._id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                      sx={{ 
                        fontSize: "12px",
                        bgcolor: '#2196F3',
                        color: 'white',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '24px',
                        letterSpacing: '0.16px',
                        padding: '6px 14px',
                        mr: 0.5,
                        ml: 2,
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        '&:hover': {
                          bgcolor: '#2D82C5',
                        },
                      }}
                        onClick={() => handleEditClick(skill)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        fontSize: "12px",
                        bgcolor: '#E10050',
                        color: 'white',
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: '24px',
                        letterSpacing: '0.16px',
                        padding: '6px 14px',
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        '&:hover': {
                          bgcolor: '#CB074D',
                        },
                      }}
                      onClick={() => handleOpenDeleteDialog(skill._id)}
                    >
                      Delete <img src={deleteIcon} alt="Delete" style={{ marginLeft: '10px' }} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
          <Button 
            onClick={onClose} 
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
            }}>
               Close
          </Button>
        </Box>
      </Box>
      <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-project-dialog"
          aria-describedby="delete-project-dialog-description"
        >
          <Box sx={{ padding: 4 }}>
            <Typography id="delete-project-dialog-title" variant="h6">
              Confirm Deletion
            </Typography>
            <Typography id="delete-project-dialog-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this skill category?
            </Typography>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)} 
                variant="contained"
                color="secondary"
                sx={{
                    textTransform: 'none',
                    color: 'white',
                    height: '40px',
                    fontFamily: 'Halvetica, sans-serif',
                    fontWeight: 'Bold',
                    fontSize: '12px',
                    lineHeight: '24px',
                    letterSpacing: '0.16px',
                    padding: '6px 14px',
                }}>
                  Cancel
              </Button>
              <Button
                onClick={handleDeleteSkill}
                variant="contained"
                color="error"
                sx={{
                  textTransform: 'none',
                  fontSize: "12px",
                  bgcolor: '#E10050',
                  color: 'white',
                  fontFamily: 'Halvetica, sans-serif',
                  fontWeight: 'Bold',
                  lineHeight: '24px',
                  letterSpacing: '0.16px',
                  padding: '6px 14px',
                  boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                  '&:hover': {
                    bgcolor: '#CB074D',
                  },
                  ml: '8px',
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Dialog>
    </Dialog>
  );
};

export default EditSkills;
