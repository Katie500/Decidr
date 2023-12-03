import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../../contexts/UserContext';
import PermanentDrawerLeft from './Drawer';
import VotingOptionCard from './VotingOptionCard';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';
import { getRoomDetails } from '../../api/getRoomDetails';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const dummyVotingOptions = [
  {
    optionID: '1',
    text: 'Tim Hortons',
    votes: [], // Array of userIDs who voted for this option
  },
  {
    optionID: '2',
    text: 'McDonalds',
    votes: [], // Array of userIDs who voted for this option
  },
];
const dummyUsers = [
  {
    userID: '1',
    username: 'User1',
  },
  {
    userID: '2',
    username: 'User2',
  },
];

const drawerWidth = 240;
const Room = () => {
  const [pending, setPending] = useState(true);
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const [users, setUsers] = useState(dummyUsers); // users state
  const [userVoteCount, setUserVoteCount] = useState(0); // User vote count state
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0);
  const hideDesktopDrawer = useMediaQuery((theme) =>
    theme.breakpoints.down('md')
  );
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    roomID: '',
    question: '',
    ownerUserID: '',
    numberOfVotesPerUser: 1,
    endTime: '',
  });

  useEffect(() => {
    if (userDetails.isAdmin) {
      setPending(false);
      fetchRoomDetails();
      return;
    } else {
      fetchRoomDetails();
    }
  }, [userDetails.roomID]); // Include userDetails.roomID in the dependency array if it can change

  const fetchRoomDetails = async () => {
    try {
      if (!userDetails.roomID) {
        navigate('/');
        alert('Room ID not found. Please try again.');
      }
      if (!userDetails.userID) {
        navigate('/');
        alert('User ID not found. Please try again.');
      }
      const roomDetails = await getRoomDetails(userDetails.roomID);
      setRoomDetails({ ...roomDetails, numberOfVotesPerUser: 1 });
      setPending(false);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
    }
  };

  const userID = userDetails.userID;
  const username = userDetails.nickname;

  const closeNewOptionModal = () => {
    setOpenNewOption(false);
  };

  const handleAddNewOption = () => {
    if (!newOptionText) {
      setOpenNewOption(false);
      return;
    }
    setVotingOptions([
      {
        optionID: (votionOptions.length + 1).toString(),
        text: newOptionText,
        votes: [],
      },
      ...votionOptions,
    ]);
    setNewOptionText('');
    setOpenNewOption(false);
  };

  const handleAddVote = (optionID) => {
    // Check if the user has any votes left
    if (userVoteCount >= roomDetails.numberOfVotesPerUser) {
      return;
    }
    const votedOption = votionOptions.find(
      (option) => option.optionID === optionID
    );

    setVotingOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.optionID === optionID
          ? { ...option, votes: [...option.votes, userID] }
          : option
      )
    );
    setUserVoteCount((prevCount) => prevCount + 1);

    // Add a notification for the vote
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `${username} voted for ${votedOption.text}`,
    ]);
  };

  const handleRemoveVote = (optionID) => {
    let unvoteSuccess = false;
    // NOTE: REMOVING ONLY THE FIRST OCCURRENCE OF THE USER'S VOTE
    setVotingOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.optionID === optionID) {
          // Find the index of the first occurrence of the user's vote
          const indexToRemove = option.votes.indexOf(userID);
          if (indexToRemove !== -1) {
            unvoteSuccess = true;
            // Create a new array excluding the first occurrence of the user's vote
            return {
              ...option,
              votes: [
                ...option.votes.slice(0, indexToRemove),
                ...option.votes.slice(indexToRemove + 1),
              ],
            };
          }
        }
        return option;
      })
    );

    if (unvoteSuccess) {
      setUserVoteCount((prevCount) => prevCount - 1); // Decrement the user's vote count
      // Add a notification for the unvote
      const optionText = votionOptions.find(
        (option) => option.optionID === optionID
      ).text;
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${username} unvoted for ${optionText}`,
      ]);
    }
  };

  const handleCancelSession = () => {
    console.log('Session cancelled!');
  };

  const sessionCancelled = false;

  // Function to calculate remaining time in seconds
  const calculateRemainingTimeInSeconds = (endTime) => {
    const now = dayjs();
    const end = dayjs(endTime);
    const differenceInSeconds = end.diff(now, 'second');
    return differenceInSeconds > 0 ? differenceInSeconds : 0;
  };

  // ===== HANDLING THE REMAINING TIME: ======//
  // useEffect to set the remaining time and update it every second
  useEffect(() => {
    setRemainingTimeInSeconds(
      calculateRemainingTimeInSeconds(roomDetails.endTime)
    );
    const interval = setInterval(() => {
      setRemainingTimeInSeconds((prevTime) => {
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [roomDetails.endTime]); // Dependency on roomDetails.endTime
  // Convert seconds to minutes and seconds for display
  const minutes = Math.floor(remainingTimeInSeconds / 60);
  const seconds = remainingTimeInSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  // ===== END OF HANDLING THE REMAINING TIME ===== //

  return (
    <>
      {!sessionCancelled && (
        <PermanentDrawerLeft
          drawerWidth={drawerWidth}
          open={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          onCancelSession={handleCancelSession}
        />
      )}
      {sessionCancelled ? (
        // We can fix closing a room(session) later
        <Typography variant="h4" align="center">
          Session has been cancelled.
        </Typography>
      ) : (
        <Grid
          className="container roomWrapper"
          sx={{
            marginLeft: hideDesktopDrawer ? '0px' : '240px',
          }}
        >
          <Box className="widthConstraint contentBox">
            <Box className="headerBox">
              {/* ONLY SHOW HAMBURGER ON MOBILE*/}
              {hideDesktopDrawer && (
                <IconButton
                  className="menuIcon"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Typography>
                Room:
                <span
                  style={{ textTransform: 'uppercase', fontStyle: 'italic' }}
                >
                  {userDetails.roomID || 'XXXXXX'}
                </span>
              </Typography>
              <Typography className="timeText">
                Time Left:{' '}
                <span style={{ fontWeight: 'bold', color: 'red' }}>
                  {paddedMinutes}:{paddedSeconds}
                </span>
              </Typography>
            </Box>
            <Typography
              variant="h5"
              fontStyle={'italic'}
              width={'100%'}
              textAlign={'center'}
            >
              {roomDetails.question}
            </Typography>
            <Box
              style={{
                flexGrow: 1,
                overflowY: 'scroll',
              }}
            >
              {votionOptions.map((option, index) => (
                <VotingOptionCard
                  key={index}
                  name={option.text}
                  votes={option.votes}
                  totalAvailableVotes={
                    users.length * roomDetails.numberOfVotesPerUser
                  }
                  numerOfUserVotes={
                    option.votes.filter((vote) => vote === userID).length
                  }
                  handleAddVote={() => handleAddVote(option.optionID)}
                  handleRemoveVote={() => handleRemoveVote(option.optionID)}
                />
              ))}
            </Box>
            <Box className="footerBox">
              <Typography variant="h6" fontStyle={'italic'}>
                You have {roomDetails.numberOfVotesPerUser - userVoteCount}/
                {roomDetails.numberOfVotesPerUser} votes left.
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenNewOption(true)}
              >
                New Voting Option
              </Button>
            </Box>
          </Box>
        </Grid>
      )}
      <AddNewOptionModal
        open={openNewOption}
        handleAdd={handleAddNewOption}
        handleClose={closeNewOptionModal}
        newOptionText={newOptionText}
        setNewOptionText={setNewOptionText}
      />
      <LoadingBackdrop open={pending} />
    </>
  );
};

export default Room;
