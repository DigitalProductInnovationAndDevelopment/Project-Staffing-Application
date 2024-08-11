import React, {useState} from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
 //LinearProgress,
  Grid,
  IconButton,
  CircularProgress,
  Button
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditProfile from './../components/EditProfile';
import CreateProfile from "../components/employee/create/CreateProfile";
import AvatarBlue from "./../assets/images/icons/blue_avatar.svg";
import { useGetAllEmployeesQuery } from '../state/api/employeeApi';


function EmployeeOverview() {

  const { data: employeesData, error, isLoading, isSuccess, refetch} = useGetAllEmployeesQuery();
  
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleAddEmployee = () => {
    setOpenCreate(true);
  };

  const handleOpenEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleCloseEditDialog = () => {
    refetch();
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleCloseCreateDialog = () => {
    refetch();
    setOpenCreate(false);
  };

  const handleOnBack = () => {
    setOpenCreate(false);
  };
  

  const capitalizeFirstLetter = (location) => {
    const lowercased = location.toLowerCase();
    return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  };

  const concatName = (name, surname) => {
    return name + ' ' + surname;
  };

//   const calculateUtilization = (projectWorkingHourDistributionInPercentage) => {
//     const projectData = Object.entries(projectWorkingHourDistributionInPercentage).map(([projectId, percentage]) => ({
//       value: parseFloat(percentage),
//     }));
  
//     const allocatedHours = projectData.reduce((sum, project) => sum + project.value, 0);

//     return allocatedHours;
//   };


  if (isLoading) {
    return (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#F5F7FA',
            boxShadow: 'none',
          }}
        >
            <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#F5F7FA',
            boxShadow: 'none',
          }}
        > 
          <Typography color="error">Error fetching employees: {error.message}</Typography>
        </Box>
    );
  }

if (isSuccess) {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none", }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3}}>
            <Button
              variant="contained"
              color="profBlue"
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
                width: '140px',
                padding: 0,
              }}
              onClick={handleAddEmployee}
            >
              + Add Employee
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
          >
            Employee Overview
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p:1, maxHeight: '80vh', overflowY: 'auto'}}>
            <Box sx={{ display: 'flex', color: '#A0AEC0', fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>
              <Grid container>
                <Grid item xs={2.5}>
                  <Typography className="table-title">PERSON</Typography>
                </Grid>
                {/* <Grid item xs={2}>
                  <Typography className="table-title">CURRENT UTILIZATION</Typography>
                </Grid> */}
                <Grid item xs={1}>
                  <Typography className="table-title"># PROJECTS</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Technology</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography className="table-title">Solution Engineering</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography className="table-title">Self Management</Typography>
                </Grid>
                <Grid item xs={1.2}>
                  <Typography className="table-title">Communication Skills</Typography>
                </Grid>
                <Grid item xs={1.6}>
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
            {employeesData.map((employee, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                  <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={2.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={employee.avatar || AvatarBlue} sx={{ width: 40, height: 40, borderRadius: '10px', overflow: 'hidden' }} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2">{employee.firstName + ' ' + employee.lastName}</Typography>
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
                    {/* <Grid item xs={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{ mr: 1, fontSize: '14px', color: "#36C5F0", fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>{calculateUtilization(employee.projectWorkingHourDistributionInPercentage)}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={calculateUtilization(employee.projectWorkingHourDistributionInPercentage)}
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
                    </Grid> */}
                    <Grid item xs={1}>
                        <Typography variant="body2" >{employee.numberOfProjectsLast3Months || 0}</Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                      <Typography className="table-skillset-body">{employee.skills.find(skill => skill.skillCategory === 'TECHNOLOGY') ?
                        employee.skills.find(skill => skill.skillCategory === 'TECHNOLOGY').skillPoints : 0}/
                        {employee.skills.find(skill => skill.skillCategory === 'TECHNOLOGY') ?
                        employee.skills.find(skill => skill.skillCategory === 'TECHNOLOGY').maxSkillPoints : 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                      <Typography className="table-skillset-body">{employee.skills.find(skill => skill.skillCategory === 'SOLUTION_ENGINEERING') ?
                        employee.skills.find(skill => skill.skillCategory === 'SOLUTION_ENGINEERING').skillPoints : 0}/
                        {employee.skills.find(skill => skill.skillCategory === 'SOLUTION_ENGINEERING') ?
                        employee.skills.find(skill => skill.skillCategory === 'SOLUTION_ENGINEERING').maxSkillPoints : 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                      <Typography className="table-skillset-body">{employee.skills.find(skill => skill.skillCategory === 'SELF_MANAGEMENT') ?
                        employee.skills.find(skill => skill.skillCategory === 'SELF_MANAGEMENT').skillPoints : 0}/
                        {employee.skills.find(skill => skill.skillCategory === 'SELF_MANAGEMENT') ?
                        employee.skills.find(skill => skill.skillCategory === 'SELF_MANAGEMENT').maxSkillPoints : 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                      <Typography className="table-skillset-body">{employee.skills.find(skill => skill.skillCategory === 'COMMUNICATION_SKILLS') ?
                        employee.skills.find(skill => skill.skillCategory === 'COMMUNICATION_SKILLS').skillPoints : 0}/
                        {employee.skills.find(skill => skill.skillCategory === 'COMMUNICATION_SKILLS') ?
                        employee.skills.find(skill => skill.skillCategory === 'COMMUNICATION_SKILLS').maxSkillPoints : 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.2}>
                      <Typography className="table-skillset-body">{employee.skills.find(skill => skill.skillCategory === 'EMPLOYEE_LEADERSHIP') ?
                        employee.skills.find(skill => skill.skillCategory === 'EMPLOYEE_LEADERSHIP').skillPoints : 0}/
                        {employee.skills.find(skill => skill.skillCategory === 'EMPLOYEE_LEADERSHIP') ?
                        employee.skills.find(skill => skill.skillCategory === 'EMPLOYEE_LEADERSHIP').maxSkillPoints : 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body2">{capitalizeFirstLetter(employee.officeLocation)}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton size="small" onClick={() => handleOpenEditDialog(employee)}>
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
      {selectedEmployee && (
        <EditProfile open={open} onClose={handleCloseEditDialog}
          employee={{ userId: selectedEmployee._id, name: concatName(selectedEmployee.firstName, selectedEmployee.lastName), email: selectedEmployee.email}} 
          source="Employees"
        />
      )}
      <CreateProfile openCreate={openCreate} onCloseCreate={handleCloseCreateDialog} onBackCreate={handleOnBack}/>
    </Box>
  );
 }
}

export default EmployeeOverview;
