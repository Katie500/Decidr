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
  Modal,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LoadingBackdrop from "../components/global/LoadingBackdrop";
import { getRoomDetails } from "../api/getRoomDetails";
import InfoIcon from "@mui/icons-material/Info";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const ResultPage = () => {
  const [users, setUsers] = useState([]); // users state
  const { userDetails } = useContext(UserContext);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Step 1: Add state variables for the modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const userID = userDetails.userID;
  const username = userDetails.nickname;

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




  
//------------ fetch room user and votes --------------//


  const handleHomePage = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  // Step 3: Update handleInfoClick function
  const handleInfoClick = (option) => {
    setSelectedOption(option);
    setModalOpen(true);
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
            <Grid item xs={12}>
              <Typography
                variant="h4"
                textAlign="center"
                fontStyle="bold"
                marginTop={1.5}
              >
                Top Suggestions
              </Typography>
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


              {/* Displaying room _id */}
              <Typography variant="body1" style={{ paddingLeft: "5%" }}>
                <strong>Room ID:</strong> {roomDetails._id}
              </Typography>





              {roomDetails.voteOptions.map((option, index) => (
                <div key={option._id}>
                  <Typography variant="body1" style={{ paddingLeft: "5%" }}>
                    <Card
                      style={{
                        borderRadius: "16px",
                        marginTop: "8px",
                      }}
                    >
                      <div>
                        <strong>Option ID:</strong> {option._id}
                      </div>

                    </Card>
                  </Typography>
                </div>
              ))}





                      

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
                            <IconButton
                              onClick={() => handleInfoClick(option)}
                            >
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

      <Modal
  open={isModalOpen}
  onClose={() => setModalOpen(false)}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography id="modal-title" variant="h6" component="h2">
      Users who voted for {selectedOption?.optionText}
    </Typography>
    <Typography id="modal-description" sx={{ mt: 2 }}>
  {selectedOption && selectedOption.votes ? (
    selectedOption.votes.map((user) => (
      <div key={user._id}>
        <strong>{user.username}</strong>: {user.votes ? user.votes.length : 1} votes
      </div>
    ))
  ) : (
    <div>No users voted for this option.</div>
  )}
</Typography>
  </Box>
</Modal>

    </>
  );
};

export default ResultPage;
