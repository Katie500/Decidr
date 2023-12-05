import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    userID: '',
    nickname: '',
    roomID: '',
    profilePicture: '',
    isAdmin: false,
  });

  const updateUserDetails = (details) => {
    setUserDetails((prevDetails) => ({ ...prevDetails, ...details }));
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
