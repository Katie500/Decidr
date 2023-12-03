import { Box, Button, Card, Modal, TextField, Typography } from '@mui/material';
import React from 'react';

const AddNewOptionModal = ({
  open,
  handleClose,
  handleAdd,
  newOptionText,
  setNewOptionText,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card className="widthConstraint" style={{ padding: '2rem' }}>
        <Typography variant="h6" textAlign={'center'}>
          Add a new voting option
        </Typography>

        <Box className="inputBox">
          <TextField
            fullWidth
            label="New Voting Option"
            variant="outlined"
            size="small"
            value={newOptionText}
            onChange={(e) => {
              setNewOptionText(e.target.value);
            }}
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

export default AddNewOptionModal;
