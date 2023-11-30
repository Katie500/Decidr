import React, { useState } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import StartNewSession from "./startNewSession";

const socket = io.connect("http://localhost:3001");

function Login() {
  const [room, setRoom] = useState("");
  const [randomRoomCode, setRandomRoomCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const navigate = useNavigate();
  //const code = "";

  const joinRoom = (event) => {
    event.preventDefault();
    if (room !== "") {
      socket.emit("check_room", room, (roomExists) => {
        if (roomExists) {
          socket.emit("join_room", room);
          setCodeError(false);
          //code = room;
          navigate("/Nickname", { state: { room } });
        } else {
          alert("Room does not exist. Please enter a valid code.");
        }
      });
    } else {
      setCodeError(room === "");
    }
  };

  const generateRandomRoom = () => {
      const code = Math.random().toString(36).substring(7);
      setRoom(code);
      setRandomRoomCode(code);
      socket.emit("join_room", code);
      setCodeError(false);
      navigate("/Nickname", { state: { room: code } });
  };
  
  return (
    <>
        <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
          <Container>
            <Row className="centered" style={{ paddingBottom: "50px" }}>
              <h1>Decidr</h1>
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
      
    </>
  );
}

export default Login;
