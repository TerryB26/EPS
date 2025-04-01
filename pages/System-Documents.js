import React from 'react'
import PageHeader from "@/components/General/PageHeader";
import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import SystemDocsTable from '@/components/SystemDocumentation/SystemDocsTable';

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
  
  const tabContents = [
    { label: "Manuals", title: "Content for Tab 1", content:<SystemDocsTable /> },
  ];
  

const SystemDocuments = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return (
    <Root>
      <PageHeader routeName="System Documentation"/>
      <TabsContainer>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="library tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          {tabContents.map((tab, index) => (
            <TabButton
              key={index}
              label={tab.label}
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
  )
}

export default SystemDocuments