import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import { IoCloudDownloadOutline } from "react-icons/io5";
import DialogForm from '@/components/General/DialogForm';
import { BsThreeDots } from "react-icons/bs";
import LeaveResponseForm from '@/components/Employees/Leaves/LeaveResponseForm';

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

const FullRequestDetails = ({ requestID, user, fetchAllRequests }) => {
  const [request, setRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogWidth, setDialogWidth] = useState('md');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleDownload = async () => {
    try {
      const response = await axios.post('/api/Leaves/Requests/download-attachment', {
        leaverequestid: request.leaverequestid,
        attachment_filename: request.attachment_filename,
        employeenumber: request.employeenumber,
      }, {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${request.employeenumber}_${request.attachment_filename}` || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the document:', error);
    }
  };

  const handleDialogOpen = (content, title, width = 'md') => {
    setDialogContent(content);
    setDialogTitle(title);
    setDialogWidth(width);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
    setDialogTitle('');
    setDialogWidth('md');
  };

  useEffect(() => {
    fetchRequests();
  }, [requestID]);

  if (!request) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  return (
    <DetailPaper elevation={0}>
      <Header>
        <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold' }}>
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

        {/* Attachment Details */}
        <Grid item xs={12} sm={6}>
          <DetailItem
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '2px solid #D0B0DA',
              backgroundColor: 'rgba(236, 235, 249, 0.4)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
            }}
            onClick={handleDownload}
          >
            <IoCloudDownloadOutline size={20} style={{ marginRight: '8px' }} />
            <Typography variant="body1" sx={{ color: '#1F2937', fontWeight: '600' }}>
              {request.attachment_filename || 'No attachment available'}
            </Typography>
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

      {/* Three Dots Icon and Dialog */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
        <BsThreeDots
          size={24}
          style={{ cursor: 'pointer', color: '#1F2937' }}
          onClick={() => handleDialogOpen(<LeaveResponseForm requestID={requestID} handleClose={handleDialogClose} fetchRequests={fetchRequests}  fetchAllRequests={fetchAllRequests} user={user}/>, 'Leave Response')}
        />
      </Box>

      <DialogForm
        title={dialogTitle}
        content={dialogContent}
        open={isDialogOpen}
        onClose={handleDialogClose}
        width={dialogWidth}
      />
    </DetailPaper>
  );
};

export default FullRequestDetails;