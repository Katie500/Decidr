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

const getPercentage = (total, value) => {
  console.log(value + "/" + total);
  return (value/total)*100;
}


const colorScale = (percent) => {
  const color = d3.interpolate("lightgreen", "darkgreen")(percent/100);
  return color;
}

const BubbleChart = ({
  votionOptions,
  handleAddVote,
  handleRemoveVote,
  handleAddOption,
  userID,
  totalAvailableVotes,
}) => {
  const chartRef = useRef(null);

  const growthFactor = 2.5;

  console.log("votionOptions",votionOptions);
  console.log("Number of votes",votionOptions[0].votes.length);
  // console.log("userID",userID);
  console.log("totalAvailableVotes",totalAvailableVotes);

  console.log(getPercentage(totalAvailableVotes, votionOptions[0].votes.length));

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    let data = [];
    for (let i=0; i<votionOptions.length; i++){
        const item = {
          r: getPercentage(totalAvailableVotes, votionOptions[i].votes.length) * growthFactor, name: votionOptions[i].optionText
        };
        votionOptions[i].votes.length > 0 ? data.push(item) : data.push();
    }

    // const colorScale = d3.scaleLinear().domain([0, 1]).range(['green', 'red']);

   

    // Create a force simulation
    const simulation = d3
      .forceSimulation(data)
      .force(
        "collide",
        //dividing radius by growth factor because we multiply it above
        d3.forceCollide().radius((d) => d.r + 2)
      ) // Adjust the padding as needed
      .force(
        "x",
        d3
          .forceX()
          .strength(0.1)
          .x(400 / 2)
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
      .style("fill", (d) => colorScale(d.r/growthFactor))
      .style('stroke', 'black') // Border color
      .style('stroke-width', 2) // Border width
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
    <svg ref={chartRef} width="100%" height="100%" onClick={() => alert("hi")}>
      {/* Any additional SVG elements can be added here */}
    </svg>
  );
};

export default BubbleChart;
