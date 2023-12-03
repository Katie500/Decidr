import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectAvatarMenu from './SelectAvatarMenu'; // Import the SelectAvatarMenu component


const ApiTest = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    roomID: '',
    socketID: '',
    username: '',
    profilePicture: '',
  });
  const navigate = useNavigate();

  // TEST FOR GET
  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

    // Function to handle the selection of profile picture
  // Function to handle the selection of profile picture
  const handleProfilePictureSelect = (selectedAvatarUrl) => {
    setNewUser((prevUser) => ({ ...prevUser, profilePicture: selectedAvatarUrl }));
  };

  const handleCreateUser = async () => {
    try {
      // Use a placeholder value if socketID is not available
      const placeholderSocketID = 'placeholder-socket-id';
  
      // Make a POST request to create a new user
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          socketID: newUser.socketID || placeholderSocketID,
          profilePicture: newUser.profilePicture,
        }),
      });
  
      if (response.ok) {
        console.log('User created successfully');
        // Fetch the updated user list after creating a new user
        const updatedUser = await response.json();
        setUsers([...users, updatedUser]);
        // Reset the form
        setNewUser({
          roomID: '',
          socketID: '',
          username: '',
          profilePicture: '',
        });
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            User ID: {user._id}, Room ID: {user.roomID}, Socket ID: {user.socketID}, Username: {user.username}, Profile Picture: {user.profilePicture}
          </li>
        ))}
      </ul>

      <h2>Enter new user information for the database here:</h2>

      {/* Input fields for creating a new user */}
      <div className="input-row">
        <label>
          Room ID:
          <input
            type="text"
            name="roomID"
            placeholder="Enter room ID here"
            value={newUser.roomID}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Socket ID:
          <input
            type="text"
            name="socketID"
            placeholder="Enter socket ID here"
            value={newUser.socketID}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Username:
          <input
            type="text"
            name="username"
            placeholder="Enter username here"
            value={newUser.username}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />

          Profile Picture:
        {/* Render the SelectAvatarMenu component */}
        <SelectAvatarMenu onSelect={handleProfilePictureSelect} />
      </div>
      <br />
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
};

//Fetch the api URL and display its image here

export default ApiTest;
