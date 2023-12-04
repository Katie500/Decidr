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
import { addNewOptionToDB } from '../../api/addNewOptionToDB';
import { addVoteToDb } from '../../api/addVoteToDB';
import { removeVoteFromDb } from '../../api/removeVoteFromDB';

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
  const [votionOptions, setVotingOptions] = useState([]);
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
  const sessionCancelled = false;

  useEffect(() => {
    if (userDetails.roomID !== localRoomID) {
      fetchRoomDetails();
      setLocalRoomID(userDetails.roomID);
      sendBroadcast(
        broadcastingEventTypes.USER_CONNECTED,
        { userID, username },
        `${username} has ${userDetails.isAdmin ? 'created' : 'joined'} the room`
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
      setVotingOptions(roomDetails.voteOptions || []);
      setUsers(users);
      setPending(false);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
    }
  };

  const closeNewOptionModal = () => {
    setOpenNewOption(false);
  };

  // ====== ADDING NEW OPTION ====== //
  const handleAddNewOption = async () => {
    if (!newOptionText) {
      setOpenNewOption(false);
      return;
    }

    // TODO: Call API to update the vote in the database
    // votingOptionID SHOULD COME FROM THE DATABASE
    setPending(true);
    const newOptionID = await addNewOptionToDB(newOptionText, roomDetails._id);

    setPending(false);
    addNewOption(newOptionText, newOptionID);
    setNewOptionText('');
    setOpenNewOption(false);

    // BROADCAST THE NEW OPTION:
    const eventMessage = `${username} added a new option: ${newOptionText}`;
    sendBroadcast(
      broadcastingEventTypes.ADD_OPTION,
      { optionText: newOptionText, optionID: newOptionID },
      eventMessage
    );
  };

  const addNewOption = (optionText, newOptionID) => {
    setVotingOptions((prevOptions) => [
      { _id: newOptionID, optionText: optionText, votes: [] },
      ...prevOptions,
    ]);
  };
  // ====== END OF ADDING NEW OPTION ====== //

  // ====== ADDING VOTES ====== //
  const handleAddVote = (optionID) => {
    // Check if the user has any votes left
    if (userVoteCount >= roomDetails.numberOfVotesPerUser) {
      return;
    }

    setPending(true);
    addVoteToDb(roomDetails._id, optionID, userID)
      .then(() => {
        addVote(userID, optionID);
        setUserVoteCount((prevCount) => prevCount + 1);
        setPending(false);

        const votedOption = votionOptions.find(
          (option) => option._id === optionID
        );
        const eventMessage = `${username} voted for ${votedOption.optionText}`;
        sendBroadcast(
          broadcastingEventTypes.ADD_VOTE,
          { userID, optionID },
          eventMessage
        );
      })
      .catch((error) => {
        // Handle any errors here
      });
  };
  const addVote = (userID, optionID) => {
    setVotingOptions((prevOptions) =>
      prevOptions.map((option) =>
        option._id === optionID
          ? { ...option, votes: [...option.votes, userID] }
          : option
      )
    );
  };
  // ====== END OF ADDING VOTES ====== //

  // ====== REMOVING VOTES ====== //
  const handleRemoveVote = (optionID) => {
    if (removeVote(userID, optionID)) {
      setPending(true);
      removeVoteFromDb(roomDetails._id, optionID, userID)
        .then(() => {
          setUserVoteCount((prevCount) => prevCount - 1); // Decrement the user's vote count

          setPending(false);

          // Add a notification for the unvote
          const optionText = votionOptions.find(
            (option) => option._id === optionID
          ).optionText;
          const eventMessage = `${username} unvoted for ${optionText}`;
          sendBroadcast(
            broadcastingEventTypes.REMOVE_VOTE,
            { userID, optionID },
            eventMessage
          );
          setPending(false);
        })
        .catch((error) => {
          console.error('Failed to add vote:', error);
        });
    } else {
      console.log('Failed to remove vote');
    }
  };

  const removeVote = (userID, optionID) => {
    // Find the option with the given optionID
    const option = votionOptions.find((option) => option._id === optionID);

    // Check if userID exists in the votes array of the found option
    if (option && option.votes.includes(userID)) {
      setVotingOptions((prevOptions) =>
        prevOptions.map((option) => {
          if (option._id === optionID) {
            // Find the index of the first occurrence of the user's vote
            const indexToRemove = option.votes.indexOf(userID);
            if (indexToRemove !== -1) {
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
      return true; // Vote found and attempt to remove is made
    } else {
      return false; // Vote not found, no state update
    }
  };

  // ====== END OF REMOVING VOTES ====== //

  // ====== BROADCASTING EVENTS ====== //
  const sendBroadcast = async (eventType, eventData, eventMessage) => {
    const broadcastData = {
      room: userDetails.roomID,
      author: userID,
      eventType: eventType,
      eventData: eventData,
      eventMessage: eventMessage,
      timeStamp: dayjs().format('HH:mm:ss'),
    };
    if (socket) {
      await socket.emit('send_message', broadcastData);
    } else {
      console.error('SOCKET NOT FOUND in RoomPage');
    }

    // Update the event log with the new event
    setEventLog((prevLogs) => [...prevLogs, broadcastData]);
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
        if (data.eventType === broadcastingEventTypes.ADD_OPTION) {
          // Update the state to reflect the new option
          const { optionText, optionID } = data.eventData;
          addNewOption(optionText, optionID);
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
  // ====== END OF BROADCASTING EVENTS ====== //

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

  const handleCancelSession = () => {
    console.log('Session cancelled!');
  };
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
                view === views.VOTING && votionOptions.length === 0 && (
                  <Typography
                    variant="h6"
                    textAlign={'center'}
                    marginTop={'1rem'}
                  >
                    No voting options added yet. <br />
                    Click{' '}
                    <span
                      style={{
                        cursor: 'pointer',
                        color: '#007bff',
                        textDecoration: 'underline',
                        textStyle: 'italic',
                      }}
                      onClick={() => setOpenNewOption(true)}
                    >
                      here
                    </span>{' '}
                    to add one.
                  </Typography>
                )
              }
              {view === views.VOTING &&
                votionOptions.length > 0 &&
                votionOptions.map((option, index) => (
                  <VotingOptionCard
                    key={index}
                    name={option.optionText}
                    votes={option.votes || []}
                    totalAvailableVotes={
                      users.length * roomDetails.numberOfVotesPerUser
                    }
                    numberOfUserVotes={
                      option.votes?.filter((_userID) => _userID === userID)
                        .length || 0
                    }
                    handleAddVote={() => handleAddVote(option._id)}
                    handleRemoveVote={() => handleRemoveVote(option._id)}
                  />
                ))}
              {
                // Show the notifications if the view is EVENT
                view === views.EVENT && (
                  <EventLog logs={eventLog} userID={userID} />
                )
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
