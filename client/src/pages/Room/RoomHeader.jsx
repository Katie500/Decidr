import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from './Drawer';
import dayjs from 'dayjs';
import './RoomPage.css';

const views = {
  VOTING: 'VOTING',
  EVENT: 'EVENT',
};

const drawerWidth = 240;
const RoomHeader = ({
  handleCancelSession,
  users,
  roomDetails,
  userDetails,
  view,
  setView,
  hideDesktopDrawer,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0);

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

  return (
    <>
      <CustomDrawer
        drawerWidth={drawerWidth}
        open={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        onCancelSession={handleCancelSession}
        profileName={userDetails.nickname || 'ERROR IN ROOM HEADER'}
        users={users}
        adminID={roomDetails.ownerUserID}
      />
      <Box className="headerBox">
        {/* ONLY SHOW HAMBURGER ON MOBILE*/}
        {hideDesktopDrawer && (
          <IconButton className="menuIcon" onClick={() => setDrawerOpen(true)}>
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
    </>
  );
};

export default RoomHeader;
