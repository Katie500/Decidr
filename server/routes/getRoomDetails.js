const express = require('express');
const router = express.Router();
const Room = require('../models/roomSchema');

router.get('/', async (req, res) => {
  const { roomID } = req.query;

  if (!roomID) {
    return res.status(400).send({ message: 'Room ID is required' });
  }

  try {
    const room = await Room.findOne({ roomID });

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    res.status(200).send(room);
  } catch (error) {
    console.error('Error fetching room from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
