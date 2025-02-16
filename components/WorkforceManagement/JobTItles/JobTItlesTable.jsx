import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import JobTitlesForm from '@/components/WorkforceManagement/JobTitles/JobTItlesForm';
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
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

const AddJobTitlesButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const JobTitlesTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobTitles, setJobTitles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogWidth, setDialogWidth] = useState('md');

  const fetchJobTitles = async () => {
    try {
      const response = await axios.get('/api/WorkforceManagement/JobTitles/');
      setJobTitles(response.data);
    } catch (error) {
      console.error('Error fetching job titles:', error);
    }
  };

  useEffect(() => {
    fetchJobTitles();
  }, []);

  const filteredJobTitles = jobTitles.filter(jobTitle =>
    jobTitle.jobtitlename.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDialogOpen = (content, title, width = 'md') => {
    setDialogContent(content);
    setDialogTitle(title);
    setDialogWidth(width);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
    setDialogTitle('');
    setDialogWidth('md');
    fetchJobTitles(); // Refetch job titles after closing the dialog
  };

  const handleDeleteJobTitle = async (jobTitleId) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this job title?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await axios.delete(`/api/WorkforceManagement/JobTitles/delete-jobTitle`, { data: { jobtitleid: jobTitleId } });
          Swal.fire(
            'Deleted!',
            'Job title has been deleted.',
            'success'
          );
          fetchJobTitles(); // Refetch job titles after deletion
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the job title.',
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
          placeholder='Search by Job Title Name'
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
        <AddJobTitlesButton variant="contained" onClick={() => handleDialogOpen(<JobTitlesForm handleClose={handleDialogClose} />, 'Add Job Title')}>
          Add Job Title
        </AddJobTitlesButton>
      </Box>
      <DialogForm
        title={dialogTitle}
        content={dialogContent}
        open={isDialogOpen}
        onClose={handleDialogClose}
        width={dialogWidth}
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Title Name</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredJobTitles.length > 0 ? (
              filteredJobTitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(jobTitle => (
                <TableRow key={jobTitle.jobtitleid} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{jobTitle.jobtitlename}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleDialogOpen(
                        <JobTitlesForm 
                          handleClose={handleDialogClose} 
                          jobTitleId={jobTitle.jobtitleid} 
                          jobTitleName={jobTitle.jobtitlename} 
                        />, 
                        'Edit Job Title', 
                        'lg'
                      )}>
                        <IoPencil />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: '#E7858B' }} onClick={() => handleDeleteJobTitle(jobTitle.jobtitleid)}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
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
          count={filteredJobTitles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default JobTitlesTable;