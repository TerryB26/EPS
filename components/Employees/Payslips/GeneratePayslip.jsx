import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Box, IconButton, Tooltip, Typography, TablePagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IoDownloadOutline } from "react-icons/io5";
import { calculateTakeHomePay } from '@/utils/IDChecker';
import axios from 'axios';


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
  const [takeHomePayDetails, setTakeHomePayDetails] = useState(null);

  useEffect(() => {
    if (!User || !User.employedon) return;

    const employmentDate = new Date(User.employedon);
    const currentDate = new Date();

    const years = [];
    for (let year = employmentDate.getFullYear(); year <= currentDate.getFullYear(); year++) {
      years.push(year);
    }
    setAvailableYears(years);

    const months = [];
    let current = new Date(employmentDate);
    current.setDate(1); 
    while (current <= currentDate) {
      const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0); 
      if (currentDate > lastDayOfMonth) {
        months.push({
          month: current.toLocaleString('default', { month: 'long' }),
          year: current.getFullYear(),
        });
      }
      current.setMonth(current.getMonth() + 1);
    }
    setMonthsSinceEmployment(months);

    const takeHomePayDetails = calculateTakeHomePay(User.idnumber, User.basicsalary);
    setTakeHomePayDetails(takeHomePayDetails);

    
  }, [User]);

  const handleYearFilterChange = (event) => {
    setFilteredYear(event.target.value);
  };

  const handleDownload = async (month, year) => {
    console.log("🚀 ~ handleDownload ~ year:", year);
    console.log("🚀 ~ handleDownload ~ month:", month);
    console.log("🚀 ~ useEffect ~ takeHomePayDetails:", takeHomePayDetails);
  
    try {
      const response = await axios.post('/api/Payslips/getPaySlip', {
        takeHomePayDetails,
        year,
        month,
        User,
      }, {
        responseType: 'blob', // Ensure the response is treated as a binary Blob
      });
  
      if (response.status === 200) {
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Payslip_${month}_${year}.docx`); // Set the filename
        document.body.appendChild(link);
        link.click();
  
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
  
        console.log("Payslip downloaded successfully.");
      } else {
        console.error("Failed to download payslip:", response);
      }
    } catch (error) {
      console.error("Error downloading payslip:", error);
    }
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