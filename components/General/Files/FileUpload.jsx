import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FaFileUpload } from 'react-icons/fa'
import { IoCloudUploadOutline } from "react-icons/io5"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import { MdDelete, MdExpandMore } from "react-icons/md"
import { MdExpandCircleDown } from "react-icons/md";

const FileUpload = ({title = "Documents", documentType = "pdf", allowMultiple = true}) => {
  const [file, setFile] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: documentType,
    multiple: allowMultiple
  })

  const handleFileUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('File uploaded successfully', response.data)
    } catch (error) {
      console.error('Error uploading file', error)
    }
  }

  const handleFileDelete = () => {
    setFile(null)
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    },
    dropzone: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '200px',
      border: '2px dashed #ECEBF9',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    dropzoneHover: {
      backgroundColor: '#e9e9e9'
    },
    dropzoneText: {
      marginTop: '10px',
      fontSize: '16px',
      color: '#666666'
    },
    button: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed'
    },
    buttonHover: {
      backgroundColor: '#0056b3'
    },
    accordion: {
      width: '80%',
      marginTop: '20px'
    },
    tableContainer: {
      width: '100%'
    }
  }

  return (
    <div style={styles.container}>
      <div
        {...getRootProps({
          style: isDragActive ? { ...styles.dropzone, ...styles.dropzoneHover } : styles.dropzone
        })}
      >
        <input {...getInputProps()} />
        <IoCloudUploadOutline size={50} />
        {isDragActive ? (
          <p style={styles.dropzoneText}>Drop the files here ...</p>
        ) : (
          <p style={styles.dropzoneText}>Drag & drop {title} here, or click to select files</p>
        )}
      </div>

      {file && (
        <Accordion style={styles.accordion}>
          <AccordionSummary
            expandIcon={<MdExpandCircleDown />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ backgroundColor: '#ECEBF9' }}
          >
            <Typography>Selected Files</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} style={styles.tableContainer}>
              <Table>
                <TableHead  sx={{ backgroundColor: '#ECEBF9' }}>
                  <TableRow>
                    <TableCell>Filename</TableCell>
                    <TableCell sx={{ width: '100px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{file.name}</TableCell>
                    <TableCell sx={{ width: '100px' }}>
                      <Tooltip title="Delete">
                        <IconButton onClick={handleFileDelete} sx={{ color: '#E7858B' }}>
                          <MdDelete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  )
}

export default FileUpload