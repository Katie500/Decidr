// NotificationContext.js
import React, { createContext, useContext, useState } from "react";
import CustomSnackbar from "../components/global/CustomSnackbar";

export const notificationColors = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  PRIMARY: "primary",
  SECONDARY: "secondary",
};

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: "", color: "" });

  /**
   *
   * @param {*} color Primary, Secondary, Success, Error, Warning, Info
   */
  const displayNotification = (message, color) => {
    if (message === notification.message) {
      // Reset the snackbar message to ensure the new message triggers the Snackbar
      setNotification(null);
      setTimeout(() => {
        setNotification({ message, color });
      }, 50); // A short delay to ensure the state is reset before setting the new message
    } else {
      setNotification({ message, color });
    }
  };

  return (
    <NotificationContext.Provider value={{ notification, displayNotification }}>
      {children}
      <CustomSnackbar
        message={notification?.message || ""}
        color={notification?.color || ""}
      />
    </NotificationContext.Provider>
  );
};
