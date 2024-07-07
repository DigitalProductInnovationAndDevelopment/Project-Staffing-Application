import React, { useState, useEffect, useCallback} from 'react';
import { Box, Typography, Select, MenuItem, Checkbox, TextField, Slider, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { projectApi } from "../../state/api/projectApi.js";

// const data = [
//   { name: 'Unallocated/Free', value: 40, color: '#AA38C6' },
//   { name: 'Project A', value: 30, color: '#18A79F' },
//   { name: 'Project B', value: 30, color: '#159ED9' },
// ];

const initialSkills = [
  { name: 'Technology', value: 5, min: 0, max: 20,},
  { name: 'Solution Engineering', value: 11 , min: 0, max: 15,},
  { name: 'Self Management', value: 9,  min: 0, max: 15, },
  { name: 'Communication Skills', value: 12,  min: 0, max: 20, },
  { name: 'Employee Leadership', value: 13,  min: 0, max: 18, },
];

const Overview = ({ user, onFormDataChange }) => {
  const [location, setLocation] = useState("");
  const [canWorkRemote, setCanWorkRemote] = useState(false);
  const [workingHours, setWorkingHours] = useState(40);
  const [skills, setSkills] = useState(initialSkills);
  const [projectData, setProjectData] = useState([]);
  const [locations, setLocations] = useState(["Munich", "Madrid", "Stockholm", "Tallin"]);
  const { data: projects } = projectApi.endpoints.getAllProjects.useQuery();
  
  const normalizeLocation = useCallback((location) => {
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  }, []);

  useEffect(() => {
    const formatProjectData = (projectWorkingHourDistributionInPercentage) => {
      if (!projectWorkingHourDistributionInPercentage || Object.keys(projectWorkingHourDistributionInPercentage).length === 0) {
        return [{ name: 'Unallocated/Free', value: 100, color: '#AA38C6' }];
      }
  
      const projectData = Object.entries(projectWorkingHourDistributionInPercentage).map(([projectId, percentage]) => ({
        name: getProjectName(projectId),
        value: parseFloat(percentage),
        color: getRandomColor(),
      }));
  
      const allocatedHours = projectData.reduce((sum, project) => sum + project.value, 0);
      if (allocatedHours < 100) {
        projectData.push({ name: 'Unallocated/Free', value: 100 - allocatedHours, color: '#AA38C6' });
      }
  
      return projectData;
    };

    const getProjectName = (projectId) => {
      if (!Array.isArray(projects.projects)) return '';
      const project = projects.projects.find((p) => p._id === projectId);
      return project ? project.projectName : '';
    };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    if (user) {
      const normalizedLocation = normalizeLocation(user.officeLocation);
      if (!locations.includes(normalizedLocation)) {
        setLocations((prevLocations) => [...prevLocations, normalizedLocation]);
      }
      setLocation(normalizedLocation);
      setCanWorkRemote(user.canWorkRemote);
      setProjectData(formatProjectData(user.projectWorkingHourDistributionInPercentage));
    }
  }, [user, normalizeLocation, locations, projects]);


  useEffect(() => {
    onFormDataChange({
      officeLocation: location.toUpperCase(),
      canWorkRemote,
      //weeklyAvailability: workingHours,
    });
  }, [location, canWorkRemote, normalizeLocation, onFormDataChange]);

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

          {/* Allocated Projects Section */}
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
              Allocated Projects
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <PieChart width={200} height={200}>
                <Pie
                    data={projectData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                >
                    {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                {projectData.map((entry, index) => (
                    <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                        sx={{
                        width: 14,
                        height: 14,
                        backgroundColor: entry.color,
                        mr: 1,
                        }}
                    />
                    <Typography className='text-regular'>
                        {entry.name}: {entry.value}%
                    </Typography>
                    </Box>
                ))}
                </Box>
            </Box>
          </Paper>
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
