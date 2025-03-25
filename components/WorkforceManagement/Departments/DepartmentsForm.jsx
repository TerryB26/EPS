import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, FormHelperText } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";

const validationObj = {
  departmentName: yup.string().typeError("Please enter a valid department name.").required("Department name is required"),
  description: yup.string().typeError("Please enter a valid description.").required("Description is required"),
};

const validationSchema = yup.object(validationObj);

const DepartmentsForm = ({ handleClose, departmentData }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, setValues } = useFormik({
    initialValues: {
      departmentName: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = departmentData ? "/api/WorkforceManagement/Departments/edit-department" : "/api/WorkforceManagement/Departments/add-department";
      const data = departmentData ? { ...values, departmentID: departmentData.departmentid } : values;

      axios({
        url,
        method: "POST",
        data: data
      }).then((res) => {
        setSubmitting(false);
        handleClose();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: departmentData ? 'Department updated successfully' : 'Department added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
      }).catch(e => {
        setSubmitting(false);
        MySwal.fire({
          icon: 'error',
          html: `${e?.response?.data ? e?.response?.data : e}`,
        });
      });
    },
  });

  useEffect(() => {
    if (departmentData) {
      setValues({ departmentName: departmentData.departmentname, description: departmentData.description });
    }
  }, [departmentData, setValues]);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="departmentName"
          name="departmentName"
          label={<RequiredField title="Department Name" />}
          value={values.departmentName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.departmentName && Boolean(errors.departmentName)}
          helperText={touched.departmentName && errors.departmentName}
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          id="description"
          name="description"
          label={<RequiredField title="Description" />}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && errors.description}
          multiline
          rows={4}
          InputProps={{
            sx: {
              resize: 'vertical',
            },
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" variant="contained" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </form>
  );
};

export default DepartmentsForm;