import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import LoadingBackdrop from "../../components/global/LoadingBackdrop";
import { UserContext } from "../../contexts/UserContext";
import AddNewOptionModal from "./NewOptionModal";
import "./RoomPage.css";
import { getRoomDetails } from "../../api/getRoomDetails";
import { useNavigate } from "react-router-dom";
import EventLog from "./EventLog";
import { addNewOptionToDB } from "../../api/addNewOptionToDB";
import VotingOptionsList from "./VotingOptionsList";
import RoomHeader from "./RoomHeader";
import useVoteManagement from "../../hooks/useVoteManagement";
import useBroadcast, { broadcastingEventTypes } from "../../hooks/useBroadcast";
import {
  notificationColors,
  useNotification,
} from "../../contexts/NotificationContext";

const views = {
  VOTING: "VOTING",
  EVENT: "EVENT",
};

const Room = () => {
  const [pending, setPending] = useState(true);
  // const [votionOptions, setVotingOptions] = useState([]);
  const [users, setUsers] = useState([]); // users state
  const [openNewOption, setOpenNewOption] = useState(false); // Modal state
  const [newOptionText, setNewOptionText] = useState("");
  const [eventLog, setEventLog] = useState([]);
  const { userDetails } = useContext(UserContext);

  const [view, setView] = useState(views.VOTING); // View state
  const userID = userDetails.userID;
  const username = userDetails.nickname;

  const navigate = useNavigate();
  const hideDesktopDrawer = useMediaQuery((theme) =>
    theme.breakpoints.down("md")
  );
  const [roomDetails, setRoomDetails] = useState({
    roomID: "",
    question: "",
    ownerUserID: "",
    numberOfVotesPerUser: 3,
    endTime: "",
  });

  const { displayNotification } = useNotification();

  const voteManagement = useVoteManagement(roomDetails, setPending);
  // addNewOption needs to be declared here because it needs to be passed to useBroadcast
  const addNewOption = (optionText, newOptionID) => {
    voteManagement.setVotingOptions((prevOptions) => [
      { _id: newOptionID, optionText: optionText, votes: [] },
      ...prevOptions,
    ]);
  };
  const { sendBroadcast } = useBroadcast(
    voteManagement.processIncomingVote,
    voteManagement.processIncomingVoteRemoval,
    setUsers,
    addNewOption,
    setEventLog
  );

  const [localRoomID, setLocalRoomID] = useState(null);
  const sessionCancelled = false;

  const sendUserConnectedBroadcast = () => {
    sendBroadcast(
      broadcastingEventTypes.USER_CONNECTED,
      { userID, username, avatar: userDetails.profilePicture },
      `${username} has ${userDetails.isAdmin ? "created" : "joined"} the room`,
      userDetails.profilePicture // Include the avatar in the broadcast
    );
  };

  useEffect(() => {
    if (userDetails.roomID !== localRoomID) {
      fetchRoomDetails();
      setLocalRoomID(userDetails.roomID);
      sendUserConnectedBroadcast();
    }
  }, [userDetails.roomID]); // Only re-run effect if userDetails.roomID

  const fetchRoomDetails = async () => {
    try {
      if (!userDetails.roomID) {
        navigate("/");
        alert("Room ID not found. Please try again.");
        return;
      }
      if (!userDetails.userID) {
        navigate("/");
        alert("User ID not found. Please try again.");
        return;
      }
      const { roomDetails, users } = await getRoomDetails(userDetails.roomID);
      setRoomDetails({ ...roomDetails, numberOfVotesPerUser: 3 });
      voteManagement.setVotingOptions(roomDetails.voteOptions || []);
      setUsers(users);
      setPending(false);
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    }
  };

  const closeNewOptionModal = () => {
    setOpenNewOption(false);
  };

  const handleAddVote = async (optionID) => {
    try {
      await voteManagement.submitUserVote(optionID);

      // BROADCAST THE VOTE:
      const optionText = voteManagement.votingOptions.find(
        (opt) => opt._id === optionID
      )?.optionText;
      sendBroadcast(
        broadcastingEventTypes.ADD_VOTE,
        { userID, optionID },
        `${username} voted for ${optionText}`
      );
    } catch (error) {
      console.error("Error in voting:", error);
      displayNotification(error, notificationColors.WARNING);
    }
  };

  const handleRemoveVote = async (optionID) => {
    try {
      await voteManagement.removeUserVote(optionID);

      // BROADCAST vote removal
      const optionText = voteManagement.votingOptions.find(
        (opt) => opt._id === optionID
      )?.optionText;
      sendBroadcast(
        broadcastingEventTypes.REMOVE_VOTE,
        { userID, optionID },
        `${username} unvoted for ${optionText}`
      );
    } catch (error) {
      console.error("Error in removing vote:", error);
      displayNotification(error, notificationColors.WARNING);
    }
  };

  // ====== ADDING NEW OPTION ====== //
  const handleAddNewOption = async () => {
    if (!newOptionText) {
      setOpenNewOption(false);
      return;
    }

    // votingOptionID SHOULD COME FROM THE DATABASE
    setPending(true);
    const newOptionID = await addNewOptionToDB(newOptionText, roomDetails._id);

    setPending(false);
    addNewOption(newOptionText, newOptionID);
    setNewOptionText("");
    setOpenNewOption(false);

    // BROADCAST THE NEW OPTION:
    const eventMessage = `${username} added a new option: ${newOptionText}`;
    sendBroadcast(
      broadcastingEventTypes.ADD_OPTION,
      {
        optionText: newOptionText,
        optionID: newOptionID,
      },
      eventMessage
    );
  };
  // ====== END OF ADDING NEW OPTION ====== //

  return (
    <>
      {sessionCancelled && (
        // We can fix closing a room(session) later
        <Typography variant="h4" align="center">
          Session has been cancelled.
        </Typography>
      )}
      {!sessionCancelled && (
        <>
          <Grid
            className="container roomWrapper"
            sx={{
              marginLeft: hideDesktopDrawer ? "0px" : "240px",
            }}
          >
            <Box className="widthConstraint contentBox">
              <RoomHeader
                sessionCancelled={sessionCancelled}
                roomDetails={roomDetails}
                users={users}
                view={view}
                setView={setView}
                userDetails={userDetails}
                handleCancelSession={() => console.log("Session cancelled!")}
                hideDesktopDrawer={hideDesktopDrawer}
              />
              <Box
                style={{
                  flexGrow: 1,
                  overflowY: "scroll",
                }}
              >
                {view === views.VOTING && (
                  <VotingOptionsList
                    votionOptions={voteManagement.votingOptions}
                    totalAvailableVotes={
                      users.length * roomDetails.numberOfVotesPerUser
                    }
                    handleAddVote={handleAddVote}
                    handleRemoveVote={handleRemoveVote}
                    handleAddOption={() => setOpenNewOption(true)}
                  />
                )}
                {view === views.EVENT && (
                  <EventLog logs={eventLog} userID={userID} />
                )}
              </Box>
              <Box className="footerBox">
                <Typography variant="h6" fontStyle={"italic"}>
                  You have{" "}
                  {roomDetails.numberOfVotesPerUser -
                    voteManagement.userVoteCount}
                  /{roomDetails.numberOfVotesPerUser} votes left.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenNewOption(true)}
                >
                  New Voting Option
                </Button>
              </Box>
            </Box>
          </Grid>
        </>
      )}

      <AddNewOptionModal
        open={openNewOption}
        handleAdd={handleAddNewOption}
        handleClose={closeNewOptionModal}
        newOptionText={newOptionText}
        setNewOptionText={setNewOptionText}
      />
      <LoadingBackdrop open={pending} />
    </>
  );
};

export default Room;
