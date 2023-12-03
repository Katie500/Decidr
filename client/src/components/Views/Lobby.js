import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "../UI/header";
import { useLocation, useNavigate } from 'react-router-dom';


//Lobby component represents the page where users can vote on choices.
function Lobby() {

  // Extracting room and username from the location state using useLocation hook.
  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state ? state.room : '';
  const username = state ? state.username : '';

  // State to manage choices, votes, and notifications
  const [choices, setChoices] = useState([
    { id: 1, text: "Choice 1", votes: 0 },
    { id: 2, text: "Choice 2", votes: 0 },
  ]);
  
  const [newChoiceText, setNewChoiceText] = useState("");
  const [choiceCounter, setChoiceCounter] = useState(2);
  const [notifications, setNotifications] = useState([]);

  const handleVote = (choiceId) => {
    const votedChoice = choices.find((choice) => choice.id === choiceId);
    setChoices((prevChoices) =>
      prevChoices.map((choice) =>
        choice.id === choiceId ? { ...choice, votes: choice.votes + 1 } : choice
      )
    );

    // Add a notification for the vote
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `${username} voted for ${votedChoice.text}`,
    ]);
  };

  const handleAddChoice = () => {
    const newChoiceId = choiceCounter + 1;
    const newChoice = { id: newChoiceId, text: newChoiceText, votes: 0 };
    setChoices((prevChoices) => [...prevChoices, newChoice]);
    setNewChoiceText(""); // Clear the input field after adding a choice
    setChoiceCounter(newChoiceId);

    // Add a notification for adding a choice
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `${username} added a new choice: ${newChoiceText}`,
    ]);
  };

  const handleRemoveChoice = (choiceId) => {
    const removedChoice = choices.find((choice) => choice.id === choiceId);
    setChoices((prevChoices) => prevChoices.filter((choice) => choice.id !== choiceId));

    // Add a notification for removing a choice
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `${username} removed a choice: ${removedChoice.text}`,
    ]);
  };

  const renderChoices = () => {
    return choices.map((choice) => (
      <Row key={choice.id} className="pad-bottom centered">
        <Col xs="auto">
          <p>{choice.text}</p>
        </Col>
        <Col xs="auto">
          <button onClick={() => handleVote(choice.id)}>Vote</button>
        </Col>
        <Col xs="auto">
          <p>Votes: {choice.votes}</p>
        </Col>
        <Col xs="auto">
          <button onClick={() => handleRemoveChoice(choice.id)}>Remove Choice</button>
        </Col>
      </Row>
    ));
  };

  //Navigates back to the login page.
  const navigateBack = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header />
      <Row>
        <h4>Welcome {username}!</h4>
        <div>
          <p>Room Code: {room}</p>
        </div>
      </Row>
      <Row className="pad-bottom centered">
        <h4>Vote on Choices</h4>
      </Row>
      {renderChoices()}
      <Row className="pad-bottom centered">
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Enter new choice"
            className="mr-sm-2"
            value={newChoiceText}
            onChange={(event) => setNewChoiceText(event.target.value)}
          />
        </Col>
        <Col xs="auto">
          <button onClick={handleAddChoice}>Add Choice</button>
        </Col>
      </Row>
      <Row className="pad-bottom centered">
        <Col xs="auto">
          <button onClick={navigateBack}>Back to Login</button>
        </Col>
      </Row>
      <Row>
        <h4>Notifications</h4>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </Row>
    </Container>
  );
}

export default Lobby;
