const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require('mongoose');
const { Server } = require("socket.io");
app.use(cors());

// Database Schemas
import User from "./models/userSchema";
import Room from "./models/roomSchema";

const CONNECTION_URL = 'mongodb+srv://decidr_admin:decidr2023@cluster0.oluaicr.mongodb.net/decidrDB'
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((err) => console.log(err.message));

mongoose.set('useFindAndModify', false);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("check_room", (data, callback) => {
    const roomExists = io.sockets.adapter.rooms.has(data);
    callback(roomExists);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
