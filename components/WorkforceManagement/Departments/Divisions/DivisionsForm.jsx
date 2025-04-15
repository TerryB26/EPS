import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import FormButtons from "@/components/General/FormButtons";


const validationObj = {
  divisionName: yup.string().typeError("Please enter a valid Division name.").required("Division name is required"),
};

const validationSchema = yup.object(validationObj);

const handleClearForm = () => {
  resetForm();
};

const DivisionsForm = ({ handleClose, divisionData, DepartmentID, user }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, setValues } = useFormik({
    initialValues: {
      depdivisionid: divisionData ? divisionData.depdivisionid : "",
      divisionName: divisionData ? divisionData.depdivisioname : "",
      departmentid: DepartmentID,
      user: user,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = values.depdivisionid ? "/api/WorkforceManagement/Departments/Divisions/edit-division" : "/api/WorkforceManagement/Departments/Divisions/add-division";
      const data = { ...values };

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
          text: values.depdivisionid ? 'Division updated successfully' : 'Division added successfully',
          timer: 1000,
          showConfirmButton: false,
        });
        resetForm();
      }).catch(e => {
        setSubmitting(false);
        const errorMessage =
          e.response?.data?.error || 
          e.response?.data || 
          e.message || 
          'An unknown error occurred'; 
  
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      });
    },
  });

  useEffect(() => {
    if (divisionData) {
      setValues({ depdivisionid: divisionData.depdivisionid, divisionName: divisionData.depdivisioname, departmentid: DepartmentID });
    }
  }, [divisionData, setValues, DepartmentID]);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="divisionName"
          name="divisionName"
          label={<RequiredField title="Division Name" />}
          value={values.divisionName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.divisionName && Boolean(errors.divisionName)}
          helperText={touched.divisionName && errors.divisionName}
        />
      </Box>
      <FormButtons handleClose={handleClose} handleClearForm={handleClearForm} submitting={submitting} />
    </form>
  );
};

export default DivisionsForm;