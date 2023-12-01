import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const NicknamePage = () => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails?.nickname) {
      setName(userDetails.nickname);
    }
  }, [userDetails]);

  const handleAnonymousName = () => {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    }); // e.g big-donkey
    setName(shortName);
    setError('');
  };

  const handleStart = () => {
    if (!name) {
      setError('Please enter a name.');
      return;
    }
    setPending(true);
    updateUserDetails({
      nickname: name,
    });

    setTimeout(() => {
      setPending(false);
      if (userDetails?.isAdmin) {
        navigate('/StartNewRoom');
      } else {
        navigate('/room');
      }
    }, 1000);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box container className="topBar widthConstraint">
          <IconButton className="topBarIcon" onClick={handleBack}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Choosing a name</Typography>
        </Box>
      </Box>

      <Grid className="container">
        <Box className="contentBox widthConstraint">
          <Typography variant="h6">Enter a nickname:</Typography>
          <Box className="inputBox">
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              error={error}
              helperText={error}
            />
            <Button variant="contained" onClick={handleStart}>
              Go
            </Button>
          </Box>
          <Typography variant="h6" margin={1} textAlign={'center'}>
            or
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleAnonymousName}
            fullWidth
          >
            Give me an anonymous name
          </Button>
        </Box>
        <LoadingBackdrop open={pending} />
      </Grid>
    </>
  );
};

export default NicknamePage;
