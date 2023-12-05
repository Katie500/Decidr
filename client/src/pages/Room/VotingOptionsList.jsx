import { Box, Card, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const VotingOptionCard = ({
  name,
  votes,
  numberOfUserVotes,
  totalAvailableVotes,
  handleAddVote,
  handleRemoveVote,
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
      <Chip label={`${votes.length} / ${totalAvailableVotes}`} />
      <Chip
        label={`${numberOfUserVotes}`}
        sx={{ background: '#B7CFEE', color: '#2E419D' }}
      />
      <Box style={{ display: 'flex' }}>
        <IconButton onClick={handleAddVote}>
          <AddIcon sx={{ color: 'green' }} />
        </IconButton>
        <IconButton onClick={handleRemoveVote}>
          <RemoveIcon sx={{ color: 'red' }} />
        </IconButton>
      </Box>
    </Card>
  );
};

const VotingOptionsList = ({
  votionOptions,
  handleAddVote,
  handleRemoveVote,
  handleAddOption,
  userID,
  totalAvailableVotes,
}) => {
  if (votionOptions.length === 0) {
    return (
      <Typography variant="h6" textAlign={'center'} marginTop={'1rem'}>
        No voting options added yet. <br />
        Click{' '}
        <span
          style={{
            cursor: 'pointer',
            color: '#007bff',
            textDecoration: 'underline',
            textStyle: 'italic',
          }}
          onClick={handleAddOption}
        >
          here
        </span>{' '}
        to add one.
      </Typography>
    );
  }

  return votionOptions.map((option, index) => (
    <VotingOptionCard
      key={index}
      name={option.optionText}
      votes={option.votes || []}
      totalAvailableVotes={totalAvailableVotes}
      numberOfUserVotes={
        option.votes?.filter((_userID) => _userID === userID).length || 0
      }
      handleAddVote={() => handleAddVote(option._id)}
      handleRemoveVote={() => handleRemoveVote(option._id)}
    />
  ));
};

export default VotingOptionsList;
