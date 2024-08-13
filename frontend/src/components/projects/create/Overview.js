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
import deleteIcon from './../../../assets/images/delete-icon.svg';
import { useGetSkillsQuery } from './../../../state/api/skillApi';

const Overview = ({ onFormDataChange, onFormDataChangeProfiles}) => {
  const initializeSliders = (skillsData) => {
    return skillsData?.data.reduce((acc, skill) => {
      acc[skill.name] = 0;
        return acc;
    }, {});
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState(["Munich", "Stuttgart", "Cologne", "Stockholm", "Berlin", "Nuremberg", "Madrid"]);
  const [profileName, setProfileName] = useState("");
  const [fteNumber, setFteNumber] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [sliders, setSliders] = useState(initializeSliders({ data: [] }));
  const { data: skillsData } = useGetSkillsQuery();
  const [skills, setSkills] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
      const normalizedLocation = capitalizeFirstLetter(location);
      if (!locations.includes(normalizedLocation)) {
        setLocations((prevLocations) => [...prevLocations, normalizedLocation]);
      }
  }, [capitalizeFirstLetter, locations, location]);

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
    onFormDataChangeProfiles({
      profiles: profiles
    }); 
  }, [startDate, endDate, priority, location, onFormDataChange, onFormDataChangeProfiles, profiles]);


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
     const updatedProfile = {
      ...selectedProfile,
      name: profileName,
      targetDemandId: { now: fteNumber || 0},
      targetSkills: skills.map(skill => ({
        ...skill,
        skillPoints: sliders[skill.skillCategory]
      }))

    };

    // Update the profiles state with the new data
    setProfiles(
      profiles.map((profile) =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    );

    // Clear the selected profile after saving
    resetForm();
  };

  const handleAddProfile = () => {
    const newProfile = {
      id: profiles.length + 1,
      name: profileName,
      targetDemandId: { now: fteNumber || 0 },
      targetSkills: skills.map(skill => ({
        ...skill,
        skillPoints: sliders[skill.skillCategory]
      }))
    };

    setProfiles([...profiles, newProfile]);

    resetForm();
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles(profiles.filter(profile => profile.id !== profileId));
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
              {profiles.map((profile) => (
                <Box
                  key={profile.id}
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
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      Delete <img src={deleteIcon} alt="Delete" style={{ marginLeft: '10px' }} />
                    </Button>
                  </Box>
                </Box>
              ))}
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
