import React from 'react';
import DashboardView from '@/components/Dashboard/DashboardView';
import withAuth from '@/auth/withAuth';

const Dashboard = ({ user }) => {

  return (
    <>
      <DashboardView user={user}/>
    </>
  );
};

export default withAuth(Dashboard);