import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  maxWidth: '900px',
  margin: '40px auto',
  overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
    backgroundColor: '#ECEBF9',
  padding: theme.spacing(2),
  borderRadius: '12px 12px 0 0',
  margin: '-32px -32px 32px -32px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: '700',
  fontSize: '1.25rem',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textTransform: 'uppercase',
  letterSpacing: '1px',
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(8px)',
  },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  color: '#1F2937',
  minWidth: '130px',
  fontSize: '1rem',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  color: '#4B5563',
  fontSize: '1rem',
}));

const FullRequestDetails = ({ requestID }) => {
  const [request, setRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/Leaves/LeaveRequests');
      const matchedRequest = response.data.find(
        (req) => req.leaverequestid === requestID
      );
      setRequest(matchedRequest || null);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requestID]);

  const Header = styled(Box)(({ theme, status }) => {
    let borderColor, bgColor;
  
    switch (status) {
      case 'Pending':
        borderColor = '#FFC107'; 
        bgColor = 'rgba(255, 193, 7, 0.5)';
        break;
      case 'Approved':
        borderColor = '#003366'; 
        bgColor = 'rgba(0, 51, 102, 0.5)';
        break;
      case 'Rejected':
        borderColor = '#FF0000';
        bgColor = 'rgba(255, 0, 0, 0.5)';
        break;
      default:
        borderColor = '#ECEBF9'; 
        bgColor = '#ECEBF9';
    }
  
    return {
      backgroundColor: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      padding: theme.spacing(2),
      margin: '-32px -32px 32px -32px',
    };
  });

  if (!request) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height: '20vh' }}>
            <CircularProgressWithLabel />
        </Box>
    );
  }

  return (
    <DetailPaper elevation={0}>
      <Header>
        <Typography variant="h5" sx={{ color: '#black', fontWeight: 'bold' }}>
          Leave Request Overview
        </Typography>
      </Header>
  
      <Grid container spacing={4}>
        {/* Employee Information */}
        <Grid item xs={12} sm={6}>
          <SectionTitle>
            <FaUser /> Employee Information
          </SectionTitle>
          <DetailItem>
            <DetailLabel>Name:</DetailLabel>
            <DetailValue>{request.name}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Surname:</DetailLabel>
            <DetailValue>{request.surname}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Email:</DetailLabel>
            <DetailValue>{request.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Employee No:</DetailLabel>
            <DetailValue>{request.employeenumber}</DetailValue>
          </DetailItem>
        </Grid>
  
        {/* Leave Details */}
        <Grid item xs={12} sm={6}>
          <SectionTitle>
            <FaCalendarAlt /> Leave Details
          </SectionTitle>
          <DetailItem>
            <DetailLabel>Type:</DetailLabel>
            <DetailValue>{request.leave_type_name}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Status:</DetailLabel>
            <DetailValue>{request.leave_status}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Duration:</DetailLabel>
            <DetailValue>{request.leaveduration} days</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>From:</DetailLabel>
            <DetailValue>{request.from_date}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>To:</DetailLabel>
            <DetailValue>{request.till_date}</DetailValue>
          </DetailItem>
        </Grid>
      </Grid>
  
      {/* Reason Section */}
      <Box mt={4}>
        <DetailItem>
          <DetailLabel>Reason:</DetailLabel>
          <DetailValue sx={{ wordBreak: 'break-word', textAlign: 'left' }}>
            {request.employeereason || 'No reason provided'}
          </DetailValue>
        </DetailItem>
      </Box>
    </DetailPaper>
  );
};

export default FullRequestDetails;