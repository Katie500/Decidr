import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import socket from '../utils/socket';

const Index = () => {
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    socket.on('room-created', (room) => {
      setRooms((prevRooms) => ({ ...prevRooms, [room]: {} }));
    });
  }, []);

  return (
    <div>
      {Object.keys(rooms).map((room) => (
        <div key={room}>
          {room}
          <Link to={`/${room}`}>Join</Link>
        </div>
      ))}
      <form action="/room" method="POST">
        <p>Generate New Room Code: <span id="new-room-code"></span></p>
        <button type="submit">Start a new session</button>
      </form>
    </div>
  );
};

export default Index;