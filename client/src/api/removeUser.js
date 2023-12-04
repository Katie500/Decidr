const removeUser = async (userId) => {
    try {
      // Make a DELETE request to remove a user by ID
      const response = await fetch(`http://localhost:3001/removeUser/${userId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('User removed successfully');
      } else {
        console.error(
          'Failed to remove user:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };
  
  export default removeUser;
  