import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

function Nickname() {
  return (
    <>
      <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
        <Container>
          <Row>
            <h1>Decidr</h1>
          </Row>
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
                />
              </Row>
            </Col>
            <Col xs="auto" style={{ alignItems: "center", display: "flex" }}>
              <button type="submit">Submit</button>
            </Col>
          </Row>
          <Row>or</Row>
          <Row>
            <button>Give me an anonymous name</button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default Nickname;
