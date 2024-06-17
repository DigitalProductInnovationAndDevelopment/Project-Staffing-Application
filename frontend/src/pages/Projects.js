import React, { useState } from "react";
import { Box, Typography, Button, Divider, Avatar, AvatarGroup, IconButton, LinearProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import spotifyIcon from './../assets/images/icons/spotify-2 1.svg';
import slackIcon from './../assets/images/icons/slack-new-logo 1.svg';
import JiraIcon from './../assets/images/icons/jira-3 1.svg';
import AdobeIcon from './../assets/images/icons/Adobe_XD_CC_icon 1.svg';
import AltassianIcon from './../assets/images/icons/Icon.svg';
import { projectApi } from "../state/api/projectApi.js";
import EditProject from './../components/EditProject';

function ProjectOverview() {
  const { data: projectData, isError, isLoading, isSuccess } = projectApi.endpoints.getAllProjects.useQuery();

  const projects = [
    {
      icon: AdobeIcon,
      title: "Mobile App Performance",
      company: "Itestra",
      avatars: [
        "/mnt/data/A_professional-looking_avatar_of_a_person_with_a_f.png",
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
      icon: slackIcon,
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
      icon: JiraIcon,
      title: "Fix Platform Errors",
      company: "Company C",
      avatars: [],
      fte: "4 FTE",
      capacity: "0%",
      status: "Not Started",
      priority: "normal",
      daysLeft: "20 Days left",
    },
    {
      icon: spotifyIcon,
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
      icon: AltassianIcon,
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

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddProject = () => {
    // Add save logic here
    //onClose();
  };

  const handleOpenEditDialog = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  if (isError) {
    console.log("isError");
    return (
      <>
        <p>isError</p>
      </>
    );
  }

  if (isLoading) {
    console.log("isLoading");
    return (
      <>
        <p>isLoading</p>
      </>
    );
  }

  if (isSuccess) {
    console.log("isSuccess");
    return (
      <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none" }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Button 
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                color: 'white',
                height: '40px',
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 'Bold',
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0',
                width: '120px',
                padding: 0
              }}
              onClick={handleAddProject}
            >
              + Add Project
            </Button>
          </Box>
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
              >Current Projects</Typography>

              {/* DISPLAY FETCHED DATA FROM BACKEND */}
              {/* 
        
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>Project Names</Typography>
                <ul>
                  {projectData.projects.map((project) => (
                  <li key={project._id}>{project.projectName}</li>
                  ))}
                </ul>
              </Box>
        
              */}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', color: '#A0AEC0', fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>
                <Box sx={{ width: '25%', paddingLeft: 1 }}>
                  <Typography className="table-title">PROJECT TITLE</Typography>
                </Box>
                <Box sx={{ width: '15%' }}>
                  <Typography className="table-title">ALLOCATED FTEs</Typography>
                </Box>
                <Box sx={{ width: '10%' }}>
                  <Typography className="table-title">DEMAND</Typography>
                </Box>
                <Box sx={{ width: '10%' }}>
                  <Typography className="table-title">ASSIGN</Typography>
                </Box>
                <Box sx={{ width: '20%' }}>
                  <Typography className="table-title">STAFFING RATE</Typography>
                </Box>
                <Box sx={{ width: '10%' }}>
                  <Typography className="table-title">PRIORITY</Typography>
                </Box>
                <Box sx={{ width: '10%' }}>
                  <Typography className="table-title">START DATE</Typography>
                </Box>
                <Box sx={{ width: '10%' }}>
                  <Typography className="table-title">EDIT</Typography>
                </Box>
              </Box>
              {projects.map((project, index) => (
                <React.Fragment key={index}>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '25%', paddingLeft: 1 }}>
                      <Avatar src={project.icon} sx={{ "& .MuiAvatar-img": { width: 24, height: 24, }, 
                        "& .MuiAvatar-root": { borderRadius: '15px', overflow: 'hidden' } }} />
                      <Typography variant="body2">{project.title}</Typography>
                    </Box>
                    <Box sx={{ width: '15%' }}>
                      <AvatarGroup max={4} sx={{ 
                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 'small' },
                        flexDirection: 'row', 
                        ml: '14px'
                      }}>
                        {project.avatars.map((avatar, index) => (
                          <Avatar key={index} src={avatar} />
                        ))}
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.fte}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.status}</Typography>
                    </Box>
                    <Box sx={{  display: 'flex', flexDirection: 'column', width: '20%' }}>
                      <Typography sx={{ mr: 1, color: {
                        color:
                        project.capacity >= '80%' ? "#4FD1C5" : // Türkis bei 80% oder höher
                        project.capacity > '20%' ? "#ECB22E" : // Gelb zwischen 20% und 80%
                        "#DC395F", // Rot bei 20% oder weniger
                      },
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 'bold',
                      }}>{project.capacity}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(project.capacity)}
                        sx={{
                          width: "60%",
                          height: '6px',
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
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.priority}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.daysLeft}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <IconButton size="small" onClick={() => handleOpenEditDialog(project)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
        {selectedProject && (
          <EditProject open={open} onClose={handleCloseEditDialog} project={{ name: selectedProject.title, company: selectedProject.company, image: selectedProject.icon }} />
        )}
      </Box>
    );
  }
}

export default ProjectOverview;
