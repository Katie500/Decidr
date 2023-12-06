import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { verifyRoom } from '../api/verifyRoom';


const MainPage = () => {
  const [pending, setPending] = useState(false);
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const { updateUserDetails } = useContext(UserContext);
  const [musicPlayed, setMusicPlayed] = useState(false);


  const musicAudio = new Audio('/PeaceTheme.mp3');
  function playMusicAudio(volume = 1) {
    musicAudio.volume = volume;
  
    // Check if the music has been played in this session
    const musicPlayedInSession = sessionStorage.getItem('musicPlayedInSession');
    if (!musicPlayedInSession) {
      musicAudio.loop = true;
      musicAudio.play();
      sessionStorage.setItem('musicPlayedInSession', 'true');
    }
  }
  

  const navigate = useNavigate();


  const handleVerify = async () => {
    setPending(true);
    if (room) {
      const lowercaseRoom = room.toLowerCase();
      const roomIsActive = await verifyRoom(lowercaseRoom);
      setPending(false);

      updateUserDetails({
        roomID: lowercaseRoom,
        isAdmin: false, // Joining a room, make this false
      });

      if (roomIsActive) {
        playMusicAudio();
        navigate('/Nickname');
      } else {
        setError('Room does not exist.');
      }
    } else {
      setError('Please enter a room code.');
      setPending(false);
    }
  };

  const handleCreateRoom = () => {
    playMusicAudio();
    updateUserDetails({
      isAdmin: true, // Creating a room, make this true
    });
    navigate('/nickname');
  };

  return (
    <>

      <Grid className="container" >
      
        <Box display="flex" justifyContent="center" alignItems="center">
        <img
              src="/Decidr.gif" 
              alt="Decidr GIF" 
              style={{ width: '100%', maxWidth: '400px', display: 'block', marginLeft: '20%' }}
              className='title'
            />
            
        </Box>
        <Box className="contentBox widthConstraint" paddingTop={"45%"}>
        
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
