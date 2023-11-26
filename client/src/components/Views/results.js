import { Col, Container, Row } from "react-bootstrap";
import { IoInformationCircle } from "react-icons/io5";
import data from "../data";

const VotingRow = ({ data }) => (
  <>
    <Row>
      <Col>{data.nameOfPlace}:</Col>
      <Col>{data.totalVotes}</Col>
      <Col>
        <IoInformationCircle />
      </Col>
    </Row>
  </>
);

const Results = () => {
  return (
    <Container>
      <Row style={{ justifyContent: "center", textAlign: "center" }}>
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
        <button>Back to Home</button>
      </Row>
    </Container>
  );
};

export default Results;
