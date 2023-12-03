const addNewOption = async (newOptionText, roomID) => {
    try {
      // Make a POST request to add a new option
      const response = await fetch(`http://localhost:3001/addNewOption`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newOptionText, roomID }),
      });
  
      if (response.ok) {
        console.log('New option added successfully');
      } else {
        console.error(
          'Failed to add new option:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error adding new option:', error);
    }
  };
  
  export default addNewOption;
  