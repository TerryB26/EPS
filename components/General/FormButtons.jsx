import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { VscSend } from "react-icons/vsc";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { PiBroomLight } from "react-icons/pi";
import { Button, Grid } from "@mui/material";

const FormButtons = ({ handleClose, handleClearForm, submitting }) => {
  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} sm={12} sx={{
        display: "flex",
        justifyContent: "start"
      }}>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            backgroundColor: 'transparent',
            color: 'black',
            border: '1px solid transparent',
            '&:hover': {
              fontWeight: 'bold',
              borderColor: 'red',
              '& svg': {
                fontWeight: 'bold'
              }
            }
          }}
          startIcon={<IoMdCloseCircleOutline style={{ marginBottom: '-2px' }} />}
          onClick={handleClose}
        >
          close
        </Button>

        <Button
          variant="contained"
          color="inherit"
          sx={{
            backgroundColor: 'transparent',
            color: 'black',
            border: '1px solid transparent',
            '&:hover': {
              fontWeight: 'bold',
              borderColor: 'black',
              '& svg': {
                fontWeight: 'bold'
              }
            }
          }}
          startIcon={<PiBroomLight style={{ marginBottom: '-2px' }} />}
          onClick={handleClearForm}
        >
          Clear Form
        </Button>

        <LoadingButton
          type="submit"  // Ensure the button triggers form submission
          loading={submitting}
          variant="contained"
          sx={{ 
            backgroundColor: 'transparent', 
            color: 'black', 
            '&:hover': { 
              backgroundColor: '#83CED8',
              fontWeight: 'bold',
              '& svg': {
                fontWeight: 'bold'
              }
            } 
          }}
          endIcon={<VscSend style={{ marginBottom: '-4px' }} />}
        >
          Submit
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default FormButtons;