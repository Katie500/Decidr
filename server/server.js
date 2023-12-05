const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/avatar/:id/:size', async (req, res) => {
  const { id, size } = req.params;
  const imageUrl = `https://api.multiavatar.com/${id}/${size}`;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Resize the image to a smaller size
    const resizedImageBuffer = await sharp(response.data)
      .resize(100) // Set your desired size
      .toBuffer();

    // Compress the image
    const compressedImageBuffer = await sharp(resizedImageBuffer)
      .jpeg({ quality: 80 }) // Adjust the quality as needed
      .toBuffer();

    // Send the compressed image to the client
    res.type('image/jpeg').send(compressedImageBuffer);
  } catch (error) {
    console.error('Error fetching or processing the image:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Database Schemas
const User = require('./models/userSchema');
const Room = require('./models/roomSchema');

// Require the Routes
const apiRoutes = require('./routes/apiRoutes');
const createUserAndRoom = require('./routes/createUserAndRoom');
const verifyRoom = require('./routes/verifyRoom');
const createUser = require('./routes/createUser');
const getRoomDetails = require('./routes/getRoomDetails');
const addNewOption = require('./routes/addNewOption');
const addVote = require('./routes/addVote');
const removeVote = require('./routes/removeVote');

// Use the apiRoutes
app.use('/', apiRoutes);
app.use('/createUserAndRoom', createUserAndRoom);
app.use('/verifyRoom', verifyRoom);
app.use('/createUser', createUser);
app.use('/getRoomDetails', getRoomDetails);
app.use('/addNewOption', addNewOption);
app.use('/addVote', addVote);
app.use('/removeVote', removeVote);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});


io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('check_room', (data, callback) => {
    const roomExists = io.sockets.adapter.rooms.has(data);
    callback(roomExists);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// Server Response

// Connect to MongoDB using mongoose
mongoose
  .connect('mongodb://0.0.0.0:27017/decidr')
  .then(() => {
    console.log('MongoDB connected');

    // Run the userSchema.js code
    require('./models/userSchema');
    require('./models/roomSchema');

    // Start the server after MongoDB connection is established
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
