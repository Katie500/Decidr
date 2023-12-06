const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const Room = require("../models/roomSchema");

//====================================================== GET ENDPOINTS ==============================//

//--------------------------------------- GET Room Details ----------------------------//
//1) GET Endpoint for room details
router.get("/rooms", async (req, res) => {
  try {
    // Query the database to get all users
    const rooms = await Room.find();

    // Send the users in the response
    res.status(200).send(rooms);
  } catch (error) {
    console.error("Error fetching rooms from the database:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//--------------------------------------- GET User Details ----------------------------//
//3) getting all the users of a particular room
router.get("/users", async (req, res) => {
  try {
    // Query the database to get all users
    const users = await User.find();

    // Send the users in the response
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users from the database:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//4) add a new voting option
//5) removing a voting option
//6) voting for a given option (and it being broadcasted to everyone in the room)

//7) Getting all the users of a particular room

//====================================== POST ENDPOINTS =========================================//

//--------------------------------------- POST User Details ----------------------------//
//4) add a new user to the users endpoint
router.post("/users", async (req, res) => {
  const { roomID, isAdmin, username, profilePicture } = req.body;

  if (!roomID || !username) {
    res
      .status(400)
      .send({
        message:
          "Incomplete user data. Please provide userID, roomID, and username.",
      });
    return;
  }

  try {
    // Create a new user object with the provided data
    const newUser = new User({
      roomID,
      isAdmin,
      username,
      profilePicture,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).send(savedUser);
  } catch (error) {
    console.error("Error saving user to the database:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//--------------------------------------- POST Room Details ----------------------------//
//4) add a new room to the rooms endpoint
router.post("/rooms", async (req, res) => {
  const { roomID, question, endTime } = req.body;

  if (!roomID || !question || !endTime) {
    res
      .status(400)
      .send({
        message:
          "Incomplete room data. Please provide roomID, question, endTime, and adminUserID.",
      });
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
    console.error("Error saving room to the database:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//====================== DELETE ENDPOINTS ==================//
// DELETE Endpoint for deleting a room
router.delete("/rooms/:id", (req, res) => {
  const { id } = req.params;

  deleteRoomFromDatabase(id);

  res.status(204).send();
});

// DELETE Endpoint for deleting a user
router.delete("/users/:userID", (req, res) => {
  const { userID } = req.params;

  deleteUserFromDatabase(userID);

  res.status(204).send();
});

//==================== PUT ENDPOINTS =====================//

// PUT Endpoint for updating user details
router.put("/users/:userID", async (req, res) => {
  const { userID } = req.params; // Extract user ID from the URL
  const { profilePicture } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userID);

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Update the user's profile picture
    user.profilePicture = profilePicture;

    // Save the updated user to the database
    const updatedUser = await user.save();

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user profile picture:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
