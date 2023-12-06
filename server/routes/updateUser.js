const express = require('express');
const router = express.Router();

const User = require('../models/userSchema');

router.put('/updateProfile', async (req, res) => {
  const { userID, username, profilePicture } = req.body;

  if (!userID) {
    res.status(400).send({
      message: 'Incomplete data. Please provide a user ID.',
    });
    return;
  }

  try {
    // Find the user by ID and update the profile information
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { username, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
