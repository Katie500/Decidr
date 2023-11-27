// client/App.js

import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Room from "./components/Room";
import Test from "./test";

const socket = io.connect("http://localhost:3001");

// client/src/App.js

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
    <>
      <head>
        <script
          src="https://unpkg.com/react/umd/react.production.min.js"
          crossorigin
        ></script>

        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
          crossorigin
        ></script>

        <script
          src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossorigin
        ></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"
        />
      </head>
      <body>
        <Router>
          <Routes>
            <Route path="/:roomName" element={<Room />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
        {/* <div className="App">
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
                <button onClick={generateRandomRoom}>
                  Generate Random Room
                </button>
              </div>
            </div>
          ) : (
            <Room
              socket={socket}
              username={username}
              room={room}
              randomRoomCode={randomRoomCode}
            />
          )}
        </div> */}
      </body>
    </>
  );
}

export default App;
