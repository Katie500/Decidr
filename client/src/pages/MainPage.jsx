import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import '../styles/SharedStyles.css';

const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [sessionCode, setSessionCode] = useState('');

  const handleVerify = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 2000);
  };

  const handleStart = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 2000);
  };

  return (
    <Grid className="container">
      <Box>
        <Typography
          variant="h4"
          className="title"
          marginTop={2}
          textAlign={'center'}
        >
          Decidr
        </Typography>
      </Box>
      <Box className="contentBox">
        <Typography variant="h6">
          Enter code for an existing session:
        </Typography>
        <Box className="inputBox">
          <TextField
            fullWidth
            label="Session Code"
            variant="outlined"
            size="small"
          />
          <Button variant="contained" onClick={handleVerify}>
            Verify
          </Button>
        </Box>
        <Typography variant="h6" margin={1} textAlign={'center'}>
          or
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleStart}
          fullWidth
        >
          Start a new session
        </Button>
      </Box>
      <LoadingBackdrop open={pending} />
    </Grid>
  );
};

export default MainPage;
