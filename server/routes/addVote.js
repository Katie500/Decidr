const express = require('express');
const router = express.Router();

const Room = require('../models/roomSchema');

router.put('/', async (req, res) => {
  const { userId, voteOptionId } = req.query;

  if (!userId || !voteOptionId) {
    res.status(400).send({
      message: 'Incomplete data. Please provide userId and voteOptionId.',
    });
    return;
  }

  try {
    // Find the room with the given vote option
    const room = await Room.findOne({ 'voteOptions._id': voteOptionId });

    if (!room) {
      res.status(404).send({ message: 'Vote option not found' });
      return;
    }

    // Find the vote option and add the user ID to the userIDs array
    const voteOption = room.voteOptions.id(voteOptionId);
    voteOption.userIDs.push(userId);

    // Save the updated room
    await room.save();

    res.status(200).send({ message: 'Vote added successfully' });
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
