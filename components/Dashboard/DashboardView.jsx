import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import DialogForm from '@/components/General/DialogForm';
import InfoCard from "@/components/General/InfoCard";
import PageHeader from "@/components/General/PageHeader";
import BarGraph from '@/components/Statistics/BarGraph';
import PieChart from '@/components/Statistics/PieChart';
import Users from '@/components/Users/UsersTable';
import { Box, Grid } from "@mui/material";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlineAdsClick } from "react-icons/md";


const DashboardView = ({user}) => {
    console.log("🚀 ~ DashboardView ~ user:", user)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');  
    const [loading, setLoading] = useState(true);
    const [DashboardData, setDashboardData] = useState([]);
    const { pending = 0, approved = 0, rejected = 0, all_requests = 0, total_employees = 0 } = DashboardData[0] || {};
    
    const handleIconClick = (title) => {
        setDialogTitle(title);
        setDialogOpen(true);
      };
    
      const handleClose = () => {
        setDialogOpen(false);
      };

      const fetchDashData = async () => {
        setLoading(true); 
        try {
          const response = await axios.get('/api/DashboardStats');
          setDashboardData(response.data);
        } catch (error) {
          console.error('Error fetching Dashboard Data:', error);
        } finally {
          setLoading(false); 
        }
      };
    
      useEffect(() => {
        fetchDashData();
      }, []);

      if (loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
            <CircularProgressWithLabel />
          </Box>
        );
      }

    if (user && user.rolename === 'Admin') {
        return (
          <div style={{ padding: "20px" }}>
            <PageHeader/>

            <Grid container spacing={3}>
              {/* Info Cards */}
              
                <Grid item xs={12} md={3} key="Total1">
                  <InfoCard
                    header={
                      <>
                        Total Users
                      </>
                    }
                    innerText={total_employees}
                  />
                </Grid>
                <Grid item xs={12} md={3} key="Total2">
                  <InfoCard
                    header={
                      <>
                        Pending Leave Requests
                      </>
                    }
                    innerText={pending}
                  />
                </Grid>
                <Grid item xs={12} md={3} key="Total3">
                  <InfoCard
                    header={
                      <>
                        Rejected Leave Requests
                      </>
                    }
                    innerText={rejected}
                  />
                </Grid>
                <Grid item xs={12} md={3} key="Total4">
                  <InfoCard
                    header={
                      <>
                        All Leave Requests
                      </>
                    }
                    innerText={all_requests}
                  />
                </Grid>

              {/* Charts */}
              <Grid item xs={12} md={6}>
                <InfoCard
                  header="Organization Data"
                  innerText={
                    <BarGraph Data={DashboardData[0]} />
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard
                  header="Leave Requests"
                  innerText={
                      <PieChart Data={DashboardData[0]} />
                    }
                />
              </Grid>

              <Grid item xs={12} md={12}>
                  <InfoCard
                    header="Users"
                    innerText={
                      <Box p={2}>
                        <Users user={user}/>
                      </Box>
                    }
                  />
              </Grid>
            </Grid>
          </div>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="Animations/welcome-animate.svg"
                alt="Welcome Animation"
                style={{ width: "600px", height: "auto" }}
              />
            </div>
          </Box>
            <PageHeader routeName="Dashboard" />
          </Box>

      );
}
}

export default DashboardView