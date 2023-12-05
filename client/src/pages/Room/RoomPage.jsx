import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import { UserContext } from '../../contexts/UserContext';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';
import { getRoomDetails } from '../../api/getRoomDetails';
import { useNavigate } from 'react-router-dom';
import EventLog from './EventLog';
import { addNewOptionToDB } from '../../api/addNewOptionToDB';
import VotingOptionsList from './VotingOptionsList';
import RoomHeader from './RoomHeader';
import useVoteManagement from '../../hooks/useVoteManagement';
import useBroadcast, { broadcastingEventTypes } from '../../hooks/useBroadcast';

const views = {
  VOTING: 'VOTING',
  EVENT: 'EVENT',
};

const Room = () => {
  const [pending, setPending] = useState(true);
  // const [votionOptions, setVotingOptions] = useState([]);
  const [users, setUsers] = useState([]); // users state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const [eventLog, setEventLog] = useState([]);
  const { userDetails, updateUserDetails } = useContext(UserContext);

  const [view, setView] = useState(views.VOTING); // View state
  const userID = userDetails.userID;
  const username = userDetails.nickname;
  const avatar = userDetails.profilePicture;
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

  const voteManagement = useVoteManagement(roomDetails, setPending);
  // addNewOption needs to be declared here because it needs to be passed to useBroadcast
  const addNewOption = (optionText, newOptionID) => {
    voteManagement.setVotingOptions((prevOptions) => [
      { _id: newOptionID, optionText: optionText, votes: [] },
      ...prevOptions,
    ]);
  };
  const { sendBroadcast } = useBroadcast(
    voteManagement.processIncomingVote,
    voteManagement.processIncomingVoteRemoval,
    setUsers,
    addNewOption,
    setEventLog
  );

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
      voteManagement.setVotingOptions(roomDetails.voteOptions || []);
      setUsers(users);
      setPending(false);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
    }
  };

  const closeNewOptionModal = () => {
    setOpenNewOption(false);
  };

  const handleAddVote = async (optionID) => {
    try {
      await voteManagement.submitUserVote(optionID);

      // BROADCAST THE VOTE:
      const optionText = voteManagement.votingOptions.find(
        (opt) => opt._id === optionID
      )?.optionText;
      sendBroadcast(
        broadcastingEventTypes.ADD_VOTE,
        { userID, optionID },
        `${username} voted for ${optionText}`
      );
    } catch (error) {
      console.error('Error in voting:', error);
    }
  };

  const handleRemoveVote = async (optionID) => {
    try {
      await voteManagement.removeUserVote(optionID);

      // BROADCAST vote removal
      const optionText = voteManagement.votingOptions.find(
        (opt) => opt._id === optionID
      )?.optionText;
      sendBroadcast(
        broadcastingEventTypes.REMOVE_VOTE,
        { userID, optionID },
        `${username} unvoted for ${optionText}`
      );
    } catch (error) {
      console.error('Error in removing vote:', error);
    }
  };

  // ====== ADDING NEW OPTION ====== //
  const handleAddNewOption = async () => {
    if (!newOptionText) {
      setOpenNewOption(false);
      return;
    }

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
  // ====== END OF ADDING NEW OPTION ====== //

  return (
    <>
      {!sessionCancelled && (
        <CustomDrawer
          drawerWidth={drawerWidth}
          open={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          onCancelSession={handleCancelSession}
          profileName={username}
          profileAvatar={avatar}
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