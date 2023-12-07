export const getRoomDetails = async (roomID) => {
  try {
    const response = await fetch(
      `http://localhost:3001/getRoomDetails?roomID=${roomID}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      console.error(
        "Failed to verify room:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error verifying room:", error);
  }
};
