import React, { useState } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
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

const AddLeaveBalanceButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const LeaveBalance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [leaveBalances] = useState([
    { id: 1, employeeNumber: 'E001', name: 'John Doe', leaveType: 'Annual Leave', balance: 10 },
    { id: 2, employeeNumber: 'E001', name: 'John Doe', leaveType: 'Sick Leave', balance: 5 },
    { id: 3, employeeNumber: 'E001', name: 'John Doe', leaveType: 'Casual Leave', balance: 8 },
    { id: 4, employeeNumber: 'E002', name: 'Jane Smith', leaveType: 'Annual Leave', balance: 12 },
    { id: 5, employeeNumber: 'E002', name: 'Jane Smith', leaveType: 'Sick Leave', balance: 7 },
    { id: 6, employeeNumber: 'E003', name: 'Mike Johnson', leaveType: 'Annual Leave', balance: 15 },
    { id: 7, employeeNumber: 'E003', name: 'Mike Johnson', leaveType: 'Sick Leave', balance: 6 },
    { id: 8, employeeNumber: 'E003', name: 'Mike Johnson', leaveType: 'Casual Leave', balance: 9 },
  ]);

  const filteredLeaveBalances = leaveBalances.filter(leaveBalance =>
    leaveBalance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leaveBalance.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leaveBalance.leaveType.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder='Search by Employee Name, Number or Leave Type'
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
        <AddLeaveBalanceButton variant="contained">
          Add Leave Balance
        </AddLeaveBalanceButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Balance</TableCell>
              {/* <TableCell sx={{ width: '150px' }}>Actions</TableCell> */}
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredLeaveBalances.length > 0 ? (
              filteredLeaveBalances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(leaveBalance => (
                <TableRow key={leaveBalance.id} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{leaveBalance.employeeNumber}</TableCell>
                  <TableCell>{leaveBalance.name}</TableCell>
                  <TableCell>{leaveBalance.leaveType}</TableCell>
                  <TableCell>{leaveBalance.balance}</TableCell>
                  {/* <TableCell sx={{ width: '150px' }}>
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
                  </TableCell> */}
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
          count={filteredLeaveBalances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default LeaveBalance;