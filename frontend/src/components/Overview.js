import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Slider,
  TextField,
  MenuItem,
  Select,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useGetProfilesByProjectIdQuery,
        useCreateProfileForProjectMutation, 
        useUpdateProfileByIdMutation,
        useDeleteProfileByIdMutation } from '../state/api/profileApi';
import deleteIcon from './../assets/images/delete-icon.svg';
import { useGetSkillsQuery } from '../state/api/skillApi';

const Overview = ({ project, onFormDataChange }) => {
  const initializeSliders = (skillsData) => {
    return skillsData?.data.reduce((acc, skill) => {
      acc[skill.name] = 0;
        return acc;
    }, {});
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("High");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState(["Munich", "Stuttgart", "Cologne", "Stockholm", "Berlin", "Nuremberg", "Madrid"]);
  const [profileName, setProfileName] = useState("");
  const [fteNumber, setFteNumber] = useState("");
  const { data: profilesData, refetch } = useGetProfilesByProjectIdQuery(project._id);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sliders, setSliders] = useState(initializeSliders({ data: [] }));
  const { data: skillsData } = useGetSkillsQuery();
  const [skills, setSkills] = useState([]);
  const [updateProfile] = useUpdateProfileByIdMutation();
  const [createProfile] = useCreateProfileForProjectMutation();
  const [deleteProfile] = useDeleteProfileByIdMutation();

  const capitalizeFirstLetter = useCallback((letter) => {
    if(letter) return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
    else return '';
  }, []);

  const getCategory = (category) => {
    if(category  === 'TECHNOLOGY') return 'Technology';
    else if (category  === 'SOLUTION_ENGINEERING') return 'Solution Engineering';
    else if (category  === 'COMMUNICATION_SKILLS') return 'Communication Skills';
    else if (category  === 'SELF_MANAGEMENT') return 'Self Management';
    else if (category  === 'EMPLOYEE_LEADERSHIP') return 'Employee Leadership';
    else return category
  };
  
  useEffect(() => {
    if (skillsData) {
      setSkills(skillsData.data.map(skill => ({
        _id: skill._id,
        skillCategory: skill.name,
        maxSkillPoints: skill.maxPoints,
        skillPoints: 0,
      })));

      setSliders(initializeSliders(skillsData));
    }
  }, [skillsData]);

  useEffect(() => {
    if (project) {
      const normalizedLocation = capitalizeFirstLetter(project.projectLocation);
      if (!locations.includes(normalizedLocation)) {
        setLocations((prevLocations) => [...prevLocations, normalizedLocation]);
      }
      setLocation(normalizedLocation);
      setPriority(capitalizeFirstLetter(project.priority));
      setStartDate(new Date(project.kickoffDate));
      setEndDate(new Date(project.deadlineDate));
    }
  }, [project, capitalizeFirstLetter, locations]);

  useEffect(() => {
    if (profilesData) {
      setProfiles(profilesData.profiles);
    }
  }, [profilesData]);

  useEffect(() => {
    if (startDate instanceof Date && !isNaN(startDate) &&
        endDate instanceof Date && !isNaN(endDate)) {
      onFormDataChange({
        kickoffDate: startDate.toISOString(),
        deadlineDate: endDate.toISOString(),
        priority: priority.toUpperCase(),
        projectLocation: location.toUpperCase(),
      });
    }
  }, [startDate, endDate, priority, location, onFormDataChange]);

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setProfileName(profile.name);
    setFteNumber(profile.targetDemandId.now);
    setSkills(profile.targetSkills);

    // Set sliders according to targetSkills from backend, set the value from skillPoints
    if (skillsData && skillsData.data) {
      const newSliders = skillsData.data.reduce((acc, skill) => {
        const targetSkill = profile.targetSkills.find(s => s.skillCategory === skill.name);
        acc[skill.name] = targetSkill ? targetSkill.skillPoints : 0;
        return acc;
      }, {});
      setSliders(newSliders);
    }
  };
  
  const handleSliderChange = (skillName, newValue) => {
    setSliders((prevSliders) => ({ ...prevSliders, [skillName]: newValue }));
  };

  const handleSaveProfile = async () => {
    // Save the updated profile to the backend

    const updatedProfile = {
      ...selectedProfile,
      name: profileName,
      targetDemandId: { _id: selectedProfile.targetDemandId._id, now: fteNumber || 0},
      targetSkills: skills.map(skill => ({
        ...skill,
        skillPoints: sliders[skill.skillCategory]
      }))
    };

    try {
        await updateProfile({projectId: project._id, profileId: selectedProfile._id, patchData: updatedProfile});

        refetch();
        // Update the profiles state with the new data
        //setProfiles(profilesData);
    
        // Clear the selected profile after saving
        resetForm();
      } catch (error) {
        console.error("Failed to update profile:", error);
    }
  };

  const handleAddProfile = async() => {
    const newProfile = {
      name: profileName,
      targetDemandId: { now: fteNumber || 0},
      targetSkills: skills.map(skill => ({
        ...skill,
        skillPoints: sliders[skill.skillCategory]
      }))
    };

    try {
        const newProfilesArray = [newProfile];
        await createProfile({projectId: project._id, payload: newProfilesArray});

        refetch();
        // Update the profiles state with the new data
        //setProfiles(profilesData);
    
        // Clear the profile after adding
        resetForm();
      } catch (error) {
        console.error("Failed to update profile:", error);
    }
  };

  const handleDeleteProfile = async (profile) => {
    try {
        if (!!profile) {
          await deleteProfile({ projectId: project._id, profileId: profile._id });
          refetch();

          // Clear the selected profile after saving
          resetForm();
        }

      } catch (error) {
        console.error("Failed to delete profile:", error);
    }
  };

  const resetForm = useCallback(() => {
    setSelectedProfile(null);
    setProfileName("");
    setFteNumber("");
  
    // Initialize sliders with a default value of 0 for each skill
    if (skillsData) {
      const transformedSkills = skillsData.data.map(skill => ({
        _id: skill._id,
        skillCategory: skill.name,         // Rename 'name' to 'skillCategory'
        maxSkillPoints: skill.maxPoints,   // Rename 'maxPoints' to 'maxSkillPoints'
        skillPoints: 0                     // Initialize skillPoints to 0 or any default value
      }));
      
      // Set the transformed skills data
      setSkills(transformedSkills);

      const initialSliders = skillsData.data.reduce((acc, skill) => {
        acc[skill.name] = 0;
        return acc;
      }, {});

      setSliders(initialSliders);
    }
  }, [skillsData]);

  // Use useEffect to reset state when profilesData changes (after refetch)
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <Box sx={{ display: "flex", gap: 5, padding: 0, mt: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ flex: 1 }}>
          {/* Project Duration Section */}
          <Paper
            sx={{
              padding: 4,
              backgroundColor: "white",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              mb: 4,
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
                pb: 1,
              }}
            >
              Project Duration
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                mt: 2,
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </Paper>

          {/* Priority and Project Location Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 4,
                mt: 2,
              }}
            >
              <Box 
                sx={{ 
                  flex: 2, 
                  padding: 4,
                  backgroundColor: "white",
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                  borderRadius: "15px",
                  mb: 4,
                }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Priority
                </Typography>
                <RadioGroup
                  row
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  sx={{ marginTop: 1 }}
                >
                  <FormControlLabel
                    value="High"
                    control={<Radio color="primBlue"/>}
                    label="High"
                    sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                  />
                  <FormControlLabel
                    value="Normal"
                    control={<Radio color="primBlue"/>}
                    label="Normal"
                    sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                  />
                  <FormControlLabel
                    value="Low"
                    control={<Radio color="primBlue"/>}
                    label="Low"
                    sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                  />
                </RadioGroup>
              </Box>

              <Box 
                sx={{ 
                  flex: 1,
                  padding: 4,
                  backgroundColor: "white",
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                  borderRadius: "15px",
                  mb: 4,
                }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0",
                    fontWeight: "medium",
                    color: "black",
                  }}
                >
                  Project Location
                </Typography>
                <Select
                  variant="standard"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  displayEmpty
                  fullWidth
                  inputProps={{ sx: { fontSize: "14px" } }}
                  sx={{ mt: 2}}
                >
                  <MenuItem value="">
                    <em>City/Location</em>
                  </MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

          {/* Profiles on this Project Section */}
          <Paper
            sx={{
              padding: 4,
              backgroundColor: "white",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
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
                pb: 1,
              }}
            >
              Profiles on this Project
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <Box
                  key={profile._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#F7FAFC",
                    borderRadius: "8px",
                    padding: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '14px',
                        lineHeight: '13px',
                        letterSpacing: '0.15px',
                        color: 'black',
                      }}
                    >
                      {profile.name}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="instances-text"
                      >
                        {profile.targetDemandId.now} Instances
                      </Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
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
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        '&:hover': {
                          bgcolor: '#2D82C5',
                        },
                      }}
                      onClick={() => handleEditProfile(profile)}
                    >
                      Edit
                    </Button>
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
                      onClick={() => handleDeleteProfile(profile)}
                    >
                      Delete <img src={deleteIcon} alt="Delete" style={{ marginLeft: '10px' }} />
                    </Button>
                  </Box>
                </Box>
              ))) : (
                <Typography variant="body2" color="textSecondary">
                  No profiles available.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Define Project Profiles Section */}
        <Box sx={{ flex: 1 }}>
          <Paper
            sx={{
              padding: 4,
              backgroundColor: "white",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              maxHeight: '51vh',
              overflowY: 'auto'
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
                pb: 1,
              }}
            >
              {selectedProfile ? "Edit Existing Profile" : "Add New Profile"}
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    label="New Profile Name"
                    variant="outlined"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    fullWidth
                    InputProps={{
                      sx: { fontSize: "14px" },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: "14px" },
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Select
                    value={fteNumber}
                    onChange={(e) => setFteNumber(e.target.value)}
                    displayEmpty
                    fullWidth
                    inputProps={{ sx: { fontSize: "14px" } }}
                    sx={{ 
                      height: '52px'
                    }}
                  >
                    <MenuItem value="">
                      <em>Number of FTEs</em>
                    </MenuItem>
                    {[...Array(16).keys()].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
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
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: '#2D82C5',
                    },
                  }}
                  onClick={selectedProfile ? handleSaveProfile : handleAddProfile}
                >
                  {selectedProfile ? "SAVE" : "ADD"}
                </Button>
              </Box>
            {skillsData && skillsData.data.map((skill, index) => (
            <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
            >
                <Typography 
                  sx={{ 
                    fontSize: "14px", 
                    minWidth: '180px',
                    color: "#828282",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: "150%",
                    letterSpacing: "0%",
                  }}>
                  {getCategory(skill.name)}
                </Typography>
                <Slider
                  value={sliders[skill.name] || 0}
                  step={1}
                  marks
                  min={0}
                  max={skill.maxPoints}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    handleSliderChange(skill.name, newValue)
                  }
                  aria-labelledby={`slider-${index}`}
                  sx={{ color: "#2684FF", flex: 1 }}
                />
              </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default Overview;
