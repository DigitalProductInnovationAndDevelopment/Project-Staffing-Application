import React from "react";
import { Box, Typography, Grid, Avatar, IconButton, LinearProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function EmployeeOverview() {
  const employees = [
    {
      name: "Esthera Jackson",
      email: "esthera@itestra.com",
      utilization: "75%",
      projects: 3,
      skills: {
        technology: "5/20",
        solutionEngineering: "11/15",
        selfManagement: "9/15",
        communicationSkills: "12/20",
        employeeLeadership: "13/18"
      },
      location: "Munich",
      avatar: "/mnt/data/Bildschirmfoto 2024-06-06 um 17.36.02.png"
    },
    {
      name: "Paul Paulsen",
      email: "paulsen@itestra.com",
      utilization: "75%",
      projects: 3,
      skills: {
        technology: "5/20",
        solutionEngineering: "11/15",
        selfManagement: "9/15",
        communicationSkills: "12/20",
        employeeLeadership: "13/18"
      },
      location: "Madrid",
      avatar: "/mnt/data/Bildschirmfoto 2024-06-06 um 17.36.02.png"
    },
    {
      name: "Max Mustermann",
      email: "mustermann@itestra.com",
      utilization: "75%",
      projects: 3,
      skills: {
        technology: "5/20",
        solutionEngineering: "11/15",
        selfManagement: "9/15",
        communicationSkills: "12/20",
        employeeLeadership: "13/18"
      },
      location: "Stockholm",
      avatar: "/mnt/data/Bildschirmfoto 2024-06-06 um 17.36.02.png"
    },
    {
      name: "Peter Drucker",
      email: "drucker@itestra.com",
      utilization: "75%",
      projects: 3,
      skills: {
        technology: "5/20",
        solutionEngineering: "11/15",
        selfManagement: "9/15",
        communicationSkills: "12/20",
        employeeLeadership: "13/18"
      },
      location: "Tallin",
      avatar: "/mnt/data/Bildschirmfoto 2024-06-06 um 17.36.02.png"
    },
    {
      name: "Andrew Ng",
      email: "ng@itestra.com",
      utilization: "75%",
      projects: 3,
      skills: {
        technology: "5/20",
        solutionEngineering: "11/15",
        selfManagement: "9/15",
        communicationSkills: "12/20",
        employeeLeadership: "13/18"
      },
      location: "Munich",
      avatar: "/mnt/data/Bildschirmfoto 2024-06-06 um 17.36.02.png"
    }
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ bgcolor: "white", borderRadius: "12px", p: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '0',
              fontWeight: 'bold',
              color: '#2D3748',
              marginBottom: 2,
            }}
          >Employee Overview</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container sx={{ color: '#A0AEC0', fontFamily: 'Helvetica, sans-serif', fontSize: 2 }}>
                <Grid item xs={2}><Typography variant="body1">PERSON</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">CURRENT UTILIZATION</Typography></Grid>
                <Grid item xs={1}><Typography variant="body1"># PROJECTS</Typography></Grid>
                <Grid item xs={1}><Typography variant="body1">TECHNOLOGY</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">SOLUTION ENGINEERING</Typography></Grid>
                <Grid item xs={1}><Typography variant="body1">SELF MANAGEMENT</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">COMMUNICATION SKILLS</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">EMPLOYEE LEADERSHIP</Typography></Grid>
                <Grid item xs={1}><Typography variant="body1">LOCATION</Typography></Grid>
              </Grid>
            </Grid>
            {employees.map((employee, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" sx={{ lineHeight: '0.5' }} item xs={12}>
                    <Grid container sx={{ fontSize: "14px" }}>
                      <Grid item xs={0.5}>
                        <Avatar src={employee.avatar} sx={{ width: 24, height: 24 }} />
                      </Grid>
                      <Grid item xs={1.5}>
                        <Typography variant="body2">{employee.name}</Typography>
                        <Typography variant="body2">{employee.email}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ mr: 1, color: "#4FD1C5", fontWeight: 'bold', }}>{employee.utilization}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={parseInt(employee.utilization)}
                            sx={{
                              width: "60%",
                              height: 8,
                              borderRadius: 5,
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#4FD1C5",
                              },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.projects}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.skills.technology}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.skills.solutionEngineering}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.skills.selfManagement}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.skills.communicationSkills}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.skills.employeeLeadership}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="body2">{employee.location}</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default EmployeeOverview;
