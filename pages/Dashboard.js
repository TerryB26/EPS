import React from 'react';
import DashboardView from '@/components/Dashboard/DashboardView';
import withAuth from '@/auth/withAuth';

const Dashboard = ({ user }) => {
console.log("🚀 ~ Dashboard ~ user:", user)

  return (
    <>
      <DashboardView user={user}/>
    </>
  );
};

export default withAuth(Dashboard);