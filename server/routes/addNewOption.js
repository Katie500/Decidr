const express = require('express');
const router = express.Router();

const Room = require('../models/roomSchema');

const { default: mongoose } = require('mongoose');

router.post('/', async (req, res) => {
  const { newOptionText, roomObjectID } = req.body;

  if (!newOptionText || !roomObjectID) {
    res.status(400).send({
      message:
        'Incomplete data. Please provide newOptionText and roomObjectID.',

    });
    return;
  }

  try {

    const newOptionID = new mongoose.Types.ObjectId(); // Generate a new ObjectId
    const newOption = {
      _id: newOptionID,
      optionText: newOptionText,
      votes: [],
    };

    // Update the document with the new option
    await Room.findByIdAndUpdate(
      roomObjectID,
      { $push: { voteOptions: newOption } },
      { new: true }
    );

    // No need for another query; use the generated newOptionID
    res.status(201).send({
      message: 'New option added successfully',
      optionID: newOptionID,
    });

  } catch (error) {
    console.error('Error adding new option:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
