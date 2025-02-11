import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import RequiredField from "@/components/General/RequiredField";

const validationSchema = yup.object({
  leaveType: yup.string().required("Leave type is required"),
  reason: yup.string().required("Reason is required"),
});

const LeaveRequestForm = ({ Date, NumberOfDays }) => {
  const formik = useFormik({
    initialValues: {
      fromDate: Date[0] ? Date[0].toLocaleDateString() : '',
      tillDate: Date[1] ? Date[1].toLocaleDateString() : '',
      numberOfDays: NumberOfDays,
      leaveType: '',
      reason: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
      // Handle form submission
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="fromDate"
          name="fromDate"
          label="From Date"
          value={formik.values.fromDate}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          id="tillDate"
          name="tillDate"
          label="Till Date"
          value={formik.values.tillDate}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          id="numberOfDays"
          name="numberOfDays"
          label="Number of working Days"
          value={formik.values.numberOfDays}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="leaveType-label"><RequiredField title="Leave Type" /></InputLabel>
          <Select
            labelId="leaveType-label"
            id="leaveType"
            name="leaveType"
            value={formik.values.leaveType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="sick">Sick Leave</MenuItem>
            <MenuItem value="vacation">Vacation Leave</MenuItem>
            <MenuItem value="personal">Personal Leave</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          id="reason"
          name="reason"
          label={<RequiredField title="Reason" />}
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.reason && Boolean(formik.errors.reason)}
          helperText={formik.touched.reason && formik.errors.reason}
          multiline
          rows={4}
          margin="normal"
        />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default LeaveRequestForm;