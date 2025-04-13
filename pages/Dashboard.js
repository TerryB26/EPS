import React from 'react';
import DashboardView from '@/components/Dashboard/DashboardView';
import withAuth from '@/auth/withAuth';

const Dashboard = () => {

  return (
    <>
      <DashboardView />
    </>
  );
};

export default withAuth(Dashboard);