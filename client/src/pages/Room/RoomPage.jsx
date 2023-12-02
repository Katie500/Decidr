import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../../contexts/UserContext';
import PermanentDrawerLeft from './Drawer';
import VotingOptionCard from './VotingOptionCard';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';

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
const Room = ({}) => {
  const [pending, setPending] = useState(false);
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const [users, setUser] = useState(dummyUsers); // Username state
  const [userVoteCount, setUserVoteCount] = useState(0); // User vote count state
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const hideDesktopDrawer = useMediaQuery((theme) =>
    theme.breakpoints.down('md')
  );
  const [roomDetails, setRoomDetails] = useState({
    roomID: '',
    question: '',
    adminUserID: '',
    numberOfVotesPerUser: 5,
    endTime: '',
  });

  const userID = userDetails?.userID || '1';
  const username = userDetails?.nickname || 'User1';

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

  return (
    <>
      <PermanentDrawerLeft
        drawerWidth={drawerWidth}
        open={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
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
              <span style={{ textTransform: 'uppercase', fontStyle: 'italic' }}>
                {userDetails.roomID || 'XXXXXX'}
              </span>
            </Typography>
            <Typography className="timeText">
              Time Left:{' '}
              <span style={{ fontWeight: 'bold', color: 'red' }}>00:00</span>
            </Typography>
          </Box>
          <Typography
            variant="h5"
            fontStyle={'italic'}
            width={'100%'}
            textAlign={'center'}
          >
            Where do we wanna eat?
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
