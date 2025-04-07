import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Box, IconButton, Tooltip, Typography, TablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IoDownloadOutline } from "react-icons/io5";

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

const PayslipTable = ({ User }) => {
  const [filteredYear, setFilteredYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [monthsSinceEmployment, setMonthsSinceEmployment] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (!User || !User.employedon) return;

    const employmentDate = new Date(User.employedon);
    const currentDate = new Date();

    // Calculate available years
    const years = [];
    for (let year = employmentDate.getFullYear(); year <= currentDate.getFullYear(); year++) {
      years.push(year);
    }
    setAvailableYears(years);

    // Calculate months since employment (only if the last day of the month has passed)
    const months = [];
    let current = new Date(employmentDate);
    current.setDate(1); // Start from the first day of the month
    while (current <= currentDate) {
      const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0); // Get the last day of the current month
      if (currentDate > lastDayOfMonth) {
        months.push({
          month: current.toLocaleString('default', { month: 'long' }),
          year: current.getFullYear(),
        });
      }
      current.setMonth(current.getMonth() + 1); // Move to the next month
    }
    setMonthsSinceEmployment(months);
  }, [User]);

  const handleYearFilterChange = (event) => {
    setFilteredYear(event.target.value);
  };

  const handleDownload = (month, year) => {
    console.log(`Downloading payslip for ${month} ${year}`);
    // Implement download logic here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          Payslip Table
        </Typography>
        <Select
          value={filteredYear}
          onChange={handleYearFilterChange}
          displayEmpty
          style={{ minWidth: 120 }}
        >
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell sx={{ width: '100px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {monthsSinceEmployment
              .filter((entry) => entry.year === filteredYear)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry, index) => (
                <TableRow key={index} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{entry.month}</TableCell>
                  <TableCell>{entry.year}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                    <Tooltip title="Download Payslip">
                      <IconButton
                        sx={{ color: '#939FBD' }}
                        onClick={() => handleDownload(entry.month, entry.year)}
                      >
                        <IoDownloadOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {monthsSinceEmployment.filter((entry) => entry.year === filteredYear).length === 0 && (
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
          count={monthsSinceEmployment.filter((entry) => entry.year === filteredYear).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default PayslipTable;