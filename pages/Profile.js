import React, { useState } from 'react';
import { Box, Avatar, TextField, Container, Typography, Tabs, Tab, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import PageHeader from "@/components/General/PageHeader";
import EditIcon from '@mui/icons-material/Edit';

const ProfileContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(4),
}));

const ProfileAvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  marginBottom: theme.spacing(2),
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  }
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: "30px",
  display: 'flex',
  justifyContent: 'center',
}));

const TabButton = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: theme.spacing(1),
  minWidth: "120px",
  fontWeight: "bold",
  color: theme.palette.text.primary,
  textTransform: "none",
  transition: "all 0.3s",
  '&.Mui-selected': {
    backgroundColor: "#ECEBF9",
    borderTop: "2px solid #D1B0DB",
    borderLeft: "2px solid #D1B0DB",
    borderRight: "2px solid #D1B0DB",
    fontWeight: "bold",
  },
}));

const TabPanel = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginTop: theme.spacing(2),
  width: '600px', // Fixed width for the tab content
}));

const EditTabButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: theme.spacing(2, 0, 0),
    minWidth: "120px",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    textTransform: "none",
    transition: "all 0.3s",
    padding: theme.spacing(2, 4), // Increased padding
    '&:hover': {
      backgroundColor: "#ECEBF9",
    },
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }));

const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEdit = (section) => {
    console.log(`Editing section: ${section}`);
  };

  return (
    <>
      <PageHeader />
      <ProfileContainer>
        <ProfileAvatarContainer>
          <ProfileAvatar alt="Profile Picture" src="/path/to/profile-picture.jpg" />
          <EditButton>
            <EditIcon />
          </EditButton>
        </ProfileAvatarContainer>
       
        <TabsContainer>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="profile tabs"
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <TabButton label="Personal Info" />
            <TabButton label="Contact Info" />
            <TabButton label="Address" />
          </Tabs>
        </TabsContainer>
        <TabPanel hidden={tabIndex !== 0}>
          <TextField
            label="Name"
            value="John"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Surname"
            value="Doe"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Date of Birth"
            value="01/01/1990"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <EditTabButton variant="contained" color="primary" onClick={() => handleEdit('Personal Info')}>
            Edit
          </EditTabButton>
        </TabPanel>
        <TabPanel hidden={tabIndex !== 1}>
          <TextField
            label="Email"
            value="john.doe@example.com"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Phone"
            value="+1234567890"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Alternative Phone"
            value="+0987654321"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <EditTabButton variant="contained" color="primary" onClick={() => handleEdit('Contact Info')}>
            Edit
          </EditTabButton>
        </TabPanel>
        <TabPanel hidden={tabIndex !== 2}>
          <TextField
            label="Address"
            value="123 Main St, Anytown, USA"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <EditTabButton variant="contained" color="primary" onClick={() => handleEdit('Address')}>
            Edit
          </EditTabButton>
        </TabPanel>
      </ProfileContainer>
    </>
  );
};

export default Profile;