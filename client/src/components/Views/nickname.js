import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import Header from "../UI/header";
import Or from "../UI/or";

function Nickname() {
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
                />
              </Row>
            </Col>
            <Col xs="auto" className="centered short">
              <button type="submit" className="alt-button">
                Go
              </button>
            </Col>
          </Row>
          <Or />
          <Row className="centered">
            <button className="default-button">
              Give me an anonymous name
            </button>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default Nickname;
