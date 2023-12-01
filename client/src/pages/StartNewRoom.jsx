import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import './StartNewRoom.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const StartNewRoom = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState(5);
  const [votes, setVotes] = useState(1);
  const [roomCode, setRoomCode] = useState(
    Math.random().toString(36).substring(7)
  ); // TODO: Generate room code

  const { userDetails, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if user details are not present, redirect to home page
    if (!userDetails?.userID && !userDetails?.nickname) {
      navigate('/');
      alert('User not found');
    }
    // setSessionCode(generateSessionCode());
  }, []);

  const handleCreate = () => {
    if (!question) {
      setError('Please enter a question.');
      return;
    }
    setPending(true);
    setTimeout(() => {
      setPending(false);
      updateUserDetails({
        roomID: roomCode,
      });
      navigate('/room');
    }, 1000);
  };

  const handleBack = () => {
    navigate('/nickname');
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };
  const handleVotesChange = (event) => {
    setVotes(event.target.value);
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box className="topBar widthConstraint">
          <IconButton className="topBarIcon" onClick={handleBack}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">
            {userDetails?.nickname}'s new room
          </Typography>
        </Box>
      </Box>
      <Grid className="container">
        <Box className="contentBox widthConstraint">
          <Grid margin={1}>
            <Typography variant="h6">Your room code is:</Typography>
            <Box className="room">
              <Typography
                variant="h4"
                textAlign={'center'}
                fontStyle={'italic'}
                marginTop={1.5}
                textTransform={'uppercase'}
              >
                {roomCode}
              </Typography>
              <IconButton>
                <ContentCopyOutlinedIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid margin={1}>
            <Typography variant="h6">Enter your question:</Typography>
            <TextField
              fullWidth
              label="Enter your Question "
              variant="outlined"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError('');
              }}
              error={error ? true : false}
              helperText={error}
            />
          </Grid>
          <Grid margin={1}>
            <Typography variant="h6">Enter room duration:</Typography>
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={duration}
                label="Duration"
                onChange={handleDurationChange}
              >
                {[...Array(10).keys()].map((num) => (
                  <MenuItem key={num} value={num + 1}>
                    {num + 1} min
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid margin={1} marginBottom={2}>
            <Typography variant="h6">Votes per person:</Typography>
            <FormControl fullWidth>
              <InputLabel>Votes</InputLabel>
              <Select value={votes} label="Votes" onChange={handleVotesChange}>
                {[...Array(5).keys()].map((num) => (
                  <MenuItem key={num} value={num + 1}>
                    {num + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreate}
            fullWidth
            className="sessionButton"
          >
            Start Room
          </Button>
        </Box>
      </Grid>
      <LoadingBackdrop open={pending} />
    </>
  );
};

export default StartNewRoom;
