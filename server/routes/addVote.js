const express = require('express');
const router = express.Router();

const Room = require('../models/roomSchema');

router.put('/', async (req, res) => {
  const { roomID, voteOptionID, userID } = req.query;

  if (!userID || !voteOptionID || !roomID) {
    res.status(400).send({
      message:
        'Incomplete data. Please provide userID, voteOptionID and roomID.',
    });
    return;
  }

  try {
    // Update the room to add the userID to the specific vote option
    const updateResult = await Room.updateOne(
      { _id: roomID, 'voteOptions._id': voteOptionID },
      { $push: { 'voteOptions.$.votes': userID } }
    );

    if (updateResult.nModified === 0) {
      res.status(404).send({ message: 'Room or vote option not found' });
      return;
    }

    res.status(200).send({ message: 'Vote added successfully' });
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
