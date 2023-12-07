import React, { useContext, useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IconButton, useMediaQuery, Modal } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { UserContext } from "../../contexts/UserContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { broadcastingEventTypes } from "../../hooks/useBroadcast";
import SelectAvatarMenu from "./SelectAvatarMenu";

import { useNavigate } from "react-router-dom";

export default function CustomDrawer({
  open,
  setDrawerOpen,
  drawerWidth,
  users,
  profileName,
  sendBroadcast,
  adminID,
}) {
  const [profilePictures, setProfilePictures] = useState({});
  const { userDetails, updateUserDetails } = useContext(UserContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    // Update the drawer state based on screen size and passed `open` prop
    if (isMobile) {
      setDrawerOpen(open);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile, open]);

//------------------------ changing picture content ------------------//

//==================== profile picture algorithm ================//
const [profilePicture, setProfilePicture] = useState("");
const [isModalOpen, setModalOpen] = useState(false);

useEffect(() => {
  if (userDetails?.profilePicture) {
    setProfilePicture(userDetails.profilePicture);
  }
}, [userDetails]);

const changeProfilePicture = async () => {
  try {
    // Make a request to your backend API to update the user's profile picture
    const response = await fetch(
      `http://localhost:3001/users/${userDetails.userID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilePicture: profilePicture,
        }),
      }
    );

    // Close the modal when the Apply button is clicked
    setModalOpen(false);
    if (response.ok) {
      // Update the user details in the context or state on success
      updateUserDetails({
        profilePicture: profilePicture,
      });
    } else {
      console.error("Failed to update profile picture:", response.status);
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
  }
};


  const handleCancelSession = () => {
    sendBroadcast(
      broadcastingEventTypes.SESSION_CANCELLED,
      { userID: userDetails.userID, username: userDetails.nickname },
      `${userDetails.nickname}(admin) cancelled the session`
    );
    navigate("/");
  };
  const handleFinishSession = () => {
    sendBroadcast(
      broadcastingEventTypes.SESSION_FINISHED,
      { userID: userDetails.userID, username: userDetails.nickname },
      `${userDetails.nickname}(admin) finished the session early.`
    );
    navigate("/resultPage");
  };

  const fetchProfilePicture = async (url, userID) => {
    // Check if image is cached
    const cachedImage = localStorage.getItem(`profilePicture-${userID}`);
    if (cachedImage) {
      return cachedImage; // Return cached image if available
    }

    // Fetch image if not cached
    const response = await fetch(url);
    if (response.ok) {
      const svgText = await response.text();
      const base64 = btoa(svgText);
      localStorage.setItem(`profilePicture-${userID}`, base64); // Cache the image
      return base64;
    } else {
      console.error("Failed to fetch SVG:", response.status);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllProfilePictures = async () => {
      const pictures = {};
      for (const user of users) {
        if (user.profilePicture) {
          const base64Image = await fetchProfilePicture(
            user.profilePicture,
            user._id
          );
          pictures[user._id] = base64Image;
        }
      }
      setProfilePictures(pictures);
    };

    fetchAllProfilePictures();
  }, [users]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setDrawerOpen(false)}
        anchor="left"
      >
        <Toolbar>


          <IconButton onClick={() => setModalOpen(true)}>
            {profilePictures[userDetails.userID] ? (
              <img
                src={`data:image/svg+xml;base64,${
                  profilePictures[userDetails.userID]
                }`}
                alt="Profile Picture"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                onError={(e) => console.error("Error loading image:", e)}
              />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
              <Box>
                <SelectAvatarMenu
                  onSelectAvatar={(selectedAvatar) => {
                    setProfilePicture(selectedAvatar);
                    console.log("Avatar set in Drawer Page:", selectedAvatar);
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => changeProfilePicture()}
                >
                  Apply
                </Button>
              </Box>
            </Modal>



          <Typography noWrap component="div">
            {profileName}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem key={-1} disablePadding>
            <ListItemButton>
              <ListItemText primary={"User List:"} />
            </ListItemButton>
          </ListItem>
          {users?.map((user, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {profilePictures[userDetails.userID] ? (
                    <img
                      src={`data:image/svg+xml;base64,${
                        profilePictures[user._id]
                      }`}
                      alt="Profile Picture"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      onError={(e) => console.error("Error loading image:", e)}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${user.username} ${
                    user._id === adminID ? "(admin)" : ""
                  }`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {adminID === userDetails.userID && (
          <>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleFinishSession}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: "orange" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Finish session now"} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleCancelSession}>
                  <ListItemIcon>
                    <CancelIcon sx={{ color: "red" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Cancel session"} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </Box>
  );
}
