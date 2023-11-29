import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import { useState } from "react";
import io from "socket.io-client";
import Room from "./Room";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";

const socket = io.connect("http://localhost:3001");

function Login() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [randomRoomCode, setRandomRoomCode] = useState("");
  const [nameError, setNameError] = useState(false); // New state for name error
  const [codeError, setCodeError] = useState(false); // New state for code error

  const joinRoom = (event) => {
    console.log("hey");
    event.preventDefault();
    if (username !== "") {
      if (room !== "") {
        event.preventDefault();
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
      {!showChat ? (
        <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
          <Container>
            <Row className="centered" style={{ paddingBottom: "50px" }}>
              <h1>Decidr</h1>
            </Row>
            <Row>
              <h4>Enter your name:</h4>
            </Row>
            <Row>
              <Col xs="auto">
                <Row>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    className=" mr-sm-2"
                    onChange={(event) => {
                      setUsername(event.target.value);
                      // Reset name error when the user types
                      setNameError(false);
                      setCodeError(false);
                    }}
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <h4>Enter a code for an existing session:</h4>
            </Row>
            <Row>
              <Col xs="auto">
                <Row>
                  <Form.Control
                    type="text"
                    placeholder="xxxxx"
                    className=" mr-sm-2"
                    onChange={(event) => {
                      setRoom(event.target.value);
                    }}
                  />
                </Row>
              </Col>
              <Col
                xs="auto"
                style={{ alignItems: "center", display: "flex" }}
                className="short"
              >
                <button
                  type="submit"
                  className="default-button"
                  onClick={joinRoom}
                >
                  Verify
                </button>
              </Col>
            </Row>

            <Row>
              <button className="alt-button" onClick={generateRandomRoom}>
                Start a new session (Generate Random Room)
              </button>
            </Row>
          </Container>
        </Form>
      ) : (
        <Room
          socket={socket}
          username={username}
          room={room}
          randomRoomCode={randomRoomCode}
        />
      )}
    </>
  );
}

export default Login;
