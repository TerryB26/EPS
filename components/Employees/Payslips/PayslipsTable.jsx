import GeneratePayslip from '@/components/Employees/Payslips/GeneratePayslip';
import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import PageHeader from "@/components/General/PageHeader";
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';


const PayslipsTable = () => {
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userid = '02016688-52cb-4a48-874a-d78e4eaff7df';

  const fetchRequests = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('/api/FullEmpDetails');
      const matchedRequest = response.data.find(
        (req) => req.userid === userid
      );
      setUser(matchedRequest || null);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false); 
    }
  };

    useEffect(() => {
      fetchRequests();
    }, []);

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
          <CircularProgressWithLabel />
        </Box>
      );
    }

  return (
    <div style={{ padding: "20px" }}>
    <PageHeader routeName="Generate Payslip"/>
    <GeneratePayslip User={User} />
    </div>
  );
};

export default PayslipsTable;