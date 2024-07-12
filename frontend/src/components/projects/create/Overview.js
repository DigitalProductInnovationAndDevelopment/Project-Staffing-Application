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

const Overview = ({ onFormDataChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState(["Munich", "Stuttgart", "Cologne", "Stockholm", "Berlin", "Nuremberg", "Madrid"]);
  const [profileName, setProfileName] = useState("");
  const [fteNumber, setFteNumber] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sliders, setSliders] = useState({
    technology: 0,
    solutionEngineering: 0,
    selfManagement: 0,
    communicationSkills: 0,
    employeeLeadership: 0,
  });

  const capitalizeFirstLetter = useCallback((letter) => {
    if(letter) return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
    else return '';
  }, []);

  useEffect(() => {
      const normalizedLocation = capitalizeFirstLetter(location);
      if (!locations.includes(normalizedLocation)) {
        setLocations((prevLocations) => [...prevLocations, normalizedLocation]);
      }
  }, [capitalizeFirstLetter, locations, location]);

  useEffect(() => {
    // Fetch profiles from the backend
    fetchProfiles();
  }, []);

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


  const fetchProfiles = async () => {
    // Fetch profiles from the backend
    // Example:
    // const response = await fetch('/api/profiles');
    // const data = await response.json();
    // setProfiles(data);

    // For now, let's use dummy data
    const data = [
    // {
    //     id: 1,
    //     title: "Project Lead",
    //     instances: 1,
    //     sliders: {
    //       technology: 10,
    //       solutionEngineering: 5,
    //       selfManagement: 8,
    //       communicationSkills: 7,
    //       employeeLeadership: 6,
    //     },
    //   },
    //   {
    //     id: 2,
    //     title: "Full-Stack Developer",
    //     instances: 2,
    //     sliders: {
    //       technology: 15,
    //       solutionEngineering: 8,
    //       selfManagement: 10,
    //       communicationSkills: 6,
    //       employeeLeadership: 4,
    //     },
    //   },
    //   {
    //     id: 3,
    //     title: "Cloud Expert",
    //     instances: 1,
    //     sliders: {
    //       technology: 8,
    //       solutionEngineering: 7,
    //       selfManagement: 9,
    //       communicationSkills: 8,
    //       employeeLeadership: 5,
    //     },
    //   },
    ];
    setProfiles(data);
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setProfileName(profile.title);
    setFteNumber(profile.instances);
    setSliders(profile.sliders);
  };

  const handleSliderChange = (field, newValue) => {
    setSliders({ ...sliders, [field]: newValue });
  };

  const handleSaveProfile = async () => {
    // Save the updated profile to the backend
    const updatedProfile = {
      ...selectedProfile,
      title: profileName,
      instances: fteNumber,
      sliders,
    };

    // Example:
    // await fetch(`/api/profiles/${selectedProfile.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(updatedProfile),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    // Update the profiles state with the new data
    setProfiles(
      profiles.map((profile) =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    );

    // Clear the selected profile after saving
    setSelectedProfile(null);
    setProfileName("");
    setFteNumber("");
    setSliders({
      technology: 0,
      solutionEngineering: 0,
      selfManagement: 0,
      communicationSkills: 0,
      employeeLeadership: 0,
    });
  };

  const handleAddProfile = () => {
    const newProfile = {
      id: profiles.length + 1,
      title: profileName,
      instances: fteNumber,
      sliders,
    };

    setProfiles([...profiles, newProfile]);

    setProfileName("");
    setFteNumber("");
    setSliders({
      technology: 0,
      solutionEngineering: 0,
      selfManagement: 0,
      communicationSkills: 0,
      employeeLeadership: 0,
    });
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles(profiles.filter(profile => profile.id !== profileId));
  };

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
                      {profile.title}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="instances-text"
                      >
                        {profile.instances} Instances
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
            {[
            { title: "Technology", field: "technology", min: 0, max: 15 },
            {
                title: "Solution Engineering",
                field: "solutionEngineering",
                min: 0,
                max: 8,
            },
            {
                title: "Self Management",
                field: "selfManagement",
                min: 0,
                max: 25,
            },
            {
                title: "Communication Skills",
                field: "communicationSkills",
                min: 0,
                max: 18,
            },
            {
                title: "Employee Leadership",
                field: "employeeLeadership",
                min: 0,
                max: 30,
            },
            ].map((skill, index) => (
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
                  {skill.title}
                </Typography>
                <Slider
                  value={sliders[skill.field]}
                  step={1}
                  marks
                  min={skill.min}
                  max={skill.max}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    handleSliderChange(skill.field, newValue)
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
