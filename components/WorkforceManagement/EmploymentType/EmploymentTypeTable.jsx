import DialogForm from '@/components/General/DialogForm';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { MdDelete, MdFormatListBulletedAdd } from "react-icons/md";
import Swal from 'sweetalert2';
import EmploymentTypeForm from './EmploymentTypeForm';

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

const AddEmpTypesButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const EmploymentTypeTable = ({user}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [EmpTypes, setEmpTypes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');

  const fetchEmpTypes = async () => {
    try {
      const response = await axios.get('/api/WorkforceManagement/EmploymentType/');
      setEmpTypes(response.data);
    } catch (error) {
      console.error('Error fetching employment types:', error);
    }
  };

  useEffect(() => {
    fetchEmpTypes();
  }, []);

  const filteredEmpTypes = EmpTypes.filter(empType =>
    empType.employmenttypename.toLowerCase().includes(searchQuery.toLowerCase())
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
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
    setDialogTitle('');
    fetchEmpTypes();
  };

  const handleDeleteEmploymentType = async (employmentTypeID) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this employment type?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await axios.delete(`/api/WorkforceManagement/EmploymentType/delete-employmentType`, { data: { employmenttypeid: employmentTypeID } });
          Swal.fire(
            'Deleted!',
            'Employment type has been deleted.',
            'success'
          );
          fetchEmpTypes(); // Refetch employment types after deletion
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the employment type.',
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
          placeholder='Search by Employment Type Name'
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
        <AddEmpTypesButton variant="contained" endIcon={<MdFormatListBulletedAdd />} onClick={() => handleDialogOpen(<EmploymentTypeForm handleClose={handleDialogClose} user={user}/>, 'Add Employment Type')}>
          Add Employment Type
        </AddEmpTypesButton>
      </Box>
      <DialogForm
        title={dialogTitle}
        content={dialogContent}
        open={isDialogOpen}
        onClose={handleDialogClose}
        width='sm'
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredEmpTypes.length > 0 ? (
              filteredEmpTypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(empType => (
                <TableRow key={empType.employmenttypeid} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{empType.employmenttypename}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                  {/* <Tooltip title="Edit">
                    <IconButton onClick={() => handleDialogOpen(
                      <EmploymentTypeForm 
                        handleClose={handleDialogClose} 
                        employmentTypeId={empType.employmenttypeid} 
                        employmentTypeName={empType.employmenttypename} 
                      />, 
                      'Edit Employment Type', 
                      'lg'
                    )}>
                      <IoPencil />
                    </IconButton>
                  </Tooltip> */}
                    <Tooltip title="Delete">
                      {user?.roleName === 'Dev' || user?.roleName === 'Developer' ? (
                        <IconButton sx={{ color: '#E7858B' }} onClick={() => handleDeleteEmploymentType(empType.employmenttypeid)}>
                          <MdDelete />
                        </IconButton>
                      ) : null}
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
          count={filteredEmpTypes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default EmploymentTypeTable;