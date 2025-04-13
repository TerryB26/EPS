import React, { useState } from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';
import withAuth from '@/auth/withAuth';

const Register = () => {

  return (
  <>
      <RegisterForm  />

  </>
  );
};

export default withAuth(Register);