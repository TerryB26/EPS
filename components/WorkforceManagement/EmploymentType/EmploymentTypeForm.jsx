import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";

const validationObj = {
  employmentType: yup.string().typeError("Please enter a valid employment type.").required("Employment type is required"),
  description: yup.string().typeError("Please enter a valid description.").required("Description is required"),
};

const validationSchema = yup.object(validationObj);

const EmploymentTypeForm = ({ handleClose, closeAccordion }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      employmentType: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      let url = "/employmenttypes/add";

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
          text: 'Employment type added successfully',
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

export default EmploymentTypeForm;