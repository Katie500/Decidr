import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../contexts/UserContext';

const Room = ({}) => {
  const [pending, setPending] = useState(false);

  const { userDetails, updateUserDetails } = useContext(UserContext);

  return (
    <>
      <Box className="topBarContainer">
        <Box container className="topBar widthConstraint">
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

      <LoadingBackdrop open={pending} />
    </>
  );
};

export default Room;
