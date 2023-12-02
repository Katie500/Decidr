const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
//====================== GET ENDPOINTS =================//

//1) GET Endpoint for room details
router.get('/room', (req, res) => {
  res.status(200).send({
    roomID: '',
    userIDs: '',
    endTime: '',
    ownerUserID: ''
  });
});

//2) GET Endpoint for creating room

//3) getting all the users of a particular room
//3) getting all the users of a particular room
router.get('/users', async (req, res) => {
  try {
    // Query the database to get all users
    const users = await User.find();

    // Send the users in the response
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

//4) add a new voting option
//5) removing a voting option
//6) voting for a given option (and it being broadcasted to everyone in the room)

//7) Getting all the users of a particular room

//====================== POST ENDPOINTS ==================//

//4) add a new user to the users endpoint
router.post('/users', async (req, res) => {
  const { roomID, isAdmin, username } = req.body;

  if (!roomID || !username) {
    res.status(400).send({ message: 'Incomplete user data. Please provide userID, roomID, and username.' });
    return;
  }

  try {
    // Create a new user object with the provided data
    const newUser = new User({
      roomID,
      isAdmin,
      username,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).send(savedUser);
  } catch (error) {
    console.error('Error saving user to the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});



//====================== DELETE ENDPOINTS ==================//
// DELETE Endpoint for deleting a room
router.delete('/room/:id', (req, res) => {
  const { id } = req.params;

  deleteRoomFromDatabase(id);

  res.status(204).send();
});

// DELETE Endpoint for deleting a user
router.delete('/users/:userID', (req, res) => {
  const { userID } = req.params;

  deleteUserFromDatabase(userID);

  res.status(204).send();
});


//==================== PUT ENDPOINTS =====================//
module.exports = router;
