import React, { useState } from 'react';
import PageHeader from "@/components/General/PageHeader";
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RequestsTable from '@/components/Employees/Leaves/RequestsTable';
import NewRequest from '@/components/Employees/Leaves/NewRequest';
import LeaveBalance from '@/components/Employees/Leaves/LeaveBalance';

const Root = styled('div')(({ theme }) => ({
  padding: "20px",
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderBottom: '2px solid #D1B0DB', // Add a straight line under the buttons
}));

const TabButton = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px 8px 0 0", // Make the top corners rounded
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
}));

const tabContents = [
  { label: "Balances", content: <LeaveBalance />},
  { label: "Pending Requests", content: <RequestsTable WhereStatus="Pending"/> },
  { label: "Approved Requests", content: <RequestsTable WhereStatus="Approved"/> },
  { label: "Rejected Requests", content: <RequestsTable WhereStatus="Rejected"/> },
  { label: "New Application", content: <NewRequest /> },
];

const LeaveApplicationsDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Root>
      <TabsContainer>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="employee leaves tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          {tabContents.map((tab, index) => (
            <TabButton
              key={index}
              label={
                <Box display="flex" alignItems="center">
                  {tab.icon}
                  <Box ml={1}>{tab.label}</Box>
                </Box>
              }
            />
          ))}
        </Tabs>
      </TabsContainer>
      {tabContents.map((tab, index) => (
        <TabPanel key={index} hidden={value !== index}>
          {tab.content}
        </TabPanel>
      ))}
    </Root>
  );
}

export default LeaveApplicationsDashboard;