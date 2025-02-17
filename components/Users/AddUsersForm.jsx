import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Stepper, Step, StepLabel, Typography, Grid } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import PageHeader from '../General/PageHeader';
import { getDateOfBirthFromID, validateIDNumber, getGenderFromID } from '@/utils/IDChecker';
import PropDebugger from '@/utils/Debugger';
import { FaFemale, FaMale } from "react-icons/fa";

const validationObj = {
  firstName: yup.string().typeError("Please enter a valid first name.").required("First name is required"),
  lastName: yup.string().typeError("Please enter a valid last name.").required("Last name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  phoneNumber: yup.string().typeError("Please enter a valid contact number.").required("Contact number is required"),
  IDNumber: yup.string().matches(/^\d{13}$/, "Please enter a valid 13-digit ID number").required("ID number is required"),
  DOB: yup.date().typeError("Please enter a valid date of birth").required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
};

const validationSchema = yup.object(validationObj);

const AddUsersForm = ({ handleClose, closeAccordion, routeName }) => {
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Employee Details', 'Recruitment Details', 'Review & Submit'];

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue, resetForm } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      IDNumber: "",
      DOB: "",
      gender: ""
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

  const handleIDNumberChange = (e) => {
    handleChange(e);
    const idNumber = e.target.value;
    if (validateIDNumber(idNumber)) {
      const dob = getDateOfBirthFromID(idNumber);
      const gender = getGenderFromID(idNumber);
      setFieldValue('DOB', dob.toISOString().split('T')[0]);
      setFieldValue('gender', gender);
    } else {
      setFieldValue('DOB', '');
      setFieldValue('gender', '');
    }
  };

  const stepContents = [
    <Box mb={2} mt={8} key="step1">
    <Grid container spacing={2} mb={4}>
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
    <Grid container spacing={2} mb={4}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label={<RequiredField title="Email" />}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label={<RequiredField title="Contact Number" />}
          value={values.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
          helperText={touched.phoneNumber && errors.phoneNumber}
        />
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={4}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="IDNumber"
          name="IDNumber"
          label={<RequiredField title="ID Number" />}
          value={values.IDNumber}
          onChange={handleIDNumberChange} // Use custom handleChange
          onBlur={handleBlur}
          error={touched.IDNumber && Boolean(errors.IDNumber)}
          helperText={touched.IDNumber && errors.IDNumber}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          id="DOB"
          name="DOB"
          label={<RequiredField title="Date OF Birth" isRequired={false}/>}
          value={values.DOB}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={true}
        />
      </Grid>
    </Grid>
    <Grid container spacing={2} mb={4}>
      <Grid item xs={6} display="flex" alignItems="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: `2px solid ${values.gender === 'Male' ? "#1976D2" : "#808080"}`,
            backgroundColor: 'transparent',
            marginRight: '10px'
          }}
        >
          <FaMale size={24} color={values.gender === 'Male' ? "#1976D2" : "#808080"} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: `2px solid ${values.gender === 'Female' ? "#1976D2" : "#808080"}`,
            backgroundColor: 'transparent'
          }}
        >
          <FaFemale size={24} color={values.gender === 'Female' ? "#1976D2" : "#808080"} />
        </Box>
      </Grid>
    </Grid>
    </Box>,
    
    <Box mb={2} mt={8} key="step2">

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
      <PropDebugger propsToDebug={{ values, errors }} />
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