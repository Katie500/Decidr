const express = require('express');
const router = express.Router();

const User = require('../models/userSchema');
const Room = require('../models/roomSchema');

router.post('/', async (req, res) => {
  const { roomID, socketID, username, question, endTime } = req.body;

  console.log('In /createUserAndRoom req.body', req.body);
  if (!socketID || !username || !roomID) {
    res.status(400).send({
      message:
        'Incomplete user data. Please provide socketID, roomID, and username.',
    });
    return;
  }

  try {
    // Create a new user object with the provided data
    const newUser = new User({
      socketID,
      username,
      roomID,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Create a new room object with the provided data
    const newRoom = new Room({
      roomID,
      question,
      endTime,
      ownerUserID: savedUser._id,
    });
    await newRoom.save();

    // Update the user with the roomID
    // await User.findByIdAndUpdate(savedUser._id, { roomID });

    // Send the roomID back to the client
    res.status(201).send({ roomId: newRoom.roomID, userID: savedUser._id });
  } catch (error) {
    console.error('Error in createUserAndRoom.js to the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
module.exports = router;
