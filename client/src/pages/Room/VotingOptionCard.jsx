import { Box, Card, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
      <Box>
        <IconButton>
          <AddIcon sx={{ color: 'green' }} />
        </IconButton>
        <IconButton>
          <RemoveIcon sx={{ color: 'red' }} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default VotingOptionCard;
