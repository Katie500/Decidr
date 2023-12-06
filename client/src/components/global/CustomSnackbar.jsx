import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useMediaQuery } from "@mui/material";
import { drawerWidth } from "../../pages/Room/RoomHeader";

export default function CustomSnackbar({ message, color }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      sx={{
        marginTop: "1rem",
        marginLeft: isDesktop ? "0px" : `${drawerWidth / 2}px`,
      }}
    >
      <Button
        variant="contained"
        color={color || "primary"}
        sx={{ maxWidth: "300px" }}
      >
        {message}
      </Button>
    </Snackbar>
  );
}
