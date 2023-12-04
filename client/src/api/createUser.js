export const createUser = async (newUser) => {
  try {
    // Make a POST request to create a new user
    const response = await fetch('http://localhost:3001/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse._id;
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
