export const verifyRoom = async (roomID) => {
  try {
    const response = await fetch(
      `http://localhost:3001/verifyRoom?roomID=${roomID}`,
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.isActive;
    } else {
      console.error(
        'Failed to verify room:',
        response.status,
        response.statusText
      );
      const errorResponse = await response.text();
      console.error('Error details:', errorResponse);
    }
  } catch (error) {
    console.error('Error verifying room:', error);
  }
};
