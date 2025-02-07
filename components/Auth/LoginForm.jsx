import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, IconButton, InputAdornment, Link } from "@mui/material";
import PageHeader from "@/components/General/PageHeader";
import RequiredField from "@/components/General/RequiredField";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useFormik } from 'formik';
import * as yup from 'yup';

const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    };

    const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required')
    });

    const formik = useFormik({
    initialValues: {
        email: '',
        password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
        setSubmitting(true);
        // Handle form submission
        console.log("🚀 ~ Login ~ values:", values)

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
              <PageHeader routeName="Welcome Sign In" />
              <form onSubmit={formik.handleSubmit}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: '16px' }}
                  disabled={submitting}
                >
                  Login
                </Button>
              </form>
              <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
                Not registered? <Link href="/Register">Register here</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={4} display="flex" justifyContent="center" alignItems="center" height="100%">
            <img src="/images/Fingerprint-bro.png" alt="Login" style={{ maxWidth: '80%', maxHeight: '80%' }} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default LoginForm