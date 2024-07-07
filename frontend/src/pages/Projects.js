import React, { useState } from "react";
import { Box, Typography, Button, Divider, Avatar, AvatarGroup, IconButton, LinearProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { projectApi } from "../state/api/projectApi.js";
import EditProject from './../components/EditProject';
import FullScreenLoader from './FullScreenLoader.js';

function ProjectOverview() {
  const {
    data: projectData,
    isError,
    isLoading,
    isSuccess,
  } = projectApi.endpoints.getAllProjects.useQuery();

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

  const calculateDaysLeft = (kickoffDate) => {
    const currentDate = new Date();
    const startDate = new Date(kickoffDate);
    const diffTime = startDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(diffDays < 0) return 'Started';
    else return `${diffDays} Days left`;
  };


  if (isError) {
    return (
      <>
        <p>isError</p>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <FullScreenLoader />
      </>
    );
  }

  if (isSuccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: '#F5F7FA',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
                padding: 0,
              }}
              onClick={handleAddProject}
            >
              + Add Project
            </Button>
          </Box>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '12px',
              p: 2,
              boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Helvetica, sans-serif',
                fontSize: '18px',
                lineHeight: '140%',
                letterSpacing: '0',
                fontWeight: 'bold',
                color: '#2D3748',
                marginBottom: 2,
                marginLeft: '6px',
              }}
            >
              Current Projects
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  color: '#A0AEC0',
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                <Box sx={{ width: '25%', paddingLeft: 1 }}>
                  <Typography className="table-title">PROJECT TITLE</Typography>
                </Box>
                <Box sx={{ width: '15%' }}>
                  <Typography className="table-title">
                    ALLOCATED FTEs
                  </Typography>
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
              {projectData.projects.map((project, index) => (
                <React.Fragment key={index}>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '25%', paddingLeft: 1 }}>
                      <Avatar src={project.icon || ''} sx={{ "& .MuiAvatar-img": { width: 24, height: 24 }, 
                        "& .MuiAvatar-root": { borderRadius: '15px', overflow: 'hidden' } }} />
                      <Typography sx={{ ml: '8px' }} variant="body2">{project.projectName}</Typography>
                    </Box>
                    <Box sx={{ width: '15%' }}>
                      <AvatarGroup max={4} sx={{ 
                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 'small' },
                        flexDirection: 'row', 
                        ml: '14px'
                      }}>
                        {(project.avatars || []).map((avatar, index) => (
                          <Avatar key={index} src={avatar} />
                        ))}
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.fte || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.status || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                      <Typography sx={{ mr: 1, color: {
                        color:
                        project.capacity >= '80%' ? "#4FD1C5" : // Türkis bei 80% oder höher
                        project.capacity > '20%' ? "#ECB22E" : // Gelb zwischen 20% und 80%
                        "#DC395F", // Rot bei 20% oder weniger
                      },
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 'bold',
                      }}>{project.capacity || '0%'}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(project.capacity) || 0}
                        sx={{
                          width: '60%',
                          height: '6px',
                          borderRadius: 5,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              project.capacity >= '80%'
                                ? '#4FD1C5' // Türkis bei 80% oder höher
                                : project.capacity > '20%'
                                ? '#ECB22E' // Gelb zwischen 20% und 80%
                                : '#DC395F', // Rot bei 20% oder weniger
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.priority.toLowerCase()}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{calculateDaysLeft(project.kickoffDate)}</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(project)}
                      >
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
          <EditProject open={open} onClose={handleCloseEditDialog} project={{ name: selectedProject.projectName, company: selectedProject.company, image: selectedProject.icon }} />
        )}
      </Box>
    );
  }
}

export default ProjectOverview;
