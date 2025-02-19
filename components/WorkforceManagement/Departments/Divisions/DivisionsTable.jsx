import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, Tooltip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import DivisionsForm from './DivisionsForm';
import { MdFormatListBulletedAdd, MdDelete } from "react-icons/md";
import { IoPencil, IoEyeOutline } from "react-icons/io5";
import axios from 'axios';
import Swal from 'sweetalert2';

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

const DivisionsTable = ({ DepartmentID }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [divisions, setDivisions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get('/api/WorkforceManagement/Departments/Divisions/');
      const filteredDivisions = response.data.filter(division => division.departmentid === DepartmentID);
      setDivisions(filteredDivisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, [DepartmentID]);

  const filteredDivisions = divisions.filter(division =>
    division.depdivisioname.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDialogOpen = (division = null) => {
    setSelectedDivision(division);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchDivisions(); // Refetch divisions after closing the dialog
  };

  const handleDeleteDivision = async (depdivisionid) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this division?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await axios.delete(`/api/WorkforceManagement/Departments/Divisions/delete-division`, { data: { depdivisionid } });
          Swal.fire(
            'Deleted!',
            'Division has been deleted.',
            'success'
          );
          fetchDivisions(); // Refetch divisions after deletion
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the division.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder='Search by Division Name'
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
          Add Division
        </AddDepartmentsButton>
      </Box>
      <DialogForm
        title={selectedDivision ? "Edit Division" : "Add Division"}
        content={<DivisionsForm handleClose={handleDialogClose} divisionData={selectedDivision} DepartmentID={DepartmentID} />}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Division</TableCell>
              <TableCell>Description</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredDivisions.length > 0 ? (
              filteredDivisions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(division => (
                <TableRow key={division.depdivisionid} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{division.depdivisioname}</TableCell>
                  <TableCell>{division.description}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleDialogOpen(division)}>
                        <IoPencil />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: '#E7858B' }} onClick={() => handleDeleteDivision(division.depdivisionid)}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
          count={filteredDivisions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default DivisionsTable;