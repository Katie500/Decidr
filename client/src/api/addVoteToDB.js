export const addVoteToDb = async (roomID, voteOptionID, userID) => {
  try {
    // Construct the query parameters
    const queryParams = new URLSearchParams({
      roomID,
      voteOptionID,
      userID,
    }).toString();

    // Make a PUT request to add a vote
    const response = await fetch(
      `http://localhost:3001/addVote?${queryParams}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Vote added successfully:', jsonResponse);
      return jsonResponse; // or return a specific part of the response as needed
    } else {
      console.error(
        'Failed to add vote:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error adding vote:', error);
  }
};
