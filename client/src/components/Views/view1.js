import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import data from "../data";
import View from "../UI/view";
import styles from "./views.module.css";

const decideSize = (data, totalVotes) => {
  const maxWidth = 8; //max value, gets multiplied by a factor of 100 later

  // get the percentage
  const percentage = (data.totalVotes / totalVotes) * 100;

  const size = `${percentage * maxWidth}px`;

  return {
    width: size,
    height: size,
  };
};

const Bubble = ({ data, totalVotes }) => (
  <div className={styles.bubble} style={{ ...decideSize(data, totalVotes) }}>
    <h4> {data.nameOfPlace}</h4>
  </div>
);

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
