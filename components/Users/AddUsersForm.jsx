import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";

const validationObj = {
  firstName: yup.string().typeError("Please enter a valid first name.").required("First name is required"),
  lastName: yup.string().typeError("Please enter a valid last name.").required("Last name is required"),
  email: yup.string().email("Please enter a valid email address.").required("Email is required"),
  department: yup.string().required("Department is required"),
  employmentType: yup.string().required("Employment type is required"),
  userRole: yup.string().required("Job title is required"),
  userRole: yup.string().required("Job title is required"),
};

const validationSchema = yup.object(validationObj);

const AddUsersForm = ({ handleClose, closeAccordion }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      employmentType: "",
      jobTitle: "",
      userRole: "",
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

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
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
      </Box>
      <Box mb={2}>
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
      </Box>
      <Box mb={2}>
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
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="department-label"><RequiredField title="Department" /></InputLabel>
          <Select
            labelId="department-label"
            id="department"
            name="department"
            value={values.department}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.department && Boolean(errors.department)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="employmentType-label"><RequiredField title="Employment Type" /></InputLabel>
          <Select
            labelId="employmentType-label"
            id="employmentType"
            name="employmentType"
            value={values.employmentType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.employmentType && Boolean(errors.employmentType)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="userRole-label"><RequiredField title="User Role" /></InputLabel>
          <Select
            labelId="userRole-label"
            id="userRole"
            name="userRole"
            value={values.userRole}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.userRole && Boolean(errors.userRole)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Manager">Role 1</MenuItem>

          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" variant="contained" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </form>
  );
};

export default AddUsersForm;