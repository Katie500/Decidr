const express = require('express');
const router = express.Router();

const User = require('../models/userSchema');

router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID and remove it from the database
    const removedUser = await User.findByIdAndRemove(userId);

    if (removedUser) {
      res.status(200).send({ message: 'User removed successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing user from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
