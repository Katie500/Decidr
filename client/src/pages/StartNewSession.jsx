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
import React, { useEffect, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import './StartNewSession.css';

const StartNewSession = () => {
  const [pending, setPending] = useState(true);
  const [sessionCode, setSessionCode] = useState('X12AYZ');
  const [duration, setDuration] = useState('');
  const [votes, setVotes] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setPending(false);
    }, 1000);
    // setSessionCode(generateSessionCode());
  });

  const handleVerify = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 1000);
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
        <Box container className="topBar widthConstraint">
          <IconButton className="topBarIcon">
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Start a new session</Typography>
        </Box>
      </Box>
      <Grid className="container">
        <Box className="contentBox widthConstraint">
          <Grid margin={1}>
            <Typography variant="h6">Your session code is:</Typography>
            <Box className="session">
              <Typography
                variant="h4"
                textAlign={'center'}
                fontStyle={'italic'}
                marginTop={1.5}
              >
                {sessionCode}
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
            />
          </Grid>
          <Grid margin={1}>
            <Typography variant="h6">Enter session duration:</Typography>
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
            onClick={handleVerify}
            fullWidth
            className="sessionButton"
          >
            Start Session
          </Button>
        </Box>
      </Grid>
      <LoadingBackdrop open={pending} />
    </>
  );
};

export default StartNewSession;
