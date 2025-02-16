import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";

const validationSchema = yup.object({
  roleName: yup.string().typeError("Please enter a valid role name.").required("Role name is required"),
});

const RolesForm = ({ handleClose, roleData }) => {
  const [submitting, setSubmitting] = useState(false);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, setValues } = useFormik({
    initialValues: {
      roleName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = roleData ? "/api/Roles/edit-role" : "/api/Roles/add-role";
      const data = roleData ? { ...values, roleID: roleData.roleid } : values;

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
          text: roleData ? 'Role updated successfully' : 'Role added successfully',
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
    if (roleData) {
      setValues({ roleName: roleData.rolename });
    }
  }, [roleData, setValues]);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="roleName"
          name="roleName"
          label={<RequiredField title="Role Name" />}
          value={values.roleName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.roleName && Boolean(errors.roleName)}
          helperText={touched.roleName && errors.roleName}
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

export default RolesForm;