// Assuming you are using fetch for API requests

const updateUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/user/updateProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        return updatedUser;
      } else {
        console.error(
          'Failed to update user profile:',
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  };
  
  export default updateUser;
  