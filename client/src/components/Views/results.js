import { Col, Container, Row } from "react-bootstrap";
import { HiOutlineInformationCircle } from "react-icons/hi";
import data from "../data";

const VotingRow = ({ data }) => (
  <>
    <Row>
      <Col style={{ fontSize: "larger", fontWeight: "800" }}>
        {data.nameOfPlace}:
      </Col>
      <Col>{data.totalVotes}</Col>
      <Col style={{ fontSize: "250%" }}>
        <HiOutlineInformationCircle
          onClick={() => alert("Add names + change this to a modal eventually")}
        />
      </Col>
    </Row>
  </>
);

const Results = () => {
  return (
    <Container style={{ justifyContent: "center", textAlign: "center" }}>
      <Row>
        <Col>
          <h2>Top Suggestions</h2>
        </Col>
      </Row>
      {data.map((info) => (
        <VotingRow data={info} />
      ))}
      <Row
        style={{
          textAlign: "center",
          justifyContent: "center",
          paddingTop: "50px",
        }}
      >
        <button className="default-button">Back to Home</button>
      </Row>
    </Container>
  );
};

export default Results;
