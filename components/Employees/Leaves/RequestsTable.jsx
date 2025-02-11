import React, { useState } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import { MdDelete } from "react-icons/md";
import { IoPencil, IoEyeOutline } from "react-icons/io5";

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

const AddRequestButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const RequestsTable = ({WhereStatus}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requests] = useState([
    { id: 1, employeeNumber: 'E001', name: 'John Doe', dateOfRequest: '2025-02-01', status: 'Pending' },
    { id: 2, employeeNumber: 'E002', name: 'Jane Smith', dateOfRequest: '2025-02-02', status: 'Approved' },
    { id: 3, employeeNumber: 'E003', name: 'Mike Johnson', dateOfRequest: '2025-02-03', status: 'Rejected' },
    { id: 4, employeeNumber: 'E001', name: 'John Doe', dateOfRequest: '2025-02-01', status: 'Pending' },
    { id: 5, employeeNumber: 'E002', name: 'Jane Smith', dateOfRequest: '2025-02-02', status: 'Approved' },
    { id: 6, employeeNumber: 'E003', name: 'Mike Johnson', dateOfRequest: '2025-02-03', status: 'Rejected' },
    { id: 7, employeeNumber: 'E001', name: 'John Doe', dateOfRequest: '2025-02-01', status: 'Pending' },
    { id: 8, employeeNumber: 'E002', name: 'Jane Smith', dateOfRequest: '2025-02-02', status: 'Approved' },
    { id: 9, employeeNumber: 'E003', name: 'Mike Johnson', dateOfRequest: '2025-02-03', status: 'Rejected' },
    { id: 10, employeeNumber: 'E003', name: 'Mike Johnson', dateOfRequest: '2025-02-03', status: 'Pending' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder='Search by Employee Name or Number'
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
        <AddRequestButton variant="contained" onClick={handleDialogOpen}>
          Add Request
        </AddRequestButton>
      </Box>
      <DialogForm
        title="Add Request"
        content={<div>Add Request Form</div>}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(request => (
                <TableRow key={request.id} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{request.employeeNumber}</TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.dateOfRequest}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                    <Tooltip title="View">
                      <IconButton sx={{ color: '#82D8FF' }}>
                        <IoEyeOutline />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton>
                        <IoPencil />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: '#E7858B' }}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default RequestsTable;