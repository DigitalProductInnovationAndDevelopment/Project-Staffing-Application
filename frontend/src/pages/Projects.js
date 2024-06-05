import React from "react";
import { Box, Typography, Button, Grid, Divider, Avatar, AvatarGroup, IconButton, LinearProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ProjectOverview() {
  const projects = [
    {
      title: "Mobile App Performance",
      company: "Itestra",
      avatars: [
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
      ],
      fte: "5 FTE",
      capacity: "80%",
      status: "Not Started",
      priority: "high",
      daysLeft: "5 Days left",
    },
    {
      title: "Add Progress Track",
      company: "Company B",
      avatars: [
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
      ],
      fte: "9 FTE",
      capacity: "23%",
      status: "Not Started",
      priority: "normal",
      daysLeft: "14 Days left",
    },
    {
      title: "Fix Platform Errors",
      company: "Company C",
      avatars: [],
      fte: "4 FTE",
      capacity: "10%",
      status: "Not Started",
      priority: "normal",
      daysLeft: "20 Days left",
    },
    {
      title: "Launch our Mobile App",
      company: "Company D",
      avatars: [],
      fte: "11 FTE",
      capacity: "0%",
      status: "Not Started",
      priority: "normal",
      daysLeft: "35 Days left",
    },
    {
      title: "Add the New Pricing Page",
      company: "Company E",
      avatars: [],
      fte: "2 FTE",
      capacity: "0%",
      status: "Not Started",
      priority: "normal",
      daysLeft: "120 Days left",
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none" }}>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4FD1C5",
              '&:hover': {
                backgroundColor: "#66bab2",
              },
              color: "white",
              fontSize: "14px",
              textTransform: "none"
            }}
          >
            + Add Project
          </Button>
        </Box>
        <Box sx={{ bgcolor: "white", borderRadius: "12px", p: 2, fontFamily: 'Helvetica' }}>
        <Typography sx={{ fontWeight: "bold", color: '#2D3748', fontFamily: 'Helvetica', fontSize: '18px',  lineHeight: '140%', fontStyle: 'normal', marginBottom: '20px' }}>Current Projects</Typography>
          <Grid container spacing={2} sx={{ fontWeight: "bold"}}>
            <Grid item xs={12}>
              <Grid container sx={{ fontWeight: "bold", color: '#A0AEC0', fontFamily: 'Helvetica', fontSize: '10px',  lineHeight: '100%', fontStyle: 'normal', marginBottom: '5px'   }}>
                <Grid item xs={3}><Typography variant="body2">PROJECT TITLE</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">ALLOCATED FTEs</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2"> DEMAND</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">ASSIGN</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">STAFFING RATE</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">PRIORITY</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">START DATE</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">EDIT</Typography></Grid>
              </Grid>
            </Grid>
            {projects.map((project, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid container alignItems="left" item xs={12}>
                  <Grid container sx={{ fontSize: "14px" }}>
                    <Grid item xs={3}>
                      <Typography variant="body2">{project.title}</Typography> 
                    </Grid>
                    <Grid container alignItems="left" item xs={2}>
                      <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "small", alignItems: 'left' }}}>
                        {project.avatars.map((avatar, index) => (
                          <Avatar key={index} src={avatar} />
                        ))}
                      </AvatarGroup>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{project.fte}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{project.status}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ mr: 1, color: {
                          color:
                          project.capacity >= '80%' ? "#4FD1C5" : // Türkis bei 80% oder höher
                          project.capacity > '20%' ? "#ECB22E" : // Gelb zwischen 20% und 80%
                          "#DC395F", // Rot bei 20% oder weniger
                        } }}>{project.capacity}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={parseInt(project.capacity)}
                            sx={{
                              width: "60%",
                              height: 8,
                              borderRadius: 5,
                              "& .MuiLinearProgress-bar": {
                                backgroundColor:
                                  project.capacity >= '80%' ? "#4FD1C5" : // Türkis bei 80% oder höher
                                  project.capacity > '20%' ? "#ECB22E" : // Gelb zwischen 20% und 80%
                                  "#DC395F", // Rot bei 20% oder weniger
                              },
                            }}
                          />
                      </Box>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{project.priority}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{project.daysLeft}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
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

export default ProjectOverview;
