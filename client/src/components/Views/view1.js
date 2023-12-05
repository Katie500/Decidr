import View from "../UI/view";
import styles from "./views.module.css";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const BubbleChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Sample data with names
    const data = [
      { r: 20, name: "Circle 1" },
      { r: 90, name: "Circle 2" },
      { r: 50, name: "Circle 3" },
    ];

    // Create a force simulation
    const simulation = d3
      .forceSimulation(data)
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.r + 2)
      ) // Adjust the padding as needed
      .force(
        "x",
        d3
          .forceX()
          .strength(0.1)
          .x(800 / 2)
      ) // Center on the x-axis
      .force(
        "y",
        d3
          .forceY()
          .strength(0.1)
          .y(600 / 2)
      ); // Center on the y-axis

    // Create circles for each data point with random positions
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => d.r)
      .style("fill", () => getRandomColor())
      .call(
        d3
          .drag() // Enable dragging for circles
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    // Add text labels for each circle
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.4em") // Adjust the vertical alignment
      .style("fill", "white")
      .style("font-size", "12px")
      .text((d) => d.name);

    // Update positions in each tick of the simulation
    simulation.on("tick", () => {
      svg
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      svg
        .selectAll("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  return (
    <svg ref={chartRef} width={1000} height={1000} onClick={() => alert("hi")}>
      {/* Any additional SVG elements can be added here */}
    </svg>
  );
};

const View1 = ({
  votionOptions,
  handleAddVote,
  handleRemoveVote,
  handleAddOption,
  userID,
  totalAvailableVotes,
}) => {
  return (
    <View>
      {/* {data.map((info) => (
        <Bubble data={info} totalVotes={totalVotes} />
        
      ))} */}
      <BubbleChart />
    </View>
  );
};

export default View1;
