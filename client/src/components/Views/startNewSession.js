import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import { useRef } from "react";
import { FaRegCopy } from "react-icons/fa";
import Header from "../UI/header";

function StartNewSession() {
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
        <h4>Your Generated Code</h4>
      </Row>
      <Row className="pad-bottom centered">
        <span ref={joinCode} className="code">
          X 1 2 A Y Z
        </span>{" "}
        <a>
          <FaRegCopy />
        </a>
      </Row>
      <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
        <Row>
          <h4>Enter your question</h4>
        </Row>
        <Row className="pad-bottom">
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Enter your question"
              className="mr-sm-2"
            />
          </Col>
        </Row>
        <Row>
          <h4>Enter time:</h4>
        </Row>
        <Row className="pad-bottom">
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="5:00 min(s)"
              className=" mr-sm-2"
            />
          </Col>
        </Row>
        <Row>
          <h4>Votes Per Person:</h4>
        </Row>
        <Row className="pad-bottom centered">
          <Col xs="auto">
            <Form.Group className="mr-sm-2">
              <Form.Select>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <button className="default-button">Start your session</button>
        </Row>
      </Form>
    </Container>
  );
}

export default StartNewSession;
