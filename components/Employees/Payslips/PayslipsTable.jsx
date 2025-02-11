import React, { useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

const payslipsData = [
  { month: 'January', year: 2025, amount: 3000 },
  { month: 'February', year: 2025, amount: 3200 },
  { month: 'March', year: 2025, amount: 3100 },
  // Add more payslips data as needed
];

const PayslipsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPayslips = payslipsData.filter((payslip) =>
    payslip.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={2}>
      <TextField
        label="Search by Month"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayslips.map((payslip, index) => (
              <TableRow key={index}>
                <TableCell>{payslip.month}</TableCell>
                <TableCell>{payslip.year}</TableCell>
                <TableCell>{payslip.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PayslipsTable;