export const addNewOptionToDB = async (newOptionText, roomObjectID) => {
  try {
    // Make a POST request to add a new option
    const response = await fetch(`http://localhost:3001/addNewOption`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newOptionText, roomObjectID }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.optionID;
    } else {
      console.error(
        "Failed to add new option:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error adding new option:", error);
  }
};
