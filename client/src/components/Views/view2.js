import { Col, Container, Row } from "react-bootstrap";
import Timer from "../UI/timer";
import { useState } from "react";
import data from "../data";
import View from "../UI/view";

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
