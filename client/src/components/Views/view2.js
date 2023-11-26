import { Col, Container, Row } from "react-bootstrap";
import Timer from "../UI/timer";
import { useState } from "react";
import data from "../data";

const VotingRow = ({ totalVotes, data }) => (
  <>
    <Row>
      <Col>{data.nameOfPlace}</Col>
      <Col>
        {data.totalVotes} / {totalVotes}
      </Col>
      <Col>{data.currentVotes}</Col>
      <Col>
        <button>&#x2b;</button>
      </Col>
      <Col>
        <button>&#45;</button>
      </Col>
    </Row>
  </>
);

const View2 = () => {
  const maxVotesPerPerson = 5;

  const [votes, setVotes] = useState(maxVotesPerPerson); //total votes a user is allowed ; this value will increment/decrement

  const votesLeft = 1; //actually do math here later

  const totalVotes = 25; //do actual math later

  return (
    <Container>
      <Row style={{ justifyContent: "flex-end", textAlign: "right" }}>
        <Col>
          <Timer />
        </Col>
      </Row>
      {data.map((info) => (
        <VotingRow data={info} totalVotes={totalVotes} />
      ))}
      <Row
        style={{
          textAlign: "center",
          justifyContent: "center",
          paddingTop: "50px",
        }}
      >
        <h3>
          You have {votesLeft}/{maxVotesPerPerson} votes left
        </h3>
        <button>&#x2b;</button>
      </Row>
    </Container>
  );
};

export default View2;
