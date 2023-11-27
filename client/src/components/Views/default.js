import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

function Default() {
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
                />
              </Row>
            </Col>
            <Col
              xs="auto"
              style={{ alignItems: "center", display: "flex" }}
              className="short"
            >
              <button type="submit" className="default-button">
                Verify
              </button>
            </Col>
          </Row>
          <Row
            style={{
              textAlign: "center",
              width: "100%",
              justifyContent: "center",
              paddingTop: "5%",
              paddingBottom: "5%",
              fontWeight: "700",
            }}
          >
            or
          </Row>
          <Row>
            <button className="alt-button">Start a new session</button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default Default;
