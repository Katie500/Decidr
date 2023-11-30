import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io.connect('http://localhost:3001');
const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [room, setRoom] = useState('');

  const navigate = useNavigate();

  const handleVerify = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 1000);
  };

  const handleStart = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      navigate('/nickname', { state: { room } });
    }, 1000);
  };

  return (
    <>
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
          <Typography variant="h6">Enter code for an existing room:</Typography>
          <Box className="inputBox">
            <TextField
              fullWidth
              label="Room Code"
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
            Start a new room
          </Button>
        </Box>
        <LoadingBackdrop open={pending} />
      </Grid>
    </>
  );
};

export default MainPage;
