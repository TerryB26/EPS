import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton, InputAdornment, Link } from "@mui/material";
import PageHeader from "@/components/General/PageHeader";
import RequiredField from "@/components/General/RequiredField";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useFormik } from 'formik';
import * as yup from 'yup';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
  
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const validationSchema = yup.object({
      name: yup.string().required('Name is required'),
      surname: yup.string().required('Surname is required'),
      phoneNumber: yup.string().required('Phone number is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      password: yup.string().required('Password is required'),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    });
  
    const formik = useFormik({
      initialValues: {
        name: '',
        surname: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values, { resetForm }) => {
        setSubmitting(true);
        // Handle form submission
        console.log("🚀 ~ Register ~ values:", values)
  
        resetForm();
        setSubmitting(false);
      },
    });

  return (
    <>
      <Grid container style={{ height: '100vh' }} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box p={4} display="flex" justifyContent="center">
            <Box maxWidth="400px" width="100%">
              <PageHeader routeName="Create Account" />
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label={<RequiredField title="Name" />}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  label={<RequiredField title="Surname" />}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.surname && Boolean(formik.errors.surname)}
                  helperText={formik.touched.surname && formik.errors.surname}
                />
                <TextField
                  label={<RequiredField title="Phone Number" />}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
                <TextField
                  label={<RequiredField title="Email" />}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  label={<RequiredField title="Password" />}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <GoEyeClosed /> : <GoEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label={<RequiredField title="Confirm Password" />}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ borderRadius: '8px' }}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <GoEyeClosed /> : <GoEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: '16px' }}
                  disabled={submitting}
                >
                  Register
                </Button>
              </form>
              <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
                Already have an account? <Link href="/Login">Login here</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={4} display="flex" justifyContent="center" alignItems="center" height="100%">
            <img src="/images/Sign up-pana.png" alt="Register" style={{ maxWidth: '80%', maxHeight: '80%' }} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default RegisterForm