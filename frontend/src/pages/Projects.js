import React, { useState } from "react";
import { Box, Typography, Button, Divider, Avatar, AvatarGroup, IconButton, LinearProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { projectApi } from "../state/api/projectApi.js";
import EditProject from './../components/EditProject';
import FullScreenLoader from './FullScreenLoader.js';
import AvatarGreen from "./../assets/images/icons/green_avatar.svg";
import CreateProject from "../components/projects/create/CreateProjects.js";

function ProjectOverview() {
  const { data: projectData, isError, isLoading, isSuccess, refetch } = projectApi.endpoints.getAllProjects.useQuery();

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  console.log('project', projectData)

  const handleAddProject = () => {
    setOpenCreate(true);
  };
  
  const handleCloseCreateDialog = () => {
    refetch();
    setOpenCreate(false);
  };

  const handleOnBack = () => {
    setOpenCreate(false);
  };

  const handleOpenEditDialog = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    refetch();
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

  const calculateStaffingRate = (demand, allocatedFtes) => {
    if (demand > 0) return Math.ceil((allocatedFtes / demand) * 100);
    else return 0;
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', color: '#A0AEC0', fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>
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
                      <Avatar src={project.icon || AvatarGreen} sx={{ width: 40, height: 40, borderRadius: '10px', overflow: 'hidden' }} />
                      <Typography sx={{ ml: '8px' }} variant="body2">{project.projectName}</Typography>
                    </Box>
                    <Box sx={{ width: '15%' }}>
                      <AvatarGroup max={4} sx={{ 
                        '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 'small' },
                        flexDirection: 'row', 
                        ml: '14px'
                      }}>
                        {(project.assignedEmployees).map((avatar, index) => (
                          <Avatar key={index} src={avatar} />
                        ))}
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.numberOfDemandedEmployees || 0} FTE</Typography>
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.assignedEmployees.length ? 'Started' : 'Not Started'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                      <Typography sx={{ mr: 1, color: {
                        color:
                        calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) >= 80 ? "#4FD1C5" : // Türkis bei 80% oder höher
                        calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) > 20 ? "#ECB22E" : // Gelb zwischen 20% und 80%
                        "#DC395F", // Rot bei 20% oder weniger
                      },
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 'bold',
                      }}>{calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) || 0}%</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) || 0}
                        sx={{
                          width: '60%',
                          height: '6px',
                          borderRadius: 5,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                            calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) >= 80
                                ? '#4FD1C5' // Türkis bei 80% oder höher
                                : calculateStaffingRate(project.numberOfDemandedEmployees, project.assignedEmployees.length) > 20
                                ? '#ECB22E' // Gelb zwischen 20% und 80%
                                : '#DC395F', // Rot bei 20% oder weniger
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '10%' }}>
                      <Typography variant="body2">{project.priority ? project.priority.toLowerCase() : 'N/A'}</Typography>
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
          <EditProject open={open} onClose={handleCloseEditDialog} project={{ projectId: selectedProject._id, name: selectedProject.projectName, company: selectedProject.company }} />
        )}
        <CreateProject openCreate={openCreate} onCloseCreate={handleCloseCreateDialog} onBackCreate={handleOnBack}/>
      </Box>
    );
  }
}

export default ProjectOverview;
