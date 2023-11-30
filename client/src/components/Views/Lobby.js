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
  const code = state ? state.code : '';
  const username = state ? state.username : '';

  const joinCode = useRef(null);


  const handleCopyClick = () => {
    // Select the text in the textarea
    joinCode.current.select();
    // Execute copy command
    document.execCommand("copy");
  };

  return (
    <Container>
      <Header />
      <Row>
        <h4>Welcome {username} !</h4>
      </Row>
 
    </Container>
  );
}

export default Lobby;
