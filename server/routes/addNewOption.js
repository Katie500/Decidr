const express = require('express');
const router = express.Router();

const Room = require('../models/roomSchema');

router.post('/', async (req, res) => {
  const { newOptionText, roomID } = req.body;

  if (!newOptionText || !roomID) {
    res.status(400).send({
      message: 'Incomplete data. Please provide newOptionText and roomID.',
    });
    return;
  }

  try {
    // Find the room by ID and add the new option to the voteOptions array
    const room = await Room.findByIdAndUpdate(
      roomID,
      { $push: { voteOptions: { option: newOptionText, userIDs: [] } } },
      { new: true }
    );

    if (!room) {
      res.status(404).send({ message: 'Room not found' });
      return;
    }

    res.status(201).send({ message: 'New option added successfully' });
  } catch (error) {
    console.error('Error adding new option:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
