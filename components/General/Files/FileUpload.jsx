import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Tooltip
} from '@mui/material';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdDelete, MdExpandCircleDown, MdVisibility } from 'react-icons/md';
import DialogForm from '@/components/General/DialogForm';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileUpload = ({
  title = 'Documents',
  documentType = 'application/pdf',
  allowMultiple = true,
  onFileUpload,
  triggerFileUpload = false,
  ApiUrl = '',
  EmployeeNumber = '',
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('EmployeeNumber', EmployeeNumber);

    try {
      await axios.post(ApiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('File uploaded successfully:', file.name);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = allowMultiple ? acceptedFiles : [acceptedFiles[0]];
    setFiles(newFiles);
    newFiles.forEach(file => {
      handleFileUpload(file);
      if (onFileUpload) onFileUpload(file);
    });
  }, [allowMultiple, onFileUpload, EmployeeNumber, ApiUrl]);

  useEffect(() => {
    if (triggerFileUpload && files.length > 0) {
      files.forEach(file => handleFileUpload(file));
    }
  }, [triggerFileUpload, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [documentType]: [] },
    multiple: allowMultiple,
  });

  const handleFileDelete = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileView = (file) => {
    setSelectedFile(file);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
  };

  return (
    <Box sx={styles.container}>
      <Box
        {...getRootProps()}
        sx={[styles.dropzone, isDragActive && styles.dropzoneHover]}
      >
        <input {...getInputProps()} />
        <IoCloudUploadOutline size={48} color="#1976D2" />
        <Typography sx={styles.dropzoneText}>
          {isDragActive
            ? 'Drop the files here...'
            : `Drag & drop ${title} here, or click to select`}
        </Typography>
      </Box>

      {files.length > 0 && (
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
                  {files.map((file, index) => (
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
      <DialogForm
        title={selectedFile?.name || 'File Preview'}
        content={
          selectedFile && (
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
          )
        }
        open={dialogOpen}
        onClose={handleDialogClose}
        width="md"
      />
    </Box>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    mx: 'auto',
    my: 2,
  },
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
    '&:hover': {
      bgcolor: '#E8F0FE',
      borderColor: '#1565C0',
    },
  },
  dropzoneHover: {
    bgcolor: '#E8F0FE',
    borderStyle: 'solid',
    borderColor: '#1565C0',
  },
  dropzoneText: {
    mt: 2,
    fontSize: '1rem',
    color: '#424242',
    textAlign: 'center',
  },
  accordion: {
    mt: 2,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:before': { display: 'none' },
  },
  accordionSummary: {
    bgcolor: '#ECEBF9',
    borderRadius: '8px 8px 0 0',
    px: 2,
    py: 1,
  },
  accordionDetails: {
    p: 0,
  },
  tableContainer: {
    borderRadius: '0 0 8px 8px',
    overflow: 'hidden',
  },
  tableHead: {
    bgcolor: '#ECEBF9',
  },
  tableCellHeader: {
    fontWeight: 'medium',
    color: '#424242',
  },
  tableRow: {
    '&:hover': {
      bgcolor: '#F5F5F5',
    },
  },
  viewButton: {
    color: '#1976D2',
    '&:hover': {
      color: '#1565C0',
      bgcolor: '#E8F0FE',
    },
  },
  deleteButton: {
    color: '#E57373',
    '&:hover': {
      color: '#D32F2F',
      bgcolor: '#FFEBEE',
    },
  },
};

export default FileUpload;