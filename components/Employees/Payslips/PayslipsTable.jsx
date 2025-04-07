import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from "@/components/General/PageHeader";
import GeneratePayslip from '@/components/Employees/Payslips/GeneratePayslip';

const PayslipsTable = () => {
  const [User, setUser] = useState(null);
  console.log("🚀 ~ PayslipsTable ~ User:", User)
  const userid = '02016688-52cb-4a48-874a-d78e4eaff7df';

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/FullEmpDetails');
      console.log("🚀 ~ fetchRequests ~ response:", response)
      const matchedRequest = response.data.find(
        (req) => req.userid === userid
      );
      setUser(matchedRequest || null);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

    useEffect(() => {
      fetchRequests();
    }, []);
  


  return (
    <div style={{ padding: "20px" }}>
    <PageHeader routeName="Generate Payslip"/>
    <GeneratePayslip User={User} />
    </div>
  );
};

export default PayslipsTable;