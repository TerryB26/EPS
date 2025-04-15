import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, Tooltip, IconButton, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import DepartmentsForm from './DepartmentsForm';
import { MdFormatListBulletedAdd, MdDelete } from "react-icons/md";
import { IoPencil, IoChevronDownCircleOutline } from "react-icons/io5";
import axios from 'axios';
import Swal from 'sweetalert2';
import DivisionsTable from '@/components/WorkforceManagement/Departments/Divisions/DivisionsTable';

const PaginationContainer = styled('div')(({ theme }) => ({
  '& .MuiTablePagination-selectRoot': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiTablePagination-select': {
    minWidth: '50px',
  },
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#ECEBF9',
}));

const AddDepartmentsButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const DepartmentsTable = ({user}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/WorkforceManagement/Departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter(department =>
    department.departmentname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDialogOpen = (department = null) => {
    setSelectedDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchDepartments();
  };

  const handleDeleteDepartment = async (departmentID) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this department?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await axios.delete(`/api/WorkforceManagement/Departments/delete-department`, { data: { departmentID } });
          Swal.fire(
            'Deleted!',
            'Department has been deleted.',
            'success'
          );
          fetchDepartments(); // Refetch departments after deletion
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the department.',
            'error'
          );
        }
      }
    });
  };

  const handleRowClick = (departmentID) => {
    setExpandedRows((prevState) => ({
      [departmentID]: !prevState[departmentID], 
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder='Search by Department Name'
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          style={{ marginRight: '20px' }}
          InputProps={{
            style: {
              height: '40px',
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#550000',
              },
              '&:hover fieldset': {
                borderColor: '#ff0000',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#550000',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearSearch}
          startIcon={<SearchOffIcon sx={{ color: '#550000' }} />}
          sx={{
            height: '40px',
            backgroundColor: 'white',
            border: '1px solid #550000',
            color: '#550000',
            '&:hover': {
              backgroundColor: 'white',
              border: '1px solid #ff0000',
              color: '#ff0000',
            },
          }}
        >
          Clear
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <AddDepartmentsButton variant="contained" onClick={() => handleDialogOpen()} endIcon={<MdFormatListBulletedAdd />}>
          Add Department
        </AddDepartmentsButton>
      </Box>
      <DialogForm
        title={selectedDepartment ? "Edit Department" : "Add Department"}
        content={<DepartmentsForm handleClose={handleDialogClose} departmentData={selectedDepartment} user={user}/>}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell />
              <TableCell>Department</TableCell>
              <TableCell>Description</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(department => (
                <React.Fragment key={department.departmentid}>
                  <TableRow sx={{
                    '&:hover': {
                      backgroundColor: '#E4F2FF',
                    },
                  }}>
                    <TableCell>
                      <IconButton onClick={() => handleRowClick(department.departmentid)}>
                        <IoChevronDownCircleOutline />
                      </IconButton>
                    </TableCell>
                    <TableCell>{department.departmentname}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell sx={{ width: '150px' }}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleDialogOpen(department)}>
                          <IoPencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton sx={{ color: '#E7858B' }} onClick={() => handleDeleteDepartment(department.departmentid)}>
                          <MdDelete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedRows[department.departmentid]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Paper style={{ fontFamily: 'Roboto', padding: '20px', margin: '20px', boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.5)' }}>
                            <DivisionsTable DepartmentID={department.departmentid} user={user}/>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No records to display
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDepartments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default DepartmentsTable;