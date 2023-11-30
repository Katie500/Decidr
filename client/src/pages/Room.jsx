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
import io from 'socket.io-client';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const Room = ({}) => {
  const [pending, setPending] = useState(false);
  return (
    <>
      <Box className="topBarContainer">
        <Box container className="topBar widthConstraint">
          <IconButton className="topBarIcon">
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Where do we wanna eat?</Typography>
        </Box>
      </Box>

      <Grid className="container">
        <LoadingBackdrop open={pending} />
      </Grid>
    </>
  );
};

export default Room;
