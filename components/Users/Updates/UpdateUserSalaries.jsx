import React from 'react'
import { Paper, Box, Typography, IconButton } from '@mui/material';
import PageHeader from '@/components/General/PageHeader';
import { MdOutlineBadge, MdOutlineWorkOutline, MdDateRange, MdOutlineModeEdit  } from "react-icons/md";
import { GrMoney } from "react-icons/gr";

const UpdateUserSalaries = () => {
  const handleEditClick = () => {
    // Handle the edit click event here
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
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '16px', fontWeight:'bold', color: "#1f2c47" }}>
              Earnings
              <IconButton onClick={handleEditClick} >
                <MdOutlineModeEdit />
              </IconButton>
            </Typography>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
              <GrMoney style={{ marginRight: '8px', verticalAlign: 'middle' }} /> R50 000
            </Typography>    
                    
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default UpdateUserSalaries