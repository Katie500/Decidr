import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';

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
    <Container
      style={{
        height: '98vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          style={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'lighter',
            marginTop: '1rem',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          Decidr
        </Typography>
      </Box>
      {/* TODO: 'MAKE THIS CONTENT IN THE GRID BELOW TO SHOW UP IN THE CENTER */}
      <Box
        style={{
          gap: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">Enter code for an existing session</Typography>
        <Box style={{ display: 'flex', gap: 2, marginTop: '1rem' }}>
          <TextField
            fullWidth
            label="Session Code"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleVerify}
            sx={{
              minWidth: 'initial',
            }}
          >
            Verify
          </Button>
        </Box>

        <Typography
          variant="h6"
          style={{
            width: '100%',
            textAlign: 'center',
            display: 'block',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          or
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{
            width: '100%',
            backgroundColor: (theme) => theme.palette.success.light,
          }}
          onClick={handleStart}
        >
          Start a new session
        </Button>
      </Box>
      <LoadingBackdrop open={pending} />
    </Container>
  );
};

export default MainPage;
