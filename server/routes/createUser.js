const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");

router.post("/", async (req, res) => {
  const { socketID, username, roomID, profilePicture } = req.body;

  if (!socketID || !username || !roomID) {
    res.status(400).send({
      message:
        "Incomplete user data. Please provide socketID, username, and roomID.",
    });
    return;
  }

  try {
    // Create a new user object with the provided data
    const newUser = new User({
      socketID,
      username,
      roomID,
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
module.exports = router;
