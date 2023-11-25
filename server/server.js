const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

// Define the function to generate a random room code
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms });
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/room', (req, res) => {
  // Handle the form submission
  const randomRoomCode = generateRandomCode();

  if (rooms[randomRoomCode] != null) {
    // If the generated code already exists, try again
    return res.redirect('/');
  }

  rooms[randomRoomCode] = { users: [] };

  // Redirect to the newly created room
  res.redirect(`/${randomRoomCode}`);

  // Send a message that a new room was created
  io.emit('room-created', randomRoomCode);
});

io.on('connection', (socket) => {
  // ... (existing socket event handlers)

  socket.on('disconnect', () => {
    // ... (existing disconnect logic)

    // Send an update to all clients with the new rooms data
    io.emit('update-rooms', rooms);
  });
});

// Start the server and listen on port 3001
server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
