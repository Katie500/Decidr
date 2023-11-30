import React, { useState } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import Header from "../UI/header";
import Or from "../UI/or";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';


const Nickname = () => {

  //Use States
  const [username, setUsername] = useState("");
  const [nameError, setNameError] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const code = state ? state.code : '';

  const nicknameToSession = () => {
    if (username !== "") {
      navigate('/Session', { state: { code, username } });
    } else {
      alert("Please enter a nickname.");
    }
  };

  const anonymousNameToSession = () => {
    navigate('/Session', { state: { code } });
  };

  return (
    <>
      <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
        <Container>
          <Header />
          <Row>
            <h4>Enter a nickname:</h4>
          </Row>
          <Row>
            <Col xs="auto">
              <Row>
                <Form.Control
                  type="text"
                  placeholder="Enter a nickname"
                  className=" mr-sm-2"
                  onChange={(event) => {
                    // Detect name change for use state
                    setUsername(event.target.value);
                    // Reset name error when the user types
                    setNameError(false);
                  }}
                />
              </Row>
            </Col>
            <Col xs="auto" className="centered short">
              <button className="alt-button" onClick={nicknameToSession}>
                Go
              </button>
            </Col>
          </Row>
          <Or />
          <Row className="centered">
            <button className="default-button" onClick={anonymousNameToSession}>
              Give me an anonymous name
            </button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default Nickname;
