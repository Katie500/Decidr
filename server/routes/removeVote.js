const express = require('express');
const router = express.Router();

const Room = require('../models/roomSchema');

router.put('/', async (req, res) => {
  const { roomID, voteOptionID, userID } = req.query;

  if (!userID || !voteOptionID || !roomID) {
    return res.status(400).send({
      message:
        'Incomplete data. Please provide userID, voteOptionID, and roomID.',
    });
  }

  try {
    // Find the room and the specific vote option
    const room = await Room.findOne({
      _id: roomID,
      'voteOptions._id': voteOptionID,
    });
    if (!room) {
      return res.status(404).send({ message: 'Room or vote option not found' });
    }

    // Find the specific vote option and remove the first occurrence of userID
    const voteOption = room.voteOptions.id(voteOptionID);
    const indexToRemove = voteOption.votes.indexOf(userID);
    if (indexToRemove !== -1) {
      voteOption.votes.splice(indexToRemove, 1);
      await room.save();
      res.status(200).send({ message: 'Vote removed successfully' });
    } else {
      res.status(404).send({ message: 'User has not voted' });
    }
  } catch (error) {
    console.error('Error removing vote:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
