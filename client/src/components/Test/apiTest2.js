// ApiTest2.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ApiTest2 = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomID: '',
    question: '',
    endTime: '',
  });
  const navigate = useNavigate();

  // TEST FOR GET
  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3001/rooms')
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

// TEST FOR POST
const handleCreateRoom = async () => {
  try {
    // Make a POST request to create a new room
    const response = await fetch('http://localhost:3001/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomID: newRoom.roomID,  // Ensure this is lowercase 'roomID'
        question: newRoom.question,
        endTime: newRoom.endTime,

      }),
    });

    if (response.ok) {
      console.log('Room created successfully');
      // Fetch the updated room list after creating a new room
      const updatedRoom = await response.json();
      setRooms([...rooms, updatedRoom]);
      // Reset the form
      setNewRoom({ roomID: '', question: '', endTime: ''});
    } else {
      console.error('Failed to create room');
    }
  } catch (error) {
    console.error('Error creating room:', error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({ ...prevRoom, [name]: value }));
  };

  return (
    <div>
      <h1>Room List</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            Room ID: {room.roomID}, Question: {room.question}, End Time: {room.endTime}
          </li>
        ))}
      </ul>

      <h2>Enter new room information for the database here:</h2>

      {/* Input fields for creating a new room */}
      <div className="input-row">
        <label>
          Room ID:
          <input
            type="text"
            name="roomID"
            placeholder="Enter room ID here"
            value={newRoom.roomID}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Question:
          <input
            type="text"
            name="question"
            placeholder="Enter question here"
            value={newRoom.question}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          End Time:
          <input
            type="text"
            name="endTime"
            placeholder="Enter end time here"
            value={newRoom.endTime}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
      </div>
      <br />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default ApiTest2
