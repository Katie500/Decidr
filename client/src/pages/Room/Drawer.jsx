import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, useMediaQuery } from '@mui/material';
import { useEffect, useContext, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserContext } from '../../contexts/UserContext';

export default function PermanentDrawerLeft({
  open,
  setDrawerOpen,
  drawerWidth,
  onCancelSession,
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const [users, setUsers] = useState([]); // Username state

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  useEffect(() => {
    // Update the drawer state based on screen size and passed `open` prop
    if (isMobile) {
      setDrawerOpen(open);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile, open]);

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
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
          <Typography noWrap component="div">
            {userDetails?.nickname}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {['User1', 'User2', 'User3', 'User4'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onCancelSession}>
              <ListItemIcon>
                <InboxIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary={'Cancel Session'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
