import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
// TODO:

const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const { updateUserDetails } = useContext(UserContext);
  const socket = useContext(SocketContext);

  const navigate = useNavigate();

  const handleVerify = () => {
    setPending(true);
    if (room) {
      if (socket) {
        socket.emit('check_room', room, (roomExists) => {
          if (roomExists) {
            updateUserDetails({
              userID: 'User12345', // TODO: Change this to actual user ID
              roomID: room,
              isAdmin: false,
              nickname: '',
            });

            socket.emit('join_room', room);

            navigate('/Nickname');
          } else {
            setError('Room does not exist.');
            setPending(false);
          }
        });
      } else {
        setError('Socket not found in MainPage.jsx.');
        setPending(false);
      }
    } else {
      setError('Please enter a room code.');
      setPending(false);
    }
  };

  const handleCreateRoom = () => {
    setPending(true);

    // TODO: WE NEED AN API TO GET A USER_ID
    updateUserDetails({
      userID: 'User12345',
      roomID: '',
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
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setError('');
              }}
              error={error ? true : false}
              helperText={error}
            />
            <Button variant="contained" onClick={handleVerify} size="small">
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
