import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { useNavigate } from 'react-router-dom';

const MainPage = ({ room, userID }) => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAnonymousName = () => {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    }); // e.g big-donkey
    setName(shortName);
  };

  const handleStart = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      navigate('/room', { state: { room, userID, name } });
    }, 2000);
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box container className="topBar widthConstraint">
          <IconButton className="topBarIcon">
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Decidr</Typography>
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
              onChange={(e) => setName(e.target.value)}
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

export default MainPage;
