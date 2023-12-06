import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import LoadingBackdrop from '../../components/global/LoadingBackdrop';
import { getRoomDetails } from '../../api/getRoomDetails';
import useBroadcast, { broadcastingEventTypes } from '../../hooks/useBroadcast';

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
        console.error('Failed to fetch room details:', error);
      }
    };

    fetchRoomDetails();
  }, [userDetails.roomID]);

  const handleHomePage = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Box className="topBarContainer">
        <Box className="topBar widthConstraint">
          <IconButton className="topBarIcon" onClick={handleBack}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant="h6">Results</Typography>
        </Box>
      </Box>

      <Grid className="container">
        <Box className="contentBox widthConstraint">
          {loading && <LoadingBackdrop open={true} />}
          {!loading && roomDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Adjusted marginTop value */}
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontStyle="italic"
                  marginTop={1}
                >
                  Top Suggestions
                </Typography>
                {/* Adjusted marginTop value */}
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontStyle="italic"
                  marginTop={0.5}
                >

                  Question: {roomDetails.question}

                </Typography>
              </Grid>
              <Grid item xs={12}>

                {roomDetails.voteOptions.map((option, index) => (
                  <div key={option._id}>
                    <Typography variant="body1">
                      <strong>{option.optionText}:</strong> {option.votes.length} votes
                    </Typography>
                  </div>
                ))}
              </Grid>
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
