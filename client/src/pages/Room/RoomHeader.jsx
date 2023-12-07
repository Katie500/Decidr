import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CustomDrawer from "./Drawer";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./RoomPage.css";
import {
  notificationColors,
  useNotification,
} from "../../contexts/NotificationContext";

const views = {
  VOTING: "VOTING",
  EVENT: "EVENT",
  CHART: "CHART",
};
export const drawerWidth = 240;

const Timer = ({ endTime, onTimeEnd }) => {
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0);

  useEffect(() => {
    setRemainingTimeInSeconds(calculateRemainingTimeInSeconds(endTime));
    const interval = setInterval(() => {
      setRemainingTimeInSeconds((prevTime) => {
        const updatedTime = prevTime > 0 ? prevTime - 1 : 0;

        if (updatedTime === 0 && onTimeEnd) {
          onTimeEnd();
        }
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const calculateRemainingTimeInSeconds = (endTime) => {
    const now = dayjs();
    const end = dayjs(endTime);
    return Math.max(end.diff(now, "second"), 0);
  };

  const minutes = Math.floor(remainingTimeInSeconds / 60);
  const seconds = remainingTimeInSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return (
    <span style={{ fontWeight: "bold", color: "red" }}>
      {paddedMinutes}:{paddedSeconds}
    </span>
  );
};

const RoomHeader = ({
  users,
  roomDetails,
  userDetails,
  view,
  sendBroadcast,
  setView,
  hideDesktopDrawer,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state

  const navigate = useNavigate();
  const { displayNotification } = useNotification();

  const onTimeEnd = () => {
    navigate("/resultpage");
    displayNotification("Voting has ended!", notificationColors.INFO);
  };

  return (
    <>
      <CustomDrawer
        drawerWidth={drawerWidth}
        open={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        sendBroadcast={sendBroadcast}
        profileName={userDetails.nickname || "ERROR IN ROOM HEADER"}
        users={users}
        adminID={roomDetails.adminUserID}
      />
      <Box className="headerBox">
        <IconButton
          className="menuIcon"
          onClick={() => setDrawerOpen(true)}
          disabled={!hideDesktopDrawer} // ONLY SHOW HAMBURGER ON MOBILE
        >
          <MenuIcon />
        </IconButton>

        <Typography>
          Room:
          <span style={{ textTransform: "uppercase", fontStyle: "italic" }}>
            {userDetails.roomID || "ERROR"}
          </span>
        </Typography>
        <Typography className="timeText">
          <Timer endTime={roomDetails.endTime} onTimeEnd={onTimeEnd} />
        </Typography>
      </Box>
      <Typography
        variant="h5"
        fontStyle={"italic"}
        textAlign={"center"}
        paddingTop={"0.5rem"}
      >
        {roomDetails.question}
      </Typography>
      <Box
        style={{
          display: "flex",
          padding: "1rem",
          gap: "0.5rem",
          justifyContent: "center",
        }}
      >
        <Button
          variant={view === views.VOTING ? "contained" : "outlined"}
          size="small"
          color="success"
          fullWidth
          onClick={() => setView(views.VOTING)}
        >
          Voting
        </Button>
        <Button
          variant={view === views.CHART ? "contained" : "outlined"}
          size="small"
          color="success"
          fullWidth
          onClick={() => setView(views.CHART)}
        >
          Chart
        </Button>
        <Button
          variant={view === views.EVENT ? "contained" : "outlined"}
          size="small"
          color="success"
          fullWidth
          onClick={() => setView(views.EVENT)}
        >
          Event Log
        </Button>
      </Box>
    </>
  );
};

export default RoomHeader;
