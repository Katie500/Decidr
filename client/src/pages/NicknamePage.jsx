import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';

const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');

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
      <Box className="contentBox widthConstraint">
        <Typography variant="h6">Enter a nickname:</Typography>
        <Box className="inputBox">
          <TextField fullWidth label="Name" variant="outlined" size="small" />
          <Button variant="contained" onClick={handleVerify}>
            Go
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
          Give me an anonymous name
        </Button>
      </Box>
      <LoadingBackdrop open={pending} />
    </Grid>
  );
};

export default MainPage;
