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
import VotingOptionCard from './VotingOptionsList';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';
import { getRoomDetails } from '../../api/getRoomDetails';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import EventLog from './EventLog';
import { addNewOptionToDB } from '../../api/addNewOptionToDB';
import { addVoteToDb } from '../../api/addVoteToDB';
import { removeVoteFromDb } from '../../api/removeVoteFromDB';
import VotingOptionsList from './VotingOptionsList';
import RoomHeader from './RoomHeader';

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

const Room = () => {
  const [pending, setPending] = useState(true);
  const [votionOptions, setVotingOptions] = useState([]);
  const [users, setUsers] = useState([]); // users state
  const [userVoteCount, setUserVoteCount] = useState(0); // User vote count state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const [eventLog, setEventLog] = useState([]);
  const { userDetails, updateUserDetails } = useContext(UserContext);

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

  return (
    <>
      {sessionCancelled && (
        // We can fix closing a room(session) later
        <Typography variant="h4" align="center">
          Session has been cancelled.
        </Typography>
      )}
      {!sessionCancelled && (
        <>
          <Grid
            className="container roomWrapper"
            sx={{
              marginLeft: hideDesktopDrawer ? '0px' : '240px',
            }}
          >
            <Box className="widthConstraint contentBox">
              <RoomHeader
                sessionCancelled={sessionCancelled}
                roomDetails={roomDetails}
                users={users}
                view={view}
                setView={setView}
                userDetails={userDetails}
                handleCancelSession={() => console.log('Session cancelled!')}
                hideDesktopDrawer={hideDesktopDrawer}
              />
              <Box
                style={{
                  flexGrow: 1,
                  overflowY: 'scroll',
                }}
              >
                {view === views.VOTING && (
                  <VotingOptionsList
                    votionOptions={votionOptions}
                    totalAvailableVotes={
                      users.length * roomDetails.numberOfVotesPerUser
                    }
                    handleAddVote={handleAddVote}
                    handleRemoveVote={handleRemoveVote}
                    handleAddOption={() => setOpenNewOption(true)}
                  />
                )}
                {view === views.EVENT && (
                  <EventLog logs={eventLog} userID={userID} />
                )}
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
        </>
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
