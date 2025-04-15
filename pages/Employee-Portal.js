import withAuth from '@/auth/withAuth';
import LeaveApplicationsDashboard from '@/components/Employees/Leaves/LeaveApplicationsDashboard';
import PayslipsTable from '@/components/Employees/Payslips/PayslipsTable';
import PageHeader from "@/components/General/PageHeader";
import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Root = styled('div')(({ theme }) => ({
  padding: "20px",
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: "20px",
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
}));


const EmployeePortal = ({user}) => {
  const tabContents = [
    { label: "Leave",  content: <LeaveApplicationsDashboard user={user}/> },
    { label: "Payslips",  content: <PayslipsTable user={user}/> },
  ];
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Root>
      <PageHeader routeName="Employee Portal"/>
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
};

export default withAuth(EmployeePortal);