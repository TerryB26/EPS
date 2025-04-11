import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Box, IconButton, Tooltip, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DialogForm from '@/components/General/DialogForm';
import FullRequestDetails from '@/components/Employees/Leaves/FullRequestDetails';
import axios from 'axios';
import { MdOutlineExpandCircleDown } from "react-icons/md";
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

const RequestsTable = ({ Status }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requests, setRequests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
    const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('/api/Leaves/LeaveRequests');
      const filteredData = response.data.filter(request => request.leave_status === Status);
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request =>
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.employeenumber.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleExpandRow = (leaverequestid) => {
    setExpandedRow(expandedRow === leaverequestid ? null : leaverequestid); 
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
          placeholder='Search by Employee Number or Email'
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
      <TableContainer component={Paper} sx={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Leave Status</TableCell>
              <TableCell>Date of Request</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(request => (
                <React.Fragment key={request.leaverequestid}>
                  <TableRow
                    sx={{
                      '&:hover': {
                        backgroundColor: '#E4F2FF',
                      },
                    }}
                  >
                    <TableCell>{request.employeenumber}</TableCell>
                    <TableCell>{request.leave_type_name}</TableCell>
                    <TableCell>{request.leave_status}</TableCell>
                    <TableCell>{request.request_createdon}</TableCell>
                    <TableCell sx={{ width: '150px' }}>
                      <Tooltip title={expandedRow === request.leaverequestid ? "Collapse Details" : "Expand Details"}>
                        <IconButton
                          sx={{ color: '#black' }}
                          onClick={() => handleExpandRow(request.leaverequestid)}
                        >
                          <MdOutlineExpandCircleDown
                            style={{
                              transform: expandedRow === request.leaverequestid ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={expandedRow === request.leaverequestid} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2, maxHeight: '440px', overflowY: 'auto', border: '1px solid #ECEBF9', borderRadius: '8px', padding: '8px' }}>
                        <FullRequestDetails requestID={request.leaverequestid} />
                      </Box>
                    </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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