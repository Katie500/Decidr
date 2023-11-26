import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

function Default() {
  return (
    <>
      <Form inline style={{ textAlign: "center", justifyContent: "center" }}>
        <Container>
          <Row>
            <h1>Decidr</h1>
          </Row>
          <Row>
            <h4>Enter a code for an existing sessio:</h4>
          </Row>
          <Row>
            <Col xs="auto">
              <Row>
                <Form.Control
                  type="text"
                  placeholder="xxxxx"
                  className=" mr-sm-2"
                />
              </Row>
            </Col>
            <Col xs="auto" style={{ alignItems: "center", display: "flex" }}>
              <button type="submit">Verify</button>
            </Col>
          </Row>
          <Row>or</Row>
          <Row>
            <button>Start a new session</button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default Default;
