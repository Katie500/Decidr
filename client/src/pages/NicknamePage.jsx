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
import createUser from '../api/createUser';
import { SocketContext } from '../contexts/SocketContext';
import SelectAvatarMenu from './Room/SelectAvatarMenu';

const NicknamePage = () => {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails?.nickname) {
      setName(userDetails.nickname);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails?.profilePicture) {
      setAvatar(userDetails.profilePicture);
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

  const handleStart = async () => {

    // Check if user has a name
    if (!name) {
      setError('Please enter a name.');
      return;
    }

  // Check if the user has selected a profile picture
  if (!avatar) {
    setError('Please select a profile picture.');
    console.log("Please select avatar");
    return;
  }

    setPending(true);

    if (userDetails?.isAdmin) {
      updateUserDetails({
        nickname: name,
        profilePicture: avatar,
      });
      navigate('/StartNewRoom');
    } else {
      // CREATE USER HERE
      if (socket) {
        const userID = await createUser({
          username: name,
          socketID: socket.id,
          profilePicture: avatar,
          roomID: userDetails.roomID,
        });
        updateUserDetails({
          nickname: name,
          profilePicture: avatar,
          userID: userID,
        });
        socket.emit('join_room', userDetails.roomID);
        navigate('/room');
      } else {
        console.error('SOCKET NOT FOUND in NicknamePage');
        return;
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box className="topBar widthConstraint">
          <IconButton className="topBarIcon" onClick={handleBack}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Profile</Typography>
        </Box>
      </Box>

      <Grid className="container">


        <Box className="contentBox widthConstraint">        

          <SelectAvatarMenu onSelectAvatar={(selectedAvatar) => {
        setAvatar(selectedAvatar);
        console.log('Avatar set in NicknamePage:', selectedAvatar);
      }} />  

                      <br></br>
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
              error={error ? true : false}
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
