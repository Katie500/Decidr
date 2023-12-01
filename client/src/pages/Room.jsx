import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import LoadingBackdrop from '../components/global/LoadingBackdrop';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Room = ({}) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const { userDetails, updateUserDetails } = useContext(UserContext);

  // State to manage choices and votes
  const [choices, setChoices] = useState([
    { id: 1, text: "Choice 1", votes: 0 },
    { id: 2, text: "Choice 2", votes: 0 },
  ]);

  const [newChoiceText, setNewChoiceText] = useState("");

  const handleVote = (choiceId) => {
    setChoices((prevChoices) =>
      prevChoices.map((choice) =>
        choice.id === choiceId ? { ...choice, votes: choice.votes + 1 } : choice
      )
    );
  };

  const renderChoices = () => {
    return choices.map((choice) => (
      <div key={choice.id} className="pad-bottom centered">
        <div xs="auto">
          <p>{choice.text}</p>
        </div>
        <div xs="auto">
          <button onClick={() => handleVote(choice.id)}>Vote</button>
        </div>
        <div xs="auto">
          <p>Votes: {choice.votes}</p>
        </div>
      </div>
    ));
  };

  const handleAddChoice = () => {
    const newChoiceId = choices.length + 1;
    const newChoice = { id: newChoiceId, text: newChoiceText, votes: 0 };
    setChoices([...choices, newChoice]);
    setNewChoiceText(""); // Clear the input field after adding a choice
  };

    //Navigates back to the login page.  
    const navigateBack = () => {
      navigate('/');
    };


  return (
    <>
      <Box className="topBarContainer">
        <Box container className="topBar widthConstraint">
          <IconButton className="topBarIcon">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            In room{' '}
            <span style={{ textTransform: 'uppercase' }}>
              {userDetails.roomID}
            </span>
          </Typography>
        </Box>
      </Box>


      <Box className="container">
      <div>
          <h4>Vote on Choices</h4>
      </div>
      
      {renderChoices()}
      <div>
        <div>
          <div
            type="text"
            placeholder="Enter new choice"
            className="mr-sm-2"
            value={newChoiceText}
            onChange={(event) => setNewChoiceText(event.target.value)}
          />
        </div>
        <div>
          <button onClick={handleAddChoice}>Add Choice</button>
        </div>
      </div>
      <div className="pad-bottom centered">
        <div>
          <button onClick={navigateBack}>Back to Login</button>
        </div>
      </div>
      </Box>


      <LoadingBackdrop open={pending} />



    </>
  );
};

export default Room;
