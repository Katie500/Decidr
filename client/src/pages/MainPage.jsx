import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const socket = io.connect('http://localhost:3001');

// TODO:
// 1. ADD INPUT VALIDATION FOR ROOM CODE
// 2. APP ERROR MESSAGE IF ROOM CODE IS INVALID
const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [room, setRoom] = useState('');
  const { updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const handleVerify = () => {
    setPending(true);
    // Simulate pending state, HIT API to verify room
    // Assume room is verified:

    updateUserDetails({
      userID: 'User12345',
      isAdmin: false,
      nickname: '',
    });

    navigate('/nickname');

    setTimeout(() => {
      setPending(false);
    }, 1000);
  };

  const handleCreateRoom = () => {
    setPending(true);

    updateUserDetails({
      userID: 'User12345',
      roomID: Math.random().toString(36).substring(7),
      isAdmin: true, // Creating a room, make this true
    });

    // Simulate pending state, HIT API to create room
    setTimeout(() => {
      setPending(false);
      navigate('/nickname');
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
            onClick={handleCreateRoom}
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
