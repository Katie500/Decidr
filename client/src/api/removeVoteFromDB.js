export const removeVoteFromDb = async (roomID, voteOptionID, userID) => {
  try {
    const queryParams = new URLSearchParams({
      roomID,
      voteOptionID,
      userID,
    }).toString();
    const response = await fetch(
      `http://localhost:3001/removeVote?${queryParams}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Vote removed successfully:', jsonResponse);
      return jsonResponse;
    } else {
      console.error(
        'Failed to remove vote:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error removing vote:', error);
  }
};
