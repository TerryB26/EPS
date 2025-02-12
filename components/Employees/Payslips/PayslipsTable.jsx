import React, { useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Typography, TablePagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RequiredField from '@/components/General/RequiredField';

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

const AddPayslipButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const payslipsData = [
  { month: 'January', year: 2025, amount: 3000 },
  { month: 'February', year: 2025, amount: 3200 },
  { month: 'March', year: 2025, amount: 3100 },
  // Add more payslips data as needed
];

const PayslipsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedYear('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPayslips = payslipsData.filter((payslip) =>
    payslip.month.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedYear ? payslip.year === parseInt(selectedYear) : true)
  );

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="start" mb={2}>
      <FormControl
        variant="outlined"
        style={{ minWidth: 120 }}
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
      >
        <RequiredField  title="Year To Display" boldTitle={true}/>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            height: '40px', // Match height with TextField
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
        </Select>
      </FormControl>


      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search by Month"
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
      
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredPayslips.length > 0 ? (
              filteredPayslips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payslip, index) => (
                <TableRow key={index} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{payslip.month}</TableCell>
                  <TableCell>{payslip.year}</TableCell>
                  <TableCell>{payslip.amount}</TableCell>
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
          count={filteredPayslips.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default PayslipsTable;