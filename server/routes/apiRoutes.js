const express = require("express");
const router = express.Router();

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
      nickname: '',
    },
    {
      userID: 'User2',
      roomID: '2',
      isAdmin: false,
      nickname: 'Aaron',
    },
    {
      userID: 'User3',
      roomID: '3',
      isAdmin: false,
      nickname: 'Samir',
    }    
  ];

  res.status(200).send(users);
});

//4) add a new voting option
//5) removing a voting option
//6) voting for a given option (and it being broadcasted to everyone in the room)

//7) Getting all the users of a particular room

//====================== POST ENDPOINTS ==================//
//POST Endpoint for room
router.post('/room/:id', (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  if (!code) {
    res.status(418).send({ message: 'We need a code!' });
    return;
  }

  res.send({
    room: `Your ${code} and ID ${id}`,
  });
});


//4) add a new user to the users endpoint
router.post('/users', (req, res) => {
  const { userID, roomID, isAdmin, nickname } = req.body;

  if (!userID || !roomID || !nickname) {
    res.status(400).send({ message: 'Incomplete user data. Please provide userID, roomID, and nickname.' });
    return;
  }

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
