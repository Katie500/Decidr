import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingBackdrop({ open }) {
  return (
    <Backdrop sx={{ zIndex: 99 }} open={open}>
      <CircularProgress size={60} thickness={3} sx={{ color: 'white' }} />
    </Backdrop>
  );
}

export default LoadingBackdrop;
