// client/App.js

import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Room from "./components/Room";

const socket = io.connect("http://localhost:3001");


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [randomRoomCode, setRandomRoomCode] = useState("");
  const [nameError, setNameError] = useState(false); // New state for name error
  const [codeError, setCodeError] = useState(false); // New state for code error

  const joinRoom = () => {
    if (username !== "") {
      if (room !== "") {
        // Check if the room with the entered code exists
        socket.emit("check_room", room, (roomExists) => {
          if (roomExists) {
            socket.emit("join_room", room);
            setShowChat(true);
            // Reset errors
            setNameError(false);
            setCodeError(false);
          } else {
            alert("Room does not exist. Please enter a valid code.");
          }
        });
      } else {
        // Set code error if room is empty
        setCodeError(true);
        setNameError(false);
      }
    } else {
      // Set name error if username is empty
      setNameError(true);
      setCodeError(room === ""); // Set code error if room is also empty
    }
  };
  
  

  const generateRandomRoom = () => {
    if (username !== "") {
      const code = Math.random().toString(36).substring(7);
      setRoom(code);
      setRandomRoomCode(code);
      socket.emit("join_room", code);
      setShowChat(true);
      // Reset name error
      setNameError(false);
      setCodeError(false);
    } else {
      // Set name error
      setNameError(true);
      setCodeError(false);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
        <div>
          <h1>Enter code for existing session</h1>
          {nameError && <p style={{ color: "red" }}>Name is required</p>}
          <input
            type="text"
            placeholder="Enter Name..."
            onChange={(event) => {
              setUsername(event.target.value);
              // Reset name error when the user types
              setNameError(false);
              setCodeError(false);
            }}
          />
          
        </div>
            <div>

          <input
            type="text"
            placeholder="Enter Code..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />

          {codeError && <p style={{ color: "red" }}>Code is required</p>} 
          <button onClick={joinRoom}>Join A Room</button>
          </div>
          <div>
          <button onClick={generateRandomRoom}>Generate Random Room</button>
          </div>
        </div>
      ) : (
        <Room socket={socket} username={username} room={room} randomRoomCode={randomRoomCode} />
      )}
    </div>
  );
}

export default App;