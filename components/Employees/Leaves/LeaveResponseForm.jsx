import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import FormButtons from "@/components/General/FormButtons";
import RequiredField from "@/components/General/RequiredField";
import { Box, FormControl, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import MySwal from 'sweetalert2';
import * as yup from 'yup';

const validationSchema = yup.object({
  leaveStatus: yup.string().required("Leave status is required"),
  reason: yup.string().nullable(), 
});

const LeaveResponseForm = ({ requestID, handleClose, fetchRequests, user }) => {
  const [LeaveStatus, setLeaveStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Leaves/LeaveStatuses');
      const filteredStatuses = response.data.filter(status => status.status !== 'Pending');
      setLeaveStatus(filteredStatuses);
    } catch (error) {
      console.error('Error fetching leave statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm } = useFormik({
    initialValues: {
      requestID: requestID,
      leaveStatus: '',
      reason: '',
      user: user,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const url = "/api/Leaves/Requests/update-request";

      axios({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        data: values,
      }).then((res) => {
        setSubmitting(false);
        handleClose();
        fetchRequests();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: `Leave status updated successfully`,
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <FormControl fullWidth>
          <RequiredField title="Leave Status" boldTitle={true}/>
          <Select
            labelId="leaveStatus-label"
            id="leaveStatus"
            name="leaveStatus"
            value={values.leaveStatus}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.leaveStatus && Boolean(errors.leaveStatus)}
          >
            {LeaveStatus.map(status => (
              <MenuItem key={status.leaveid} value={status.leaveid}>
                {status.status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <RequiredField title="Reason" boldTitle={true} isRequired={false}/>
        <TextField
          fullWidth
          id="reason"
          name="reason"
          value={values.reason}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.reason && Boolean(errors.reason)}
          helperText={touched.reason && errors.reason}
          multiline
          rows={3}
        />
      </Box>
      <FormButtons handleClose={handleClose} handleClearForm={resetForm} submitting={submitting} />
    </form>
  );
};
export default LeaveResponseForm;