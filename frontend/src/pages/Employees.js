import React, {useState} from "react";
import {
  Box,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Button
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditProfile from './../components/EditProfile';
import CreateProfile from "../components/employee/create/CreateProfile";
import AvatarBlue from "./../assets/images/icons/blue_avatar.svg";
import { useGetAllEmployeesQuery } from '../state/api/employeeApi';
import { useGetSkillsQuery } from '../state/api/skillApi';

function EmployeeOverview() {

  const { data: employeesData, error, isLoading, isSuccess, refetch} = useGetAllEmployeesQuery();
  const { data: skillsData, errorLoadingSkill, isLoadingSkill } = useGetSkillsQuery();

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


  if (isLoading || isLoadingSkill) {
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

  if (error || errorLoadingSkill) {
    return (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#F5F7FA',
            boxShadow: 'none',
          }}
        > 
          <Typography color="error">Error fetching employees: {error.message + ' ' + errorLoadingSkill.message}</Typography>
        </Box>
    );
  }

if (isSuccess) {
 return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#F5F7FA",
          boxShadow: "none",
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Button
              variant="contained"
              color="profBlue"
              fullWidth
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                color: "white",
                height: "40px",
                fontFamily: "Helvetica, sans-serif",
                fontWeight: "Bold",
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "0",
                width: "140px",
                padding: 0,
              }}
              onClick={handleAddEmployee}
            >
              + Add Employee
            </Button>
          </Box>
          <Box sx={{ bgcolor: "white", borderRadius: "12px", pt: 2, pr: 2, pl: 2, boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)", maxWidth: "158vh", overflowX: "auto"}}>
          <Typography
            sx={{
              fontFamily: 'Helvetica, sans-serif',
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '0',
              fontWeight: 'bold',
              color: '#2D3748',
              marginLeft: '14px'
            }}
          >
            Employee Overview
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography className="table-title">PERSON</Typography></TableCell>
                  <TableCell><Typography className="table-title"># PROJECTS</Typography></TableCell>
                  {skillsData &&
                    skillsData.data.map((skill) => (
                      <TableCell key={skill._id}>
                        <Typography className="table-title">
                          {skill.name.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                    ))}
                  <TableCell><Typography className="table-title">LOCATION</Typography></TableCell>
                  <TableCell><Typography className="table-title">EDIT</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeesData.map((employee, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={employee.avatar || AvatarBlue}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          />
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="body2">
                              {employee.firstName + " " + employee.lastName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Halvetica, sans-serif",
                                fontSize: "14px",
                                lineHeight: "140%",
                                letterSpacing: "0px",
                                color: "#718096",
                              }}
                            >
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {employee.numberOfProjectsLast3Months || 0}
                        </Typography>
                      </TableCell>
                      {skillsData &&
                        skillsData.data.map((skill) => {
                          const employeeSkill = employee.skills.find(
                            (s) => s.skillCategory === skill.name
                          );
                          return (
                            <TableCell 
                              key={skill._id}
                              sx={{
                                borderBottom: '1px solid #E0E0E0', 
                                borderTop: 0,
                                borderLeft: 0,
                                borderRight: 0,
                              }}
                            >
                              <Typography className="table-skillset-body">
                                {employeeSkill
                                  ? employeeSkill.skillPoints
                                  : 0}
                                /
                                {employeeSkill
                                  ? employeeSkill.maxSkillPoints
                                  : 0}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      <TableCell>
                        <Typography variant="body2">
                          {capitalizeFirstLetter(employee.officeLocation)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(employee)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </Box>
        {selectedEmployee && (
          <EditProfile
            open={open}
            onClose={handleCloseEditDialog}
            employee={{
              userId: selectedEmployee._id,
              name: concatName(
                selectedEmployee.firstName,
                selectedEmployee.lastName
              ),
              email: selectedEmployee.email,
            }}
            source="Employees"
          />
        )}
        <CreateProfile
          openCreate={openCreate}
          onCloseCreate={handleCloseCreateDialog}
          onBackCreate={handleOnBack}
        />
      </Box>
    );
  }
}

export default EmployeeOverview;
