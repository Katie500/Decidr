import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import data from "../data";
import View from "../UI/view";

const VotingRow = ({ totalVotes, data }) => (
  <>
    <Row className="vote-row">
      <Col>{data.nameOfPlace}</Col>
      <Col>
        <span style={{ color: "green" }}> {data.totalVotes}</span> /{" "}
        {totalVotes}
      </Col>
      <Col>
        <span className="vote-count">{data.currentVotes}</span>
      </Col>
      <Col>
        <button className="vote-button" style={{ color: "lightgreen" }}>
          &#x2b;
        </button>
      </Col>
      <Col>
        <button className="vote-button" style={{ color: "red" }}>
          &#45;
        </button>
      </Col>
    </Row>
  </>
);

const View2 = () => {
  const totalVotes = 25; //do actual math later

  return (
    <View>
      {data.map((info) => (
        <VotingRow data={info} totalVotes={totalVotes} />
      ))}
    </View>
  );
};

export default View2;
