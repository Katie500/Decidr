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
router.get('/users', (req, res) => {
  const users = [
    {
      userID: 'User12345',
      roomID: '',
      isAdmin: false,
      username: '',
    },
    {
      userID: 'User2',
      roomID: '2',
      isAdmin: false,
      username: 'Aaron',
    },
    {
      userID: 'User3',
      roomID: '3',
      isAdmin: false,
      username: 'Samir',
    }    
  ];

  res.status(200).send(users);
});

//4) add a new voting option
//5) removing a voting option
//6) voting for a given option (and it being broadcasted to everyone in the room)

//7) Getting all the users of a particular room

//====================== POST ENDPOINTS ==================//

//4) add a new user to the users endpoint
router.post('/users', (req, res) => {
  const { userID, roomID, isAdmin, username } = req.body;

  if (!userID || !roomID || !username) {
    res.status(400).send({ message: 'Incomplete user data. Please provide userID, roomID, and username.' });
    return;
  }

  // Create a new user object with the provided data
  const newUser = {
    userID: 'Some User ID',
    roomID: 'Some Room ID',
    isAdmin: 'false',
    username: 'Some Username',
  };

  // Add the new user to the in-memory array or store it in the database
  // (you can replace the in-memory array with a database operation)

  res.status(201).send(newUser);
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
