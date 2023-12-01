import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import { useRef } from "react";
import { FaRegCopy } from "react-icons/fa";
import Header from "../UI/header";
import { useLocation, useNavigate } from 'react-router-dom';

function Lobby() {

  //Grabs stored code from previous sections
  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state ? state.room : '';
  const username = state ? state.username : '';


  const joinCode = useRef(null);


  const handleCopyClick = () => {
    // Select the text in the textarea
    joinCode.current.select();
    // Execute copy command
    document.execCommand("copy");

  // State to manage choices and votes
  const [choices, setChoices] = useState([
    { id: 1, text: "Choice 1", votes: 0 },
    { id: 2, text: "Choice 2", votes: 0 },
  ]);

  const [newChoiceText, setNewChoiceText] = useState("");

  const handleVote = (choiceId) => {
    setChoices((prevChoices) =>
      prevChoices.map((choice) =>
        choice.id === choiceId ? { ...choice, votes: choice.votes + 1 } : choice
      )
    );
  };

  const handleAddChoice = () => {
    const newChoiceId = choices.length + 1;
    const newChoice = { id: newChoiceId, text: newChoiceText, votes: 0 };
    setChoices([...choices, newChoice]);
    setNewChoiceText(""); // Clear the input field after adding a choice
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
    </Container>
  );
}

export default Lobby;
