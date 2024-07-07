import React, {useState} from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  LinearProgress,
  Grid,
  IconButton,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditProfile from './../components/EditProfile';
import AvatarBlue from "./../assets/images/icons/blue_avatar.svg";
import { useGetAllEmployeesQuery } from '../state/api/employeeApi';


function EmployeeOverview() {

  const { data: employeesData, error, isLoading, isSuccess } = useGetAllEmployeesQuery();

  console.log('employees: ', employeesData)
  
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };
  const handleCloseEditDialog = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const capitalizeFirstLetter = (location) => {
    const lowercased = location.toLowerCase();
    return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  };

  const concatName = (name, surname) => {
    return name + ' ' + surname;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching employees: {error.message}</Typography>;
  }

if (isSuccess) {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F5F7FA", boxShadow: "none", }}>
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p:1, maxHeight: '80vh', overflowY: 'auto'}}>
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
            {employeesData.map((employee, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                  <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={employee.avatar || AvatarBlue} sx={{ width: 40, height: 40, borderRadius: '15px', overflow: 'hidden' }} />
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
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{ mr: 1, fontSize: '14px', color: "#36C5F0", fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold' }}>{employee.utilization}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={employee.utilization || []}
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
                      <Typography variant="body2">{employee.numberOfProjectsLast3Months || 0}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.technology || 'n/a'}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.solutionEngineering || 'n/a'}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.selfManagement || 'n/a'}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.communicationSkills || 'n/a'}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography className="table-skillset-body">{employee.employeeLeadership || 'n/a'}</Typography>
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
          employee={{ userId: selectedEmployee._id, name: concatName(selectedEmployee.firstName, selectedEmployee.lastName), email: selectedEmployee.email, image: selectedEmployee.avatar || AvatarBlue}} 
          source="Employees"
        />
      )}
    </Box>
  );
 }
}

export default EmployeeOverview;
