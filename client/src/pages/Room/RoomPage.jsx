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
import { SocketContext } from '../../contexts/SocketContext';
import CustomDrawer from './Drawer';
import VotingOptionCard from './VotingOptionCard';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';
import { getRoomDetails } from '../../api/getRoomDetails';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import EventLog from './EventLog';

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

const views = {
  VOTING: 'VOTING',
  EVENT: 'EVENT',
};

const broadcastingEventTypes = {
  ADD_VOTE: 'ADD_VOTE',
  REMOVE_VOTE: 'REMOVE_VOTE',
  ADD_OPTION: 'ADD_OPTION',
  USER_CONNECTED: 'USER_CONNECTED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
};

const drawerWidth = 240;
const Room = () => {
  const [pending, setPending] = useState(true);
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const [users, setUsers] = useState([]); // users state
  const [userVoteCount, setUserVoteCount] = useState(0); // User vote count state
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [eventLog, setEventLog] = useState([]);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0);
  const [view, setView] = useState(views.VOTING); // View state
  const socket = useContext(SocketContext);
  const userID = userDetails.userID;
  const username = userDetails.nickname;
  const navigate = useNavigate();
  const hideDesktopDrawer = useMediaQuery((theme) =>
    theme.breakpoints.down('md')
  );
  const [roomDetails, setRoomDetails] = useState({
    roomID: '',
    question: '',
    ownerUserID: '',
    numberOfVotesPerUser: 3,
    endTime: '',
  });
  const [localRoomID, setLocalRoomID] = useState(null);

  useEffect(() => {
    if (userDetails.roomID !== localRoomID) {
      fetchRoomDetails();
      setLocalRoomID(userDetails.roomID);
      sendBroadcast(
        broadcastingEventTypes.USER_CONNECTED,
        { userID, username },
        `${username} has joined the room`
      );
    }
  }, [userDetails.roomID]); // Only re-run effect if userDetails.roomID

  const fetchRoomDetails = async () => {
    try {
      if (!userDetails.roomID) {
        navigate('/');
        alert('Room ID not found. Please try again.');
        return;
      }
      if (!userDetails.userID) {
        navigate('/');
        alert('User ID not found. Please try again.');
        return;
      }
      const { roomDetails, users } = await getRoomDetails(userDetails.roomID);
      setRoomDetails({ ...roomDetails, numberOfVotesPerUser: 3 });
      setUsers(users);
      setPending(false);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
    }
  };

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

  // ====== ADDING VOTES ====== //
  const handleAddVote = (optionID) => {
    // Check if the user has any votes left
    if (userVoteCount >= roomDetails.numberOfVotesPerUser) {
      return;
    }

    addVote(userID, optionID);
    setUserVoteCount((prevCount) => prevCount + 1);

    // TODO: Call API to update the vote in the database
    const votedOption = votionOptions.find(
      (option) => option.optionID === optionID
    );
    const eventMessage = `${username} voted for ${votedOption.text}`;
    sendBroadcast(
      broadcastingEventTypes.ADD_VOTE,
      { userID, optionID },
      eventMessage
    );
  };
  const addVote = (userID, optionID) => {
    setVotingOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.optionID === optionID
          ? { ...option, votes: [...option.votes, userID] }
          : option
      )
    );
  };
  // ====== END OF ADDING VOTES ====== //

  // ====== REMOVING VOTES ====== //
  const handleRemoveVote = (optionID) => {
    if (removeVote(userID, optionID)) {
      setUserVoteCount((prevCount) => prevCount - 1); // Decrement the user's vote count

      // TODO: Call API to update the vote in the database

      // Add a notification for the unvote
      const optionText = votionOptions.find(
        (option) => option.optionID === optionID
      ).text;
      const eventMessage = `${username} unvoted for ${optionText}`;
      sendBroadcast(
        broadcastingEventTypes.REMOVE_VOTE,
        { userID, optionID },
        eventMessage
      );
    }
  };

  const removeVote = (userID, optionID) => {
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
    return unvoteSuccess;
  };

  // ====== END OF REMOVING VOTES ====== //

  const sendBroadcast = async (eventType, eventData, eventMessage) => {
    const broadcastData = {
      room: userDetails.roomID,
      author: userID,
      eventType: eventType,
      eventData: eventData,
      eventMessage: eventMessage,
      timeStamp: dayjs().format('HH:mm:ss'),
    };
    await socket.emit('send_message', broadcastData);
  };

  // LISTEN FOR BROADCASTS
  useEffect(() => {
    const messageHandler = (data) => {
      if (data) {
        if (data.eventType === broadcastingEventTypes.ADD_VOTE) {
          // Update the state to reflect the new vote
          const { userID, optionID } = data.eventData;
          addVote(userID, optionID);
        }
        if (data.eventType === broadcastingEventTypes.REMOVE_VOTE) {
          // Update the state to reflect the removed vote
          const { userID, optionID } = data.eventData;
          removeVote(userID, optionID);
        }
        if (data.eventType === broadcastingEventTypes.USER_CONNECTED) {
          // Update the state to reflect the new user
          const { userID, username } = data.eventData;
          setUsers((prevUsers) => [...prevUsers, { userID, username }]);
        }
        setEventLog((list) => [...list, data]);
      } else {
        console.log('No data received but socket is connected');
      }
    };

    if (socket) {
      socket.on('receive_message', messageHandler);
    } else {
      console.error('SOCKET NOT FOUND in RoomPage');
    }

    // Cleanup function
    return () => {
      if (socket) socket.off('receive_message', messageHandler);
    };
  }, [socket]);

  const handleCancelSession = () => {
    console.log('Session cancelled!');
  };

  const sessionCancelled = false;

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

  // Function to calculate remaining time in seconds
  const calculateRemainingTimeInSeconds = (endTime) => {
    const now = dayjs();
    const end = dayjs(endTime);
    const differenceInSeconds = end.diff(now, 'second');
    return differenceInSeconds > 0 ? differenceInSeconds : 0;
  };

  // Convert seconds to minutes and seconds for display
  const minutes = Math.floor(remainingTimeInSeconds / 60);
  const seconds = remainingTimeInSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  // ===== END OF HANDLING THE REMAINING TIME ===== //

  return (
    <>
      {!sessionCancelled && (
        <CustomDrawer
          drawerWidth={drawerWidth}
          open={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          onCancelSession={handleCancelSession}
          profileName={username}
          users={users}
          adminID={roomDetails.ownerUserID}
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
                width: '100%',
                display: 'flex',
                margin: '0.5rem',
                gap: '0.5rem',
              }}
            >
              <Button
                variant={view === views.VOTING ? 'contained' : 'outlined'}
                size="small"
                color="success"
                fullWidth
                onClick={() => setView(views.VOTING)}
              >
                Voting
              </Button>
              <Button
                variant={view === views.EVENT ? 'contained' : 'outlined'}
                size="small"
                color="success"
                fullWidth
                onClick={() => setView(views.EVENT)}
              >
                Event Log
              </Button>
            </Box>
            <Box
              style={{
                flexGrow: 1,
                overflowY: 'scroll',
              }}
            >
              {
                // Show the voting options if the view is VOTING
                view === views.VOTING &&
                  votionOptions.map((option, index) => (
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
                  ))
              }
              {
                // Show the notifications if the view is EVENT
                view === views.EVENT && <EventLog logs={eventLog} />
              }
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
