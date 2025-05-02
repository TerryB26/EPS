import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Box, Typography, IconButton, Divider, Tooltip } from '@mui/material';
import PageHeader from '@/components/General/PageHeader';
import { MdOutlineBadge, MdOutlineWorkOutline, MdDateRange, MdOutlineModeEdit, MdAttachMoney, MdBusiness, MdSupervisorAccount, MdHistory, MdAccountBalance, MdFilePresent, MdDownloading  } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import CircularProgress from '@mui/material/CircularProgress'; 

const FullEmpDetails = ({ UserID }) => {
  const [userDetails, setUserDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); 

  const fetchDetails = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('/api/FullEmpDetails');
      const user = response.data.find(detail => detail.userid === UserID);
      setUserDetails(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [UserID]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  const handleEditClick = () => {
    console.log('Edit icon clicked');
  };

  const handleDownloadContract = async () => {
    setIsDownloading(true); 
    try {
      const response = await axios.post(
        '/api/EmpContracts/downloadContract', 
        { employeeNumber: userDetails.employeenumber, contractName: userDetails.empcontractname },
        { responseType: 'blob' } 
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Employment_Contract_${userDetails.employeenumber}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading contract:', error);
    } finally {
      setIsDownloading(false); 
    }
  };

  return (
    <>
      <Box>
        <Paper style={{ textAlign: 'center', fontFamily: 'Roboto', padding: '20px', margin: '20px', boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.5)' }}>
          <PageHeader routeName={`${userDetails.name} ${userDetails.surname}`} boldText={true} color="#D1B0DB" />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #D1B0DB', paddingBottom: '20px' }}>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdOutlineWorkOutline style={{ marginRight: '8px' }} /> {userDetails.jobtitlename} - {userDetails.depdivisioname}
            </Typography>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px' }}>
              <MdDateRange style={{ marginRight: '8px' }} /> {new Date(userDetails.employedon).toDateString()} - {userDetails.employmentenddate ? new Date(userDetails.employmentenddate).toDateString() : 'Present'}
            </Typography>
            <Typography sx={{ border: '1px solid #D1B0DB', background: '#ECEBF9', borderRadius: '8px', paddingY: '2px', paddingX: '8px', display: 'inline-flex', alignItems: 'center', marginBottom: '8px'}}>
              <MdOutlineBadge style={{ marginRight: '8px' }} /> {userDetails.employeenumber}
            </Typography>
            <Tooltip title="Download Employment Contract">
              <Typography
                sx={{
                  border: '1px solid #D1B0DB',
                  background: '#ECEBF9',
                  borderRadius: '8px',
                  paddingY: '2px',
                  paddingX: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer', 
                }}
                onClick={handleDownloadContract}
              >
                {isDownloading ? (
                  <CircularProgress size={20} sx={{ marginRight: '8px' }} /> 
                ) : (
                  <MdDownloading style={{ marginRight: '8px' }} />
                )}
                Employment Contract
              </Typography>
            </Tooltip>
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
              <MdBusiness style={{ marginRight: '8px' }} /> Department: {userDetails.departmentname}
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

export default FullEmpDetails;
