import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LoadingBackdrop from "../components/global/LoadingBackdrop";
import { getRoomDetails } from "../api/getRoomDetails";
import useBroadcast, { broadcastingEventTypes } from "../hooks/useBroadcast";
import InfoIcon from "@mui/icons-material/Info";

const ResultPage = () => {
  const { userDetails } = useContext(UserContext);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { sendBroadcast, subscribeToBroadcast } = useBroadcast();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        if (!userDetails.roomID) {
          // Handle case where room ID is not available
          return;
        }

        const { roomDetails, voteOptions } = await getRoomDetails(
          userDetails.roomID
        );
        setRoomDetails(roomDetails);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };

    fetchRoomDetails();
  }, [userDetails.roomID]);

  const handleHomePage = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  // Filter options and take the top 3
  const topThreeOptions = roomDetails
    ? roomDetails.voteOptions
        .slice()
        .sort((a, b) => b.votes.length - a.votes.length)
        .slice(0, 3)
    : [];

    return (
      <>
        <Box className="topBarContainer">
          <Box className="topBar widthConstraint">
            <IconButton className="topBarIcon" onClick={handleBack}>
              <ArrowBackOutlinedIcon />
            </IconButton>
            <Typography variant="h6"></Typography>
          </Box>
        </Box>
  
        <Grid className="container">
          <Box className="contentBox widthConstraint">
            <Box
              style={{
                width: "100%",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
              }}
            >
              <img
                src="/logoCropped.jpg"
                alt="Decidr GIF"
                style={{
                  width: "50%",
                }}
              />
            </Box>
            {loading && <LoadingBackdrop open={true} />}
            {!loading && roomDetails && (
              // Display the question
              <Grid item xs={12}>
                {/* Adjusted marginTop value */}
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontStyle="bold"
                  marginTop={1.5}
                >
                  Top Suggestions
                </Typography>
                {/* Adjusted marginTop value */}
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontStyle="italic"
                  marginTop={2.5}
                >
                  Question: {roomDetails.question}
                </Typography>
  
                <br></br>
  
                <Grid item xs={12}>
                  <Typography variant="h6" fontSize="1.1rem" paddingLeft={"10%"}>
                    <strong>Results:</strong>
                  </Typography>
  
                  {topThreeOptions.map((option, index) => (
                    <div key={option._id}>
                      <Typography variant="body1" style={{ paddingLeft: "5%" }}>
                        <Card
                          style={{
                            borderRadius: "16px", // You can adjust the value for more or less rounding
                            marginTop: "8px", // Adjust spacing between cards
                          }}
                        >
                          <CardContent
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <strong style={{ marginRight: "8px" }}>
                                {index + 1}:
                              </strong>{" "}
                              {option.optionText}
                            </div>
                            <div>
                              <strong>Votes:</strong> {option.votes.length}
                            </div>
                            <div>
                              <IconButton>
                                <InfoIcon />
                              </IconButton>
                            </div>
                          </CardContent>
                        </Card>
                      </Typography>
                    </div>
                  ))}
                </Grid>
  
                <br />
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleHomePage}
                    fullWidth
                  >
                    Back to home
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
      </>
    );
  };

export default ResultPage;
