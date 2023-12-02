import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Icon,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const dummyVotingOptions = [
  {
    name: 'Time Hortons',
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

const Room = ({}) => {
  const [pending, setPending] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState('');
  const [votionOptions, setVotingOptions] = useState(dummyVotingOptions);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const navigate = useNavigate();

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

  const VotingOptionCard = ({
    name,
    votesIn,
    userVotesIn,
    totalAvailableVotes,
  }) => {
    return (
      <Card
        style={{
          padding: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          margin: '1rem',
        }}
      >
        <Typography
          textAlign={'left'}
          width={'45%'}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
        >
          {name}
        </Typography>
        <Chip label={`${votesIn} / ${totalAvailableVotes}`} />
        <Chip
          label={`${userVotesIn}`}
          sx={{ background: '#B7CFEE', color: '#2E419D' }}
        />
        <IconButton>
          <AddIcon sx={{ color: 'green' }} />
        </IconButton>
        <IconButton>
          <RemoveIcon sx={{ color: 'red' }} />
        </IconButton>
      </Card>
    );
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box className="topBar widthConstraint">
          <IconButton className="topBarIcon">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            In room{' '}
            <span style={{ textTransform: 'uppercase' }}>
              {userDetails.roomID}
            </span>
          </Typography>
        </Box>
      </Box>
      <Grid
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'initial',
        }}
      >
        <Box
          className="widthConstraint"
          style={{
            marginTop: '80px',
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
            <Button variant="contained" color="success">
              Add a new option
            </Button>
          </Box>
        </Box>
      </Grid>

      <LoadingBackdrop open={pending} />
    </>
  );
};

export default Room;
