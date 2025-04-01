import DialogForm from '@/components/General/DialogForm';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { MdFormatListBulletedAdd, MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import SystemDocsForm from './SystemDocsForm';
import { TbCloudDownload } from "react-icons/tb";

const PaginationContainer = styled('div')(({ theme }) => ({
  '& .MuiTablePagination-selectRoot': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiTablePagination-select': {
    minWidth: '50px',
  },
}));

const CustomTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#ECEBF9',
}));

const AddUserButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  '&:hover': {
    backgroundColor: "#ECEBF9",
  },
}));

const SystemDocsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [roles, setRoles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocs = async () => {
    try {
      const response = await axios.get('/api/SystemDocs');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = roles.filter(role =>
    role.documenttitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDialogOpen = (doc = null) => {
    setSelectedDoc(doc);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchDocs();
  };

  const handleDeleteRole = async (DocUUID) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this document?',
      text: "This will only remove the database record, not the file itself.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await axios.delete(`/api/SystemDocs/delete-doc`, { data: { DocUUID } });
          Swal.fire(
            'Deleted!',
            'Document record has been deleted successfully.',
            'success'
          );
          fetchDocs(); 
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the document record.',
            'error'
          );
        }
      }
    });
  };

  const handleDownloadDoc = async (documentuuid, documentname) => {
    try {
      const response = await axios.get(`/api/SystemDocs/Download-doc?documentuuid=${encodeURIComponent(documentuuid)}&documentname=${encodeURIComponent(documentname)}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentname);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download the document.',
      });
      console.error('Download error:', error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          placeholder='Search by Document Title'
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          style={{ marginRight: '20px' }}
          InputProps={{
            style: {
              height: '40px',
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#550000',
              },
              '&:hover fieldset': {
                borderColor: '#ff0000',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#550000',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearSearch}
          startIcon={<SearchOffIcon sx={{ color: '#550000' }} />}
          sx={{
            height: '40px',
            backgroundColor: 'white',
            border: '1px solid #550000',
            color: '#550000',
            '&:hover': {
              backgroundColor: 'white',
              border: '1px solid #ff0000',
              color: '#ff0000',
            },
          }}
        >
          Clear
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <AddUserButton variant="contained" endIcon={<MdFormatListBulletedAdd />} onClick={() => handleDialogOpen()}>
          Add Document
        </AddUserButton>
      </Box>
      <DialogForm
        title={selectedDoc ? "Edit Document" : "Add Document"}
        content={<SystemDocsForm handleClose={handleDialogClose} docData={selectedDoc} />}
        open={isDialogOpen}
        onClose={handleDialogClose}
        width='sm'
      />
      <TableContainer component={Paper}>
        <Table>
          <CustomTableHead>
            <TableRow>
              <TableCell>Document Title</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Uploaded On</TableCell>
              <TableCell sx={{ width: '150px' }}>Actions</TableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {filteredDocs.length > 0 ? (
              filteredDocs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(doc => (
                <TableRow key={doc.documentuuid} sx={{
                  '&:hover': {
                    backgroundColor: '#E4F2FF',
                  },
                }}>
                  <TableCell>{doc.documenttitle}</TableCell>
                  <TableCell>{doc.documenttype}</TableCell>
                  <TableCell>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(doc.createdon))}</TableCell>
                  <TableCell sx={{ width: '150px' }}>
                    <Tooltip title="Download Document">
                      <IconButton sx={{ color: '#939FBD' }} onClick={() => handleDownloadDoc(doc.documentuuid, doc.documentname)}>
                        <TbCloudDownload />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: '#E7858B' }} onClick={() => handleDeleteRole(doc.documentuuid)}>
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No records to display
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDocs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PaginationContainer>
    </div>
  );
};

export default SystemDocsTable;