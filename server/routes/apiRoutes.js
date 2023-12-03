const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const Room = require("../models/roomSchema");

//====================================================== GET ENDPOINTS ==============================//


//--------------------------------------- GET Room Details ----------------------------//
//1) GET Endpoint for room details
router.get('/rooms', async (req, res) => {
  try {
    // Query the database to get all users
    const rooms = await Room.find();

    // Send the users in the response
    res.status(200).send(rooms);
  } catch (error) {
    console.error('Error fetching rooms from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});


//--------------------------------------- GET User Details ----------------------------//
//3) getting all the users of a particular room
router.get('/users', async (req, res) => {
  try {
    // Query the database to get all users of a specific room
    const users = await User.find({ roomID });

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

//====================================== POST ENDPOINTS =========================================//

//--------------------------------------- POST User Details ----------------------------//
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

//--------------------------------------- POST Room Details ----------------------------//
//4) add a new room to the rooms endpoint
router.post('/rooms', async (req, res) => {
  const { roomID, question, endTime} = req.body;

  if (!roomID || !question || !endTime) {
    res.status(400).send({ message: 'Incomplete room data. Please provide roomID, question, endTime, and ownerUserID.' });
    return;
  }

  try {
    const newRoom = new Room({
      roomID,
      question,
      endTime,
    
    });

    const savedRoom = await newRoom.save();

    res.status(201).send(savedRoom);
  } catch (error) {
    console.error('Error saving room to the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

//====================== DELETE ENDPOINTS ==================//

// DELETE Endpoint for deleting a room
router.delete('/rooms/:id', (req, res) => {
  const { id } = req.params;

  try {
    // Delete the room from the database
    await Room.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error deleting room from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }

  res.status(204).send();
});

// DELETE Endpoint for deleting a user
router.delete('/users/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    // Delete the user from the database
    await User.findByIdAndDelete(userID);
  } catch (error) {
    console.error('Error deleting user from the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }

  res.status(204).send();
});

//==================== PUT ENDPOINTS =====================//

module.exports = router;