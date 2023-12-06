import React, { useContext, useEffect, useState } from 'react';
import {Button, Box} from '@mui/material';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { IconButton, useMediaQuery, Modal } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SelectAvatarMenu from './SelectAvatarMenu';
import { UserContext } from '../../contexts/UserContext';

import useBroadcast, { broadcastingEventTypes } from '../../hooks/useBroadcast';

import { useNavigate } from 'react-router-dom';

export default function CustomDrawer({
  open,
  setDrawerOpen,
  drawerWidth,
  onCancelSession,
  handleAdminCancelledSession,
  users,
  profileName,
  profileAvatar,
  sendBroadcast,
  adminID,
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    // Update the drawer state based on screen size and passed `open` prop
    if (isMobile) {
      setDrawerOpen(open);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile, open]);



  const toResultspage = () => {
    navigate('/resultpage');
  };
  //==================== profile picture algorithm ================//
  //open picture window
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [svgContent, setSvgContent] = useState(null);
  const [svgContent2, setSvgContent2] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const [avatarStates, setAvatarStates] = useState({}); // State to store avatar for each user

  useEffect(() => {
    if (userDetails?.profilePicture) {
      setProfilePicture(userDetails.profilePicture);
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        if (profilePicture) {
          const response = await fetch(profilePicture);
          if (response.ok) {
            const svgText = await response.text();
            const base64 = btoa(svgText);
            setSvgContent(base64);
          } else {
            console.error('Failed to fetch SVG:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [profilePicture]);

  useEffect(() => {
    const fetchSvgForUsers = async () => {
      try {
        const promises = users?.map(async (user, index) => {
          if (user.profilePicture) {
            console.log("IDs are" + user.profilePicture)
            const response = await fetch(user.profilePicture);
            if (response.ok) {
              const svgText = await response.text();
              const base64 = btoa(svgText);
              return base64;
            } else {
              console.error('Failed to fetch SVG:', response.status);
              return null;
            }
          } else {
            return null;
          }
        });
  
        const svgContents = await Promise.all(promises);
        setSvgContent2(svgContents);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
  
    fetchSvgForUsers();
  }, [users]);


const changeProfilePicture = async () => {
  try {
    // Make a request to your backend API to update the user's profile picture
    const response = await fetch(`http://localhost:3001/users/${userDetails.userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profilePicture: profilePicture,
      }),
    });

      // Close the modal when the Apply button is clicked
      setModalOpen(false);
    if (response.ok) {
      // Update the user details in the context or state on success
      updateUserDetails({
        profilePicture: profilePicture,
      });

    } else {
      console.error('Failed to update profile picture:', response.status);
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
};

  

  // Default to an empty array if svgContent2 is null
  const svgContent2Array = svgContent2 || [];

  const handleCancelSession = () => {
    // Trigger the pop-up window in RoomPage.jsx
    sendBroadcast(
      broadcastingEventTypes.ADMIN_CANCELLED_SESSION,
      { userID: userDetails.userID, username: userDetails.nickname },
      `${userDetails.nickname} cancelled the session`
    );
    handleAdminCancelledSession();
  };

  const handleAddTime = () => {

  }

  const leaveRoom = () => {
    onCancelSession();

    // Broadcast that the user left the room
    sendBroadcast(
      broadcastingEventTypes.USER_DISCONNECTED,
      { userID: userDetails.userID, username: userDetails.nickname },
      `${userDetails.nickname} left the room`
    );

    // Optionally, close the drawer after leaving the room
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setDrawerOpen(false)}
        anchor="left"
      >
        <Toolbar>
          <div>
            <IconButton onClick={() => setModalOpen(true)}>
              {profilePicture !== '' ? (
                <img
                  src={`data:image/svg+xml;base64,${svgContent}`}
                  alt="Profile Picture"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  onError={(e) => console.error('Error loading image:', e)}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
              <Box>
                <SelectAvatarMenu
                  onSelectAvatar={(selectedAvatar) => {
                    setProfilePicture(selectedAvatar);
                    console.log('Avatar set in Drawer Page:', selectedAvatar);
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => changeProfilePicture()}
                >
                  Apply
                </Button>
              </Box>
            </Modal>
          </div>
          <Typography noWrap component="div">
            {profileName}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem key={-1} disablePadding>
            <ListItemButton>
              <ListItemText primary={'User List:'} />
            </ListItemButton>
          </ListItem>
          {users?.map((user, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {user._id === userDetails.userID && svgContent ? (
                    <img
                      src={`data:image/svg+xml;base64,${svgContent}`}
                      alt="Profile Picture"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      onError={(e) => console.error('Error loading image:', e)}
                    />
                  ) : (
                    svgContent2Array[index] ? (
                      <img
                        src={`data:image/svg+xml;base64,${svgContent2Array[index]}`}
                        alt="Profile Picture"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        onError={(e) => console.error('Error loading image:', e)}
                      />
                    ) : (
                      <AccountCircleIcon />
                    )
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${user.username} ${
                    user._id === adminID ? '(admin)' : ''
                  }`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>

          {adminID !== userDetails.userID && (
          <ListItemButton onClick={leaveRoom} component={Link} to="/">
              <ListItemIcon>
                <InboxIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary={'Leave the room'} />
            </ListItemButton>
          )}
          </ListItem>
          <List>
            <ListItem disablePadding>

              {adminID === userDetails.userID && (
              <ListItemButton onClick={handleAddTime}>

                <ListItemIcon>
                <AddAlarmIcon sx={{ color: 'blue' }} />
              </ListItemIcon>
                <ListItemText primary={'Add Time'} />
              </ListItemButton>
            )}
            </ListItem>
          </List>
          <Divider />
          <ListItem disablePadding>
            {adminID === userDetails.userID && (

            <ListItemButton onClick={toResultspage}>
              <ListItemIcon>
                <InboxIcon sx={{ color: 'orange' }} />
              </ListItemIcon>
              <ListItemText primary={'Finish Session'} />
            </ListItemButton>

           )}

          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>

            {adminID === userDetails.userID && (
            <ListItemButton onClick={handleCancelSession}>

              <ListItemIcon>
                <InboxIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary={'Cancel Session'} />
            </ListItemButton>
           )}
          </ListItem>
        </List>
        
      </Drawer>
    </Box>
  );
}
