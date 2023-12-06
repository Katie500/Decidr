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

const ResultPage = () => {
  const { userDetails } = useContext(UserContext);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <Box display="flex" justifyContent="center" alignItems="center" >
        <img
              src="/Decider-Logo-Only.jpg" 
              alt="Decidr JPG" 
              style={{ width: '100%', maxWidth: '250px', display: 'block', marginInlineStart: '35%' }}
              className='title'
            />
            
    </Box>
    <Box paddingTop={"10%"}>
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
          {loading && <LoadingBackdrop open={true} />}
          {!loading && roomDetails && (
            <Grid container spacing={2}>
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
                  Room ID: {roomDetails.roomID}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="center" paddingBottom={"15px"}>
                  <strong>Question:</strong> {roomDetails.question}
                </Typography>
                <Typography 
                  variant="h6"
                  fontsize = "1.1rem"
                  paddingLeft={"10%"}
                  >
                  <strong>Results:</strong>
                </Typography>
                {roomDetails.voteOptions.map((option, index) => (
                  <div key={option._id}>
                    <Typography 
                    variant="body1"
                    paddingLeft={"15%"} 
                    
                    >
                      <strong>{index + 1}: {option.optionText} </strong> 
                    </Typography>
                    <Typography 
                    variant="body1"
                    paddingLeft={"20%"}
                    paddingTop={"5px"}
                    paddingBottom={"5px"}
                    >
                        Votes: {option.votes.length}
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
    </Box>
    </>
  );
};


export default ResultPage;
