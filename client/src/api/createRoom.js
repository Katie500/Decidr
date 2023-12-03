// const { roomID, socketID, username, question, endTime } = req.body;
export const createRoom = async (roomDetails) => {
  try {
    const response = await fetch('http://localhost:3001/createUserAndRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomDetails),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('User created successfully', jsonResponse);
      return jsonResponse.userID;
    } else {
      console.error(
        'Failed to create user:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
