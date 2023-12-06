import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';


export const broadcastingEventTypes = {
  ADD_VOTE: 'ADD_VOTE',
  REMOVE_VOTE: 'REMOVE_VOTE',
  ADD_OPTION: 'ADD_OPTION',
  USER_CONNECTED: 'USER_CONNECTED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  ADMIN_CANCELLED_SESSION: 'ADMIN_CANCELLED_SESSION'
};

const useBroadcast = (
  processIncomingVote,
  processIncomingVoteRemoval,
  setUsers,
  addNewOption,
  setEventLog
) => {
  const socket = useContext(SocketContext);
  const { userDetails } = useContext(UserContext);
  const userID = userDetails.userID;

  const [avatarStates, setAvatarStates] = useState({}); // State to store avatar for each user

  const navigate = useNavigate();

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

  const cancelSession = () => {
    setShowWarningPopup(true);
  }
  const [showWarningPopup, setShowWarningPopup] = useState(false);


  // LISTEN FOR BROADCASTS
  useEffect(() => {
    const messageHandler = (data) => {
      if (data) {
        const { eventType, eventData } = data;
        if (eventType === broadcastingEventTypes.ADD_VOTE) {
          const { userID, optionID } = eventData;
          processIncomingVote(userID, optionID);
        }
        if (eventType === broadcastingEventTypes.REMOVE_VOTE) {
          const { userID, optionID } = eventData;
          processIncomingVoteRemoval(userID, optionID);
        }
        if (eventType === broadcastingEventTypes.USER_CONNECTED) {
          
          const { userID, username, profilePicture } = eventData;
          setUsers((prevUsers) => [...prevUsers, { userID, username, profilePicture }]);
          setAvatarStates((prevStates) => ({
            ...prevStates,
          }));
        }
        if (eventType === broadcastingEventTypes.ADD_OPTION) {
          const { optionText, optionID } = eventData;
          addNewOption(optionText, optionID);
          setAvatarStates((prevStates) => ({
            ...prevStates,
            
          }));
        }
        if (eventType === broadcastingEventTypes.ADMIN_CANCELLED_SESSION) {
          setShowWarningPopup(true);
          <div className="popup-container">
          <div className="popup-content">
            <Typography variant="h4" align="center">
              Session has been ended by the admin.
            </Typography>
            <Button variant="contained" color="primary" onClick={cancelSession}>
              OK
            </Button>
          </div>
        </div>
          navigate("/");
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
  return {
    sendBroadcast,
  };
};

export default useBroadcast;
