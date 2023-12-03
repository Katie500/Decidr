router.post('/createUser', async (req, res) => {
  const { socketID, username, roomID } = req.body;

  if (!socketID || !username) {
    res.status(400).send({
      message: 'Incomplete user data. Please provide socketID and username.',
    });
    return;
  }

  try {
    // Create a new user object with the provided data
    const newUser = new User({
      socketID,
      username,
      roomID,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).send(savedUser);
  } catch (error) {
    console.error('Error saving user to the database:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
