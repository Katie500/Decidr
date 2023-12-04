const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const PORT = 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

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

// Use the apiRoutes
app.use('/', apiRoutes);
app.use('/createUserAndRoom', createUserAndRoom);
app.use('/verifyRoom', verifyRoom);
app.use('/createUser', createUser);
app.use('/getRoomDetails', getRoomDetails);
app.use('/addNewOption', addNewOption);
app.use('/addVote', addVote);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});

//==================================== ROOM CONNECTION =========================//
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

//============================ SERVER RESPONSE =============================//

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
