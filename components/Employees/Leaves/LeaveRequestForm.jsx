import CircularProgressWithLabel from '@/components/General/CircularProgressWithLabel';
import FormButtons from '@/components/General/FormButtons';
import PageHeader from "@/components/General/PageHeader";
import RequiredField from "@/components/General/RequiredField";
import PropDebugger from '@/utils/Debugger';
import { 
  Box, 
  FormControl, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  IconButton, 
  Tooltip
} from '@mui/material';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdVisibility, MdDelete } from 'react-icons/md';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import MySwal from 'sweetalert2';
import DialogForm from '@/components/General/DialogForm';

const validationSchema = yup.object({
  leaveType: yup.string().required("Leave type is required"),
});

const styles = {
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    border: '2px dashed #1976D2',
    borderRadius: '8px',
    bgcolor: '#F5F8FA',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': { bgcolor: '#E8F0FE', borderColor: '#1565C0' },
  },
  dropzoneHover: { bgcolor: '#E8F0FE', borderStyle: 'solid', borderColor: '#1565C0' },
  dropzoneText: { mt: 1, fontSize: '0.9rem', color: '#424242', textAlign: 'center' },
  fileInfo: { mt: 2, display: 'flex', alignItems: 'center', gap: 1 },
  viewButton: { color: '#1976D2', '&:hover': { color: '#1565C0', bgcolor: '#E8F0FE' } },
  deleteButton: { color: '#E57373', '&:hover': { color: '#D32F2F', bgcolor: '#FFEBEE' } },
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const LeaveRequestForm = ({ handleClose, Date, NumberOfDays, user }) => {
  console.log("🚀 ~ LeaveRequestForm ~ user:", user)
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClearForm = () => resetForm();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFieldValue("file", e.dataTransfer.files[0]);
      setFieldValue("filename", e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFieldValue("file", e.target.files[0]);
      setFieldValue("filename", e.target.files[0].name);
    }
  };

  const handleFileView = () => {
    setSelectedFile(values.file);
    setDialogOpen(true);
  };

  const handleFileDelete = () => {
    setFieldValue("file", null);
    setFieldValue("filename", "");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      fromDate: Date[0] ? Date[0].toLocaleDateString() : '',
      tillDate: Date[1] ? Date[1].toLocaleDateString() : '',
      numberOfDays: NumberOfDays,
      leaveType: '',
      reason: '',
      leaveStatus: '',
      filename: '',
      user:user,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("fromDate", values.fromDate);
      formData.append("tillDate", values.tillDate);
      formData.append("numberOfDays", values.numberOfDays);
      formData.append("leaveType", values.leaveType);
      formData.append("reason", values.reason);
      formData.append("leaveStatus", values.leaveStatus);
      formData.append("filename", values.filename);
      formData.append("user", JSON.stringify(user));
      if (values.file) formData.append("file", values.file);

      let url = "api/Leaves/Requests/new-request"; 

      axios({
        url,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        setSubmitting(false);
        handleClose();
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Request Added Successfully',
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
    const endpoints = [
      { url: 'api/Leaves/LeaveTypes', setter: setLeaveTypes },
      { url: 'api/Leaves/LeaveStatuses', setter: setLeaveStatus }
    ];

    const fetchData = async () => {
      try {
        const responses = await Promise.all(endpoints.map(endpoint => axios.get(endpoint.url)));
        responses.forEach((response, index) => {
          endpoints[index].setter(response.data);
        });
        
        const pendingStatus = responses[1].data.find(status => status.status === 'Pending');
        if (pendingStatus) {
          setFieldValue('leaveStatus', pendingStatus.leaveid);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setFieldValue]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
        <CircularProgressWithLabel />
      </Box>
    );
  }

  return (
    <>
      <PageHeader routeName="Leave Application" />
      <Box mb={4} />
      <PropDebugger propsToDebug={{ values, errors }} />
      <form onSubmit={handleSubmit}>
        <Box mb={2} display="flex" justifyContent="space-between" gap={2}>
          <TextField
            fullWidth
            id="fromDate"
            name="fromDate"
            label="From Date"
            value={values.fromDate}
            InputProps={{ readOnly: true }}
            margin="normal"
            disabled={true}
          />
          <TextField
            fullWidth
            id="tillDate"
            name="tillDate"
            label="Till Date"
            value={values.tillDate}
            InputProps={{ readOnly: true }}
            margin="normal"
            disabled={true}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            id="numberOfDays"
            name="numberOfDays"
            label="Number of working Days"
            value={values.numberOfDays}
            InputProps={{ readOnly: true }}
            margin="normal"
            disabled={true}
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth>
            <RequiredField title="Leave Type" isRequired={true} boldTitle={true}/>
            <Select
              labelId="leaveType-label"
              id="leaveType"
              name="leaveType"
              value={values.leaveType}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.leaveType && Boolean(errors.leaveType)}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type.requesttypeid} value={type.requesttypeid}>
                  {type.requesttype} - {type.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <RequiredField title="Reason" isRequired={false} boldTitle={true}/>
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
            rows={4}
            margin="normal"
          />
        </Box>
        <Box mb={2}>
          <Box
            sx={[styles.dropzone, dragActive && styles.dropzoneHover]}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload">
              <IoCloudUploadOutline size={32} color="#1976D2" />
              <Typography sx={styles.dropzoneText}>
                {dragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop supporting document here, or click to select (one file only)'}
              </Typography>
            </label>
          </Box>
          {values.file && (
            <Box sx={styles.fileInfo}>
              <Typography>
                {values.filename} ({formatFileSize(values.file.size)})
              </Typography>
              <Tooltip title="View">
                <IconButton
                  onClick={handleFileView}
                  sx={styles.viewButton}
                >
                  <MdVisibility size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={handleFileDelete}
                  sx={styles.deleteButton}
                >
                  <MdDelete size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {touched.file && errors.file && (
            <Typography color="error" sx={{ mt: 1 }}>{errors.file}</Typography>
          )}
        </Box>
        <DialogForm
          title={selectedFile?.name || 'File Preview'}
          content={
            selectedFile ? (
              <Box sx={{ height: '60vh', overflow: 'auto' }}>
                {selectedFile.type === 'application/pdf' ? (
                  <iframe
                    src={URL.createObjectURL(selectedFile)}
                    title={selectedFile.name}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    Preview not available for this file type.
                  </Typography>
                )}
              </Box>
            ) : null
          }
          open={dialogOpen}
          onClose={handleDialogClose}
        />
        <Box display="flex" justifyContent="flex-end">
          <FormButtons
            handleClose={handleClose}
            handleClearForm={handleClearForm}
            submitting={submitting}
            showStepperBack={false}
          />
        </Box>
      </form>
    </>
  );
};

export default LeaveRequestForm;