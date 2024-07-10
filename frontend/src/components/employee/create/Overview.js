import React, { useState, useEffect, useCallback} from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, TextField, Slider, Paper} from '@mui/material';

const initialSkills = [
  { name: 'Technology', value: 0, min: 0, max: 20,},
  { name: 'Solution Engineering', value: 0 , min: 0, max: 15,},
  { name: 'Self Management', value: 0,  min: 0, max: 15, },
  { name: 'Communication Skills', value: 0,  min: 0, max: 20, },
  { name: 'Employee Leadership', value: 0,  min: 0, max: 18, },
];

const Overview = ({ onFormDataChange }) => {
  const [location, setLocation] = useState("");
  const [canWorkRemote, setCanWorkRemote] = useState(false);
  const [workingHours, setWorkingHours] = useState(0);
  const [skills, setSkills] = useState(initialSkills);
  const [locations, setLocations] = useState(["Munich", "Stuttgart", "Cologne", "Stockholm", "Berlin", "Nuremberg", "Madrid"]);
  
  const normalizeLocation = useCallback((location) => {
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  }, []);

  useEffect(() => {
    const normalizedLocation = normalizeLocation(location);
    if (!locations.includes(normalizedLocation)) {
      setLocations((prevLocations) => [...prevLocations, normalizedLocation]);
    }
  }, [normalizeLocation, location, locations]);

  useEffect(() => {
    onFormDataChange({
      officeLocation: location.toUpperCase(),
      canWorkRemote,
      contract: {
        startDate: new Date(),
        weeklyWorkingHours: workingHours
      }
    });
  }, [location, canWorkRemote, normalizeLocation, onFormDataChange, workingHours]);

  const handleRemoteChange = (event) => {
    setCanWorkRemote(event.target.checked);
  };

  const handleHoursChange = (event) => {
    setWorkingHours(event.target.value);
  };

  const handleSkillChange = (index) => (event, newValue) => {
    const newSkills = [...skills];
    newSkills[index].value = newValue;
    setSkills(newSkills);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", gap: 5, padding: 0, mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          {/* Select Working Location and Weekly Availability Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <Box 
                sx={{ 
                  flex: 1, 
                  padding: 4,
                  pb: 2,
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
                  Select Working Location
                </Typography>
                <Select
                  variant="standard"
                  value={location}
                  onChange={handleLocationChange}
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
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2,}}>
                  <Checkbox color="profBlue" checked={canWorkRemote} onChange={handleRemoteChange} />
                  <Typography className='text-regular'>Yes, I can work Remote</Typography>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  flex: 1,
                  padding: 4,
                  pb: 2,
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
                    mb: 2
                  }}
                >
                  Weekly Availability
                </Typography>
                <TextField
                    color="profBlue"
                    label="Working Hours"
                    variant="outlined"
                    type="number"
                    value={workingHours}
                    onChange={handleHoursChange}
                    fullWidth
                    InputProps={{
                      sx: { fontSize: "14px" },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: "14px" },
                    }}
                  />
              </Box>
            </Box>
        </Box>

        {/* Define Skill Point Categories Section */}
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
              Skill Point Categories
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
            {skills.map((skill, index) => (
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
                  {skill.name}
                </Typography>
                <Slider
                  value={skill.value}
                  step={1}
                  marks
                  min={skill.min}
                  max={skill.max}
                  valueLabelDisplay="auto"
                  onChange={handleSkillChange(index)}
                  aria-labelledby={`slider-${index}`}
                  sx={{ color: "#36C5F0", flex: 1 }}
                />
              </Box>
              ))}
            </Box>
          </Paper>
        </Box>
    </Box>
  );
};

export default Overview;
