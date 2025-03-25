import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdSettingsBackupRestore } from "react-icons/md";
import { PiBroomLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";

const FormButtons = ({ handleClose, handleClearForm, submitting, showStepperBack = true, handleBack, activeStep }) => {
  const [showButtons, setShowButtons] = useState(false);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setShowButtons(true);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showButtons) {
        setShowButtons(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showButtons]);

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} sm={12} sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center"
      }}>
        {showButtons ? (
          <>
            {showStepperBack && (
              <Button
                variant="text"
                color="inherit"
                disabled={activeStep === 0} 
                sx={{
                  backgroundColor: 'transparent',
                  color: 'black',
                  boxShadow: 'none',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    border: '1px solid gray',
                    '& svg': {
                      fontWeight: 'bold'
                    }
                  }
                }}
                startIcon={<MdSettingsBackupRestore style={{ marginBottom: '-2px' }} />}
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button
              variant="text"
              color="inherit"
              sx={{
                backgroundColor: 'transparent',
                color: 'black',
                boxShadow: 'none',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  fontWeight: 'bold',
                  border: '1px solid red',
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
              variant="text"
              color="inherit"
              sx={{
                backgroundColor: 'transparent',
                color: 'black',
                boxShadow: 'none',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  fontWeight: 'bold',
                  border: '1px solid black',
                  '& svg': {
                    fontWeight: 'bold'
                  }
                }
              }}
              startIcon={<PiBroomLight style={{ marginBottom: '0px' }} />}
              onClick={handleClearForm}
            >
              Clear Form
            </Button>

            <LoadingButton
              type="submit"
              loading={submitting}
              variant="text"
              sx={{ 
                backgroundColor: 'transparent', 
                color: 'black', 
                boxShadow: 'none',
                border: 'none',
                '&:hover': { 
                  backgroundColor: '#83CED8',
                  fontWeight: 'bold',
                  '& svg': {
                    fontWeight: 'bold'
                  }
                } 
              }}
              endIcon={<VscSend style={{ marginBottom: '0px' }} />}
            >
              Submit
            </LoadingButton>
          </>
        ) : (
          <Button
            variant="text"
            color="inherit"
            sx={{
              backgroundColor: 'transparent',
              color: 'black',
              boxShadow: 'none',
              border: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                fontWeight: 'bold',
                '& svg': {
                  fontWeight: 'bold'
                }
              }
            }}
            onClick={handleDotsClick}
          >
            <MoreHorizIcon style={{ marginBottom: '-2px' }} />
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default FormButtons;