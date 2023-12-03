const express = require('express');
const router = express.Router();
const Room = require('../models/roomSchema');
const User = require('../models/userSchema'); // Import the User model

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

    // Fetch users in the room
    const usersInRoom = await User.find({ roomID });

    // Send room details along with the users
    res.status(200).send({
      roomDetails: room,
      users: usersInRoom,
    });
  } catch (error) {
    console.error('Error fetching room from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
