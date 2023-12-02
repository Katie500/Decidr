import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Icon,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PermanentDrawerLeft from './Drawer';
import VotingOptionCard from './VotingOptionCard';

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
  const [newOption, setNewOption] = useState('');
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

  const closeNewOptionModal = () => {
    setOpenNewOption(false);
  };

  const handleAddNewOption = () => {
    if (!newOption) {
      return;
    }
    setVotingOptions([
      {
        name: newOption,
        votesIn: 0,
        userVotesIn: 0,
        totalAvailableVotes: 0,
      },
      ...votionOptions,
    ]);
    setNewOption('');
    setOpenNewOption(false);
  };

  // const handleVote = (choiceId) => {
  //   setChoices((prevChoices) =>
  //     prevChoices.map((choice) =>
  //       choice.id === choiceId ? { ...choice, votes: choice.votes + 1 } : choice
  //     )
  //   );
  // };

  // const handleAddChoice = () => {
  //   const newChoiceId = choices.length + 1;
  //   const newChoice = { id: newChoiceId, text: newChoiceText, votes: 0 };
  //   setChoices([...choices, newChoice]);
  //   setNewChoiceText(''); // Clear the input field after adding a choice
  // };

  //Navigates back to the login page.
  const navigateBack = () => {
    navigate('/');
  };

  return (
    <>
      <PermanentDrawerLeft drawerWidth={drawerWidth} />
      <Grid
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'initial',
          paddingLeft: '240px',
        }}
      >
        <Box
          className="widthConstraint"
          style={{
            margin: '1rem',
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem 1 rem 0',
              margin: '1rem',
            }}
          >
            <IconButton style={{ position: 'absolute', left: '0' }}>
              <MenuIcon />
            </IconButton>
            <Typography>
              Room:
              <span style={{ textTransform: 'uppercase', fontStyle: 'italic' }}>
                {userDetails.roomID || 'XXXXXX'}
              </span>
            </Typography>
            <Typography style={{ position: 'absolute', right: '1rem' }}>
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
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem',
              alignItems: 'center',
            }}
          >
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

      <Modal
        open={openNewOption}
        onClose={closeNewOptionModal}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card className="widthConstraint" style={{ padding: '2rem' }}>
          <Typography variant="h6" textAlign={'center'}>
            Add a new voting option
          </Typography>

          <Box className="inputBox">
            <TextField
              fullWidth
              label="New Voting Option"
              variant="outlined"
              size="small"
              value={newOption}
              onChange={(e) => {
                setNewOption(e.target.value);
              }}
            />
            <Button variant="contained" onClick={handleAddNewOption}>
              Add
            </Button>
          </Box>
        </Card>
      </Modal>

      <LoadingBackdrop open={pending} />
    </>
  );
};

export default Room;
