import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  LinearProgress,
  Grid,
  IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarEx from './../assets/images/icons/ex_avatar.jpg';
import AvatarEx2 from './../assets/images/icons/avatar_ex2.jpg';
import AvatarEx3 from './../assets/images/icons/avatar_ex3.jpg';
import AvatarEx4 from './../assets/images/icons/avatar_ex4.jpg';

const employees = [
  {
    name: "Esthera Jackson",
    email: "esthera@itestra.com",
    avatar: AvatarEx,
    utilization: 75,
    projects: 3,
    technology: "5/20",
    solutionEngineering: "11/15",
    selfManagement: "9/15",
    communicationSkills: "12/20",
    employeeLeadership: "13/18",
    location: "Munich"
  },
  {
    name: "Paul Paulsen",
    email: "paul@itestra.com",
    avatar: AvatarEx2,
    utilization: 50,
    projects: 3,
    technology: "5/20",
    solutionEngineering: "11/15",
    selfManagement: "9/15",
    communicationSkills: "12/20",
    employeeLeadership: "13/18",
    location: "Madrid"
  },
  {
    name: "Max Mustermann",
    email: "mustern@itestra.com",
    avatar: AvatarEx3,
    utilization: 75,
    projects: 3,
    technology: "5/20",
    solutionEngineering: "11/15",
    selfManagement: "9/15",
    communicationSkills: "12/20",
    employeeLeadership: "13/18",
    location: "Stockholm"
  },
  {
    name: "Peter Drucker",
    email: "drucker@itestra.com",
    avatar: AvatarEx4,
    utilization: 75,
    projects: 3,
    technology: "5/20",
    solutionEngineering: "11/15",
    selfManagement: "9/15",
    communicationSkills: "12/20",
    employeeLeadership: "13/18",
    location: "Tallin"
  },
  {
    name: "Andrew Ng",
    email: "ng@itestra.com",
    avatar: "",
    utilization: 75,
    projects: 3,
    technology: "5/20",
    solutionEngineering: "11/15",
    selfManagement: "9/15",
    communicationSkills: "12/20",
    employeeLeadership: "13/18",
    location: "Munich"
  }
];

function EmployeeOverview() {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ bgcolor: "white", borderRadius: "12px", p: 2, boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)" }}>
          <Typography
            sx={{
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '0',
              fontWeight: 'bold',
              color: '#2D3748',
              marginBottom: 2,
              marginLeft: '6px'
            }}
          >
            Employee Overview
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p:1 }}>
            <Box sx={{ display: 'flex', color: '#A0AEC0', fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>
              <Grid container>
                <Grid item xs={2}>
                  <Typography className="table-title">PERSON</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className="table-title">CURRENT UTILIZATION</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title"># PROJECTS</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Technology</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Solution Engineering</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Self Management</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Communication Skills</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Employee Leadership</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">LOCATION</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">EDIT</Typography>
                </Grid>
              </Grid>
            </Box>
            {employees.map((employee, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                  <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={employee.avatar} sx={{ width: 40, height: 40, borderRadius: '15px', overflow: 'hidden' }} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2">{employee.name}</Typography>
                          <Typography sx={{
                            fontFamily: 'Halvetica, sans-serif',
                            fontSize: '14px',
                            lineHeight: '140%',
                            letterSpacing: '0px',
                            color: '#718096'
                          }}>{employee.email}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{ mr: 1, fontSize: '14px', color: "#36C5F0", fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>{employee.utilization}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={employee.utilization}
                          sx={{
                            width: "60%",
                            height: '6px',
                            borderRadius: 5,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#36C5F0",
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{employee.projects}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.technology}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.solutionEngineering}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.selfManagement}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.communicationSkills}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.employeeLeadership}</Typography>
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
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default EmployeeOverview;
