const createUser = async (newUser) => {
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
      console.log('User created successfully', response);
    } else {
      console.error('Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export default createUser;
