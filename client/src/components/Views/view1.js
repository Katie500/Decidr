import { Col, Container, Row } from "react-bootstrap";
import Timer from "../UI/timer";
import { useState } from "react";
import data from "../data";
import View from "../UI/view";

const Bubble = ({ data, weight }) => <div>{data.nameOfPlace}</div>;

const View1 = () => {
  const totalVotes = 25; //do actual math later

  return (
    <View>
      {data.map((info) => (
        <Bubble data={info} totalVotes={totalVotes} />
      ))}
    </View>
  );
};

export default View1;
