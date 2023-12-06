import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const WarningPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <Typography variant="h4" align="center">
          Session has been ended by the admin.
        </Typography>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default WarningPopup;
