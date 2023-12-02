import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PermanentDrawerLeft from './Drawer';
import VotingOptionCard from './VotingOptionCard';
import AddNewOptionModal from './NewOptionModal';
import './RoomPage.css';

const dummyVotingOptions = [
  {
    name: 'Tim Hortons',
    votesIn: 0,
    userVotesIn: 0,
    totalAvailableVotes: 0,
  },
  {
    name: 'McDonalds',
    votesIn: 0,
    userVotesIn: 0,
    totalAvailableVotes: 0,
  },
];

const drawerWidth = 240;
const Room = ({}) => {
  const [pending, setPending] = useState(false);
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState('');
  const { userDetails, updateUserDetails } = useContext(UserContext);

  const navigate = useNavigate();

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
        name: newOptionText,
        votesIn: 0,
        userVotesIn: 0,
        totalAvailableVotes: 0,
      },
      ...votionOptions,
    ]);
    setNewOptionText('');
    setOpenNewOption(false);
  };

  return (
    <>
      <PermanentDrawerLeft drawerWidth={drawerWidth} />
      <Grid
        className="container roomWrapper"
        sx={{
          marginLeft: '240px',
        }}
      >
        <Box className="widthConstraint contentBox">
          <Box className="headerBox">
            <IconButton className="menuIcon">
              <MenuIcon />
            </IconButton>
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
                name={option.name}
                votesIn={option.votesIn}
                totalAvailableVotes={option.totalAvailableVotes}
                userVotesIn={option.userVotesIn}
              />
            ))}
          </Box>
          <Box className="footerBox">
            <Typography variant="h6" fontStyle={'italic'}>
              You have X votes left to use.
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
