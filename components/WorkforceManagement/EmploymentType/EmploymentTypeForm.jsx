import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import FormButtons from "@/components/General/FormButtons";

const validationObj = {
  employmentType: yup.string().typeError("Please enter a valid employment type.").required("Employment type is required"),
};

const validationSchema = yup.object(validationObj);

const handleClearForm = () => {
  resetForm();
};

const EmploymentTypeForm = ({ handleClose, employmentTypeId, employmentTypeName }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, setValues } = useFormik({
    initialValues: {
      employmentType: employmentTypeName || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = employmentTypeId ? "/api/WorkforceManagement/EmploymentType/edit-employmentType" : "/api/WorkforceManagement/EmploymentType/add-employmentType";
      const data = employmentTypeId ? { ...values, employmenttypeid: employmentTypeId } : values;

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
          text: employmentTypeId ? 'Employment type updated successfully' : 'Employment type added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
      }).catch(e => {
        setSubmitting(false);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: e?.response?.data?.error || 'An error occurred',
        });
      });
    },
  });

  useEffect(() => {
    if (employmentTypeId && !employmentTypeName) {
      axios.get(`/api/WorkforceManagement/EmploymentType/${employmentTypeId}`).then((response) => {
        setValues({ employmentType: response.data.employmenttypename });
      }).catch((error) => {
        console.error('Error fetching employment type:', error);
      });
    }
  }, [employmentTypeId, employmentTypeName, setValues]);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="employmentType"
          name="employmentType"
          label={<RequiredField title="Employment Type" />}
          value={values.employmentType}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.employmentType && Boolean(errors.employmentType)}
          helperText={touched.employmentType && errors.employmentType}
        />
      </Box>
      <FormButtons handleClose={handleClose} handleClearForm={handleClearForm} submitting={submitting} />
    </form>
  );
};

export default EmploymentTypeForm;