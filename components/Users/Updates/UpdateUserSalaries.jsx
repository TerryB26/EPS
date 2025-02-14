import React from 'react';
import { Paper, Box, Typography, IconButton, Divider } from '@mui/material';
import PageHeader from '@/components/General/PageHeader';
import { MdOutlineBadge, MdOutlineWorkOutline, MdDateRange, MdOutlineModeEdit, MdAttachMoney, MdBusiness, MdSupervisorAccount, MdHistory, MdAccountBalance, MdFilePresent } from "react-icons/md";
import { GrMoney } from "react-icons/gr";

const UpdateUserSalaries = () => {
  const handleEditClick = () => {
    console.log('Edit icon clicked');
  };

  return (
    <>
      <Box>
        <Paper style={{ textAlign: 'center', fontFamily: 'Roboto', padding: '20px', margin: '20px', boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.5)' }}>
          <PageHeader routeName="John Doela Doe" boldText={true} color="#D1B0DB" />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #D1B0DB', paddingBottom: '20px' }}>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdOutlineWorkOutline style={{ marginRight: '8px' }} /> Software Engineer - Development
            </Typography>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdDateRange style={{ marginRight: '8px' }} /> Wed 24, 2025 - Present
            </Typography>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center' }}>
              <MdOutlineBadge style={{ marginRight: '8px' }} /> EN12345
            </Typography>
          </Box>

          {/* Earnings Section */}
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: "#1f2c47", position: 'absolute', right: '45%' }}>
                Earnings
              </Typography>
              <IconButton onClick={handleEditClick} sx={{ border: '2px solid #D1B0DB', borderRadius: '50%', padding: '4px', marginLeft: 'auto' }}>
                <MdOutlineModeEdit />
              </IconButton>
            </Box>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
              <GrMoney style={{ marginRight: '8px', verticalAlign: 'middle' }} /> R50 000
            </Typography>    
          </Box>
          
          <Divider sx={{ marginY: '20px' }} />

          <Box sx={{ textAlign: 'left', paddingX: '20px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Additional Information</Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdBusiness style={{ marginRight: '8px' }} /> Department: IT
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdSupervisorAccount style={{ marginRight: '8px' }} /> Manager: Jane Doe
            </Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdHistory style={{ marginRight: '8px' }} /> Last Salary Update: R45 000 on Jan 2024
            </Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdAttachMoney style={{ marginRight: '8px' }} /> Bonuses: R5 000 (Performance Bonus)
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdAttachMoney style={{ marginRight: '8px' }} /> Deductions: R500 (Late Penalty)
            </Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdOutlineBadge style={{ marginRight: '8px' }} /> Payroll ID: PAY12345
            </Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdAccountBalance style={{ marginRight: '8px' }} /> Bank: XYZ Bank (**** 4567)
            </Typography>
            
            <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdFilePresent style={{ marginRight: '8px' }} /> Employment Contract (View)
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default UpdateUserSalaries;
