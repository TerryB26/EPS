import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  TextField, 
  Box, 
  MenuItem, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip,
  Dialog
} from '@mui/material';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdExpandCircleDown, MdVisibility, MdDelete } from 'react-icons/md';
import axios from 'axios';
import MySwal from 'sweetalert2';
import RequiredField from "@/components/General/RequiredField";
import FormButtons from "@/components/General/FormButtons";
import DialogForm from '@/components/General/DialogForm';

const validationSchema = yup.object({
  documentTitle: yup.string().required("Document Title is required"),
  documentType: yup.string().required("Document Type is required"),
  files: yup.array().min(1, "At least one file is required").required("Files are required"),
});

const docTypes = ["Manual", "Policy", "Procedure", "Work Instruction", "Template"];

const styles = {
  container: { maxWidth: '600px', mx: 'auto', my: 2 },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    border: '2px dashed #1976D2',
    borderRadius: '12px',
    bgcolor: '#F5F8FA',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': { bgcolor: '#E8F0FE', borderColor: '#1565C0' },
  },
  dropzoneHover: { bgcolor: '#E8F0FE', borderStyle: 'solid', borderColor: '#1565C0' },
  dropzoneText: { mt: 2, fontSize: '1rem', color: '#424242', textAlign: 'center' },
  accordion: { mt: 2, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', '&:before': { display: 'none' } },
  accordionSummary: { bgcolor: '#ECEBF9', borderRadius: '8px 8px 0 0', px: 2, py: 1 },
  accordionDetails: { p: 0 },
  tableContainer: { borderRadius: '0 0 8px 8px', overflow: 'hidden' },
  tableHead: { bgcolor: '#ECEBF9' },
  tableCellHeader: { fontWeight: 'medium', color: '#424242' },
  tableRow: { '&:hover': { bgcolor: '#F5F5F5' } },
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

const SystemDocsForm = ({ handleClose, docData }) => {
  const [submitting, setSubmitting] = useState(false);
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
      setFieldValue("files", [...values.files, ...e.dataTransfer.files]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFieldValue("files", [...values.files, ...e.target.files]);
  };

  const handleFileView = (file) => {
    setSelectedFile(file);
    setDialogOpen(true);
  };

  const handleFileDelete = (index) => {
    const newFiles = values.files.filter((_, i) => i !== index);
    setFieldValue("files", newFiles);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, resetForm, setValues, setFieldValue } = useFormik({
    initialValues: { documentTitle: "", documentType: "", files: [] },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("documentTitle", values.documentTitle);
      formData.append("documentType", values.documentType);
      values.files.forEach((file) => formData.append("files", file));
      if (docData) formData.append("documentID", docData.documentid);

      const url = docData ? "/api/SystemDocs/edit-doc" : "/api/SystemDocs/add-doc";

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
          text: docData ? 'Document updated successfully' : 'Document added successfully',
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
    if (docData) {
      setValues({
        documentTitle: docData.documenttitle || "",
        documentType: docData.documenttype || "",
        files: [],
      });
    }
  }, [docData, setValues]);

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          id="documentTitle"
          name="documentTitle"
          label={<RequiredField title="Document Title" />}
          value={values.documentTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.documentTitle && Boolean(errors.documentTitle)}
          helperText={touched.documentTitle && errors.documentTitle}
        />
      </Box>
      <Box mb={2}>
        <TextField
          select
          fullWidth
          id="documentType"
          name="documentType"
          label={<RequiredField title="Document Type" />}
          value={values.documentType}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.documentType && Boolean(errors.documentType)}
          helperText={touched.documentType && errors.documentType}
        >
          {docTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={styles.container}>
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
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload">
            <IoCloudUploadOutline size={48} color="#1976D2" />
            <Typography sx={styles.dropzoneText}>
              {dragActive
                ? 'Drop the files here...'
                : 'Drag & drop files here, or click to select'}
            </Typography>
          </label>
        </Box>
        {values.files.length > 0 && (
          <Accordion sx={styles.accordion}>
            <AccordionSummary
              expandIcon={<MdExpandCircleDown size={24} color="#1976D2" />}
              sx={styles.accordionSummary}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                Selected Files
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.accordionDetails}>
              <TableContainer component={Paper} elevation={1} sx={styles.tableContainer}>
                <Table>
                  <TableHead sx={styles.tableHead}>
                    <TableRow>
                      <TableCell sx={styles.tableCellHeader}>Filename</TableCell>
                      <TableCell sx={styles.tableCellHeader}>Size</TableCell>
                      <TableCell sx={{ width: 120, ...styles.tableCellHeader }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.files.map((file, index) => (
                      <TableRow key={index} sx={styles.tableRow}>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton
                              onClick={() => handleFileView(file)}
                              sx={styles.viewButton}
                            >
                              <MdVisibility size={20} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleFileDelete(index)}
                              sx={styles.deleteButton}
                            >
                              <MdDelete size={20} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
        {touched.files && errors.files && (
          <Typography color="error" sx={{ mt: 1 }}>{errors.files}</Typography>
        )}
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
      </Box>
      <FormButtons handleClose={handleClose} handleClearForm={handleClearForm} submitting={submitting} />
    </form>
  );
};

export default SystemDocsForm;