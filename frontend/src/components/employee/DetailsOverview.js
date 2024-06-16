import React, { useState } from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Unallocated/Free', value: 40, color: '#AA38C6' },
  { name: 'Project A', value: 30, color: '#18A79F' },
  { name: 'Project B', value: 30, color: '#159ED9' },
];

const initialSkills = [
  { name: 'Technology', value: 3, min: 0, max: 20,},
  { name: 'Solution Engineering', value: 7 , min: 0, max: 15,},
  { name: 'Self Management', value: 5,  min: 0, max: 12, },
  { name: 'Communication Skills', value: 7,  min: 0, max: 13, },
  { name: 'Employee Leadership', value: 9,  min: 0, max: 10, },
];

const Overview = () => {
  const [skills] = useState(initialSkills);

  return (
    <Box sx={{ display: "flex", gap: 5, padding: 0, mt: 2 }}>
        <Box sx={{ flex: 1 }}>
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
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                {data.map((entry, index) => (
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
