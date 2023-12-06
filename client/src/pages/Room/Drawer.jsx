import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { IconButton, useMediaQuery } from '@mui/material';
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
  const [avatar, setAvatar] = useState('');
  const [svgContent, setSvgContent] = useState(null);

  const { userDetails, updateUserDetails } = useContext(UserContext);
  const [avatarStates, setAvatarStates] = useState({}); // State to store avatar for each user

  useEffect(() => {
    if (userDetails?.profilePicture) {
      setAvatar(userDetails.profilePicture);
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        if (avatar) {
          const response = await fetch(avatar);
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
  }, [avatar]);

  const changeProfilePicture = () => {
    console.log('avatar is:' + avatar);
    updateUserDetails({
      profilePicture: avatar,
    });

    setWindowOpen(!isWindowOpen);
  };

  const handleCancelSession = () => {
    // Trigger the pop-up window in RoomPage.jsx
    sendBroadcast(
      broadcastingEventTypes.ADMIN_CANCELLED_SESSION,
      { userID: userDetails.userID, username: userDetails.nickname },
      `${userDetails.nickname} cancelled the session`
    );
    handleAdminCancelledSession();
  };

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
            {/*console.log('Profile Avatar URL:', svgContent)*/}
            <IconButton onClick={changeProfilePicture}>
              {avatar !== '' ? (
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
            {isWindowOpen && (
              <SelectAvatarMenu
                onSelectAvatar={(selectedAvatar) => {
                  setAvatar(selectedAvatar);
                  console.log('Avatar set in Drawer Page:', selectedAvatar);
                }}
              />
            )}
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
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                      }}
                      onError={(e) => console.error('Error loading image:', e)}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </ListItemIcon>

                {/* avatarStates[user._id] ? (<img
                      src={`data:image/svg+xml;base64,${avatarStates[user._id]}`}
                      alt="Profile Picture"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      onError={(e) => console.error('Error loading image:', e)}
                    />): <> </> 
                )  */}
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
        </List>
        <Divider />
        <List>
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
