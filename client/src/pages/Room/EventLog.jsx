import { Box, Typography } from '@mui/material';
import React from 'react';

const EventLog = ({ logs, userID }) => {
  return (
    <>
      <Typography variant="h6" textAlign={'center'}>
        Event Log
      </Typography>
      {logs.map((log, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <Typography variant="body1">
            {log?.author === userID ? '(You) ' : ''}
            {log?.eventMessage} at {log?.timeStamp}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default EventLog;
