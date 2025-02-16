import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography, Grid } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import PageHeader from '../General/PageHeader';

const validationObj = {
  firstName: yup.string().typeError("Please enter a valid first name.").required("First name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
};

const validationSchema = yup.object(validationObj);

const AddUsersForm = ({ handleClose, closeAccordion, routeName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Information', 'Contact Details', 'Review & Submit'];

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      firstName: "",
      email: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      let url = "api/Users/add-user";

      axios({
        url,
        method: "POST",
        data: { ...values }
      }).then((res) => {
        setSubmitting(false);
        handleClose();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
        closeAccordion();
      }).catch(e => {
        setSubmitting(false);
        MySwal.fire({
          icon: 'error',
          html: `${e?.response?.data ? e?.response?.data : e}`,
        });
      });
    },
  });

  const stepContents = [
    <Box mb={2} mt={8} key="step1">
      <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label={<RequiredField title="First Name" />}
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="lastName"
          name="lastName"
          label={<RequiredField title="Last Name" />}
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />
      </Grid>
    </Grid>
      
    </Box>,
    
    <Box mb={2} key="step2">
      <Typography variant="h6">Review your details</Typography>
      <Typography variant="body1">First Name: {values.firstName}</Typography>
      <Typography variant="body1">Email: {values.email}</Typography>
    </Box>
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Box mt={2}>
        <form onSubmit={handleSubmit}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={2} >
          <PageHeader routeName={steps[activeStep]}  />            

          {stepContents[activeStep]}
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button color="primary" variant="contained" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button color="primary" variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default AddUsersForm;