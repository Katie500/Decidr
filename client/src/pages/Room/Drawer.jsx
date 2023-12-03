import * as React from 'react';
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
import { useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function CustomDrawer({
  open,
  setDrawerOpen,
  drawerWidth,
  onCancelSession,
  users,
  profileName,
  adminID,
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
                  <AccountCircleIcon />
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
