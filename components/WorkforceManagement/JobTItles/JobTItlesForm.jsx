import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import FormButtons from "@/components/General/FormButtons";


const validationObj = {
  jobTitle: yup.string().typeError("Please enter a valid job title.").required("Job title is required"),
};

const validationSchema = yup.object(validationObj);

const handleClearForm = () => {
  resetForm();
};

const JobTitlesForm = ({ handleClose, jobTitleId, jobTitleName, user }) => {
  const [submitting, setSubmitting] = useState(false);


  const formik = useFormik({
    initialValues: {
      jobTitle: jobTitleName || "",
      user: user,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = jobTitleId ? "/api/WorkforceManagement/JobTitles/edit-jobTitle" : "/api/WorkforceManagement/JobTitles/add-jobTitle";
      const data = jobTitleId ? { ...values, jobtitleid: jobTitleId } : values;

      axios({
        url,
        method: "POST",
        data: data
      }).then((res) => {
        setSubmitting(false);
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: jobTitleId ? 'Job title updated successfully' : 'Job title added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
        handleClose(); // Ensure handleClose is called after successful submission
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
    if (jobTitleId && !jobTitleName) {
      axios.get(`/api/WorkforceManagement/JobTitles/${jobTitleId}`).then((response) => {
        formik.setValues({ jobTitle: response.data.jobtitlename });
      }).catch((error) => {
        console.error('Error fetching job title:', error);
      });
    }
  }, [jobTitleId, jobTitleName]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="jobTitle"
          name="jobTitle"
          label={<RequiredField title="Job Title" />}
          value={formik.values.jobTitle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
          helperText={formik.touched.jobTitle && formik.errors.jobTitle}
        />
      </Box>
      <FormButtons handleClose={handleClose} handleClearForm={handleClearForm} submitting={submitting} />
    </form>
  );
};

export default JobTitlesForm;