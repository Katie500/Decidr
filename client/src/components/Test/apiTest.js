import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ApiTest = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    roomID: '',
    isAdmin: false,
    username: '',
  });
  const navigate = useNavigate();

  //TEST FOR GET
  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  //TEST FOR POST
  const handleCreateUser = async () => {
    try {
      // Make a POST request to create a new user
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log('User created successfully');
        // Fetch the updated user list after creating a new user
        const updatedUser = await response.json();
        setUsers([...users, updatedUser]);
        // Reset the form
        setNewUser({ roomID: '', username: '' });
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
            User ID: {user._id}, Room ID: {user.roomID}, isAdmin: {user.isAdmin.toString()}, Username: {user.username}
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
          Username:
          <input
            type="text"
            name="username"
            placeholder="Enter username here"
            value={newUser.username}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <br />
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
};

export default ApiTest;
