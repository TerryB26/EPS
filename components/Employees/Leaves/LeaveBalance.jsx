import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import axios from 'axios';
import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';

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

const LeaveBalance = ({user}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveBalances = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`/api/Leaves/LeaveBalance`);
      const filteredData = response.data.filter(leaveBalance => leaveBalance.employeeid === user.employeeid);
      setLeaveBalances(filteredData);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const filteredLeaveBalances = leaveBalances.filter(leaveBalance =>
    leaveBalance.requesttype?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leaveBalance.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder="Search by Leave Name or Description"
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
          startIcon={<SearchOffIcon />}
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
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Leave Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredLeaveBalances.length > 0 ? (
              filteredLeaveBalances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leaveBalance, index) => (
                <TableRow key={index} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{leaveBalance.requesttype}</TableCell>
                  <TableCell>{leaveBalance.description}</TableCell>
                  <TableCell>{leaveBalance.remainingbalance}</TableCell>
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