import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const Overview = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("High");
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

  useEffect(() => {
    // Fetch profiles from the backend
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    // Fetch profiles from the backend
    // Example:
    // const response = await fetch('/api/profiles');
    // const data = await response.json();
    // setProfiles(data);

    // For now, let's use dummy data
    const data = [
      {
        id: 1,
        title: "Project Lead",
        instances: 1,
        sliders: {
          technology: 10,
          solutionEngineering: 5,
          selfManagement: 8,
          communicationSkills: 7,
          employeeLeadership: 6,
        },
      },
      {
        id: 2,
        title: "Front-End Developer",
        instances: 1,
        sliders: {
          technology: 15,
          solutionEngineering: 8,
          selfManagement: 10,
          communicationSkills: 6,
          employeeLeadership: 4,
        },
      },
      {
        id: 3,
        title: "Cloud Expert",
        instances: 3,
        sliders: {
          technology: 8,
          solutionEngineering: 7,
          selfManagement: 9,
          communicationSkills: 8,
          employeeLeadership: 5,
        },
      },
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

  return (
    <Box sx={{ padding: 0 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={4}>
          {/* Project Duration Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 4,
                backgroundColor: "white",
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Helvetica, sans-serif",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0",
                  fontWeight: "bold",
                  color: "#2D3748",
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
          </Grid>

          {/* Priority Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 4,
                backgroundColor: "white",
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',     
                borderRadius: '15px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Helvetica, sans-serif",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0",
                  fontWeight: "bold",
                  color: "#2D3748",
                  pb: 1,
                }}
              >
                Priority
              </Typography>
              <RadioGroup
                row
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                sx={{ marginTop: 2 }}
              >
                <FormControlLabel
                  value="ASAP"
                  control={<Radio color="primary" />}
                  label="ASAP"
                  sx={{ "& .MuiTypography-root": { fontSize: "14px" } }} // Adjusted font size
                />
                <FormControlLabel
                  value="High"
                  control={<Radio color="primary" />}
                  label="High"
                  sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                />
                <FormControlLabel
                  value="Normal"
                  control={<Radio color="primary" />}
                  label="Normal"
                  sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                />
              </RadioGroup>
            </Paper>
          </Grid>

          {/* Profiles on this Project Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 4,
                backgroundColor: "white",
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Helvetica, sans-serif",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0",
                  fontWeight: "bold",
                  color: "#2D3748",
                  pb: 1,
                }}
              >
                Profiles on this Project
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                {profiles.map((profile, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "Helvetica, sans-serif",
                          fontSize: "14px", // Adjusted font size
                        }}
                      >
                        {profile.title}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            fontFamily: "Helvetica, sans-serif",
                            fontSize: "12px", // Adjusted font size
                          }}
                        >
                          {profile.instances} Instances
                        </Typography>
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "12px" }} // Adjusted font size
                        onClick={() => handleEditProfile(profile)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ fontSize: "12px" }} // Adjusted font size
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Define Project Profiles Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                padding: 4,
                backgroundColor: "white",
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Helvetica, sans-serif",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0",
                  fontWeight: "bold",
                  color: "#2D3748",
                  pb: 1,
                }}
              >
                Define Project Profiles
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center", // Ensure alignment of all items
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      label="Define Profile"
                      variant="outlined"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      fullWidth
                      InputProps={{
                        sx: { fontSize: "14px" }, // Adjusted font size
                      }}
                      InputLabelProps={{
                        sx: { fontSize: "14px" }, // Adjusted font size
                      }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Select
                      value={fteNumber}
                      onChange={(e) => setFteNumber(e.target.value)}
                      displayEmpty
                      fullWidth
                      inputProps={{ sx: { fontSize: "14px" } }} // Adjusted font size
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
                    color="primary"
                    sx={{ fontSize: "12px" }} // Adjusted font size
                    onClick={handleSaveProfile}
                  >
                    Save
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
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography gutterBottom sx={{ fontSize: "14px" }}>
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
                      sx={{ color: "#2684FF" }} // Adjusted font size
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default Overview;
