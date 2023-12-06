import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Typography } from "@mui/material";

const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  // Construct the RGB color string
  return "rgb(" + red + "," + green + "," + blue + ")";
};

const getPercentage = (total, value) => {
  console.log(value + "/" + total);
  return (value / total) * 100;
};

const colorScale = (percent) => {
  const color = d3.interpolate("lightgreen", "darkgreen")(percent / 100);
  return color;
};

const getNumOfVoters = (votingOptions) => {
  let count = 0;
  for (let i = 0; i < votingOptions.length; i++) {
    if (votingOptions[i].votes.length > 0) count += 1;
  }
  return count;
};

const truncateText = (text, width) => {
  const ellipsis = "...";
  const truncatedText =
    text.length > width
      ? text.slice(0, width - ellipsis.length) + ellipsis
      : text;
  return truncatedText;
};

const getGrowthFactor = (numOfVoters) => {
  if (numOfVoters === 5) return 3;
  if (numOfVoters === 4) return 5;
  else return 2.5;
};

const getCurrentNumOfVotes = (votingOptions) => {
  let count = 0;
  for (let i = 0; i < votingOptions.length; i++) {
    count = count + votingOptions[i].votes.length;
  }
  return count;
};

const Bubble = ({ votingOptions, totalAvailableVotes }) => {
  const chartRef = useRef(null);

  const growthFactor = getGrowthFactor(getNumOfVoters(votingOptions));
  const speed = 0.05;
  const center_x = 200;
  const center_y = 300;

  // console.log("votingOptions",votingOptions);
  // console.log("Number of votes",votingOptions[0].votes.length);
  // console.log("userID",userID);
  // console.log("totalAvailableVotes",totalAvailableVotes);

  // console.log(getPercentage(totalAvailableVotes, votingOptions[0].votes.length));

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    const totalCurrentVotes = getCurrentNumOfVotes(votingOptions);

    //arranging data into a format that we can use with d3
    let data = [];
    for (let i = 0; i < votingOptions.length; i++) {
      const numOfVotes = votingOptions[i].votes.length;
      const item = {
        r: getPercentage(totalAvailableVotes, numOfVotes) * growthFactor,
        name: votingOptions[i].optionText,
        numOfVotes: numOfVotes,
      };
      numOfVotes > 0 ? data.push(item) : data.push();
    }

    // const colorScale = d3.scaleLinear().domain([0, 1]).range(['green', 'red']);

    // Drawing bubbles
    const simulation = d3
      .forceSimulation(data)
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.r + 2)
      ) // Simulation will force bubbles to be as close as possible
      .force("x", d3.forceX().strength(speed).x(center_x)) // Horizontal location
      .force("y", d3.forceY().strength(speed).y(center_y)); // Vertical location

    // Create bubbles for each data point with random positions and style them
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => d.r)
      .style("fill", () => getRandomColor())
      // .style("fill", (d) => colorScale(d.r/growthFactor))
      .style("stroke", "black") // Border color
      .style("stroke-width", 2); // Border width

    // Add text labels for each bubble
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.r / 8)
      .style("fill", "white")
      .style("font-size", "18px")
      .style("text-shadow", "1px 1px 1px black")
      .text((d) => truncateText(d.name, d.r / 6));

    svg
      .selectAll("numOfVotes")
      .data(data)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.r / 8 + 18)
      .style("fill", "white")
      .style("font-size", "18px")
      .style("text-shadow", "1px 1px 1px black")
      .style("width", (d) => d.r)
      .text((d) => d.numOfVotes);

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

      svg
        .selectAll("numOfVotes")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });
  }, []);

  return <svg ref={chartRef} width="100%" height="100%" />;
};

const BubbleChart = ({
  votingOptions,
  totalAvailableVotes,
  handleAddOption,
}) => {
  if (votingOptions.length > 0) {
    if (getCurrentNumOfVotes(votingOptions) > 0)
      return (
        <Bubble
          votingOptions={votingOptions}
          totalAvailableVotes={totalAvailableVotes}
        />
      );
    else
      return (
        <Typography variant="h6" textAlign={"center"} marginTop={"1rem"}>
          Waiting for you to vote! <br />
        </Typography>
      );
  } else
    return (
      <Typography variant="h6" textAlign={"center"} marginTop={"1rem"}>
        No voting options added yet. <br />
        Click{" "}
        <span
          style={{
            cursor: "pointer",
            color: "#007bff",
            textDecoration: "underline",
            textStyle: "italic",
          }}
          onClick={handleAddOption}
        >
          here
        </span>{" "}
        to add one.
      </Typography>
    );
};

export default BubbleChart;
