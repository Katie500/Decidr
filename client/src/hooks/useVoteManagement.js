import { useContext, useState } from "react";
import { addVoteToDb } from "../api/addVoteToDB";
import { removeVoteFromDb } from "../api/removeVoteFromDB";
import { UserContext } from "../contexts/UserContext";

const useVoteManagement = (roomDetails, setPending) => {
  const [votingOptions, setVotingOptions] = useState([]);
  const [userVoteCount, setUserVoteCount] = useState(0);
  const { userDetails } = useContext(UserContext);
  const userID = userDetails.userID;

  const submitUserVote = (optionID) => {
    return new Promise((resolve, reject) => {
      if (userVoteCount >= roomDetails.numberOfVotesPerUser) {
        reject("No more votes left");
        return;
      }

      setPending(true);
      addVoteToDb(roomDetails._id, optionID, userID)
        .then(() => {
          addVoteInState(userID, optionID); // Update state with the new vote
          setUserVoteCount((prevCount) => prevCount + 1);
          setPending(false);
          resolve();
        })
        .catch((error) => {
          setPending(false);
          reject(error);
        });
    });
  };

  const processIncomingVote = (incomingUserID, optionID) => {
    addVoteInState(incomingUserID, optionID); // Update state with the incoming vote
  };

  const addVoteInState = (voteUserID, optionID) => {
    setVotingOptions((prevOptions) =>
      prevOptions.map((option) =>
        option._id === optionID
          ? { ...option, votes: [...option.votes, voteUserID] }
          : option
      )
    );
  };

  // ====== END OF ADDING VOTES ====== //

  // ====== REMOVING VOTES ====== //
  const removeUserVote = (optionID) => {
    return new Promise((resolve, reject) => {
      if (
        !votingOptions.some(
          (option) => option._id === optionID && option.votes.includes(userID)
        )
      ) {
        reject("All votes removed");
        return;
      }

      setPending(true);
      removeVoteFromDb(roomDetails._id, optionID, userID)
        .then(() => {
          removeVoteFromState(userID, optionID); // Update state with the new vote
          setUserVoteCount((prevCount) => Math.max(0, prevCount - 1));
          setPending(false);
          resolve();
        })
        .catch((error) => {
          setPending(false);
          reject(error);
        });
    });
  };

  const processIncomingVoteRemoval = (incomingUserID, optionID) => {
    removeVoteFromState(incomingUserID, optionID); // Update state with the incoming vote removal
  };

  const removeVoteFromState = (userID, optionID) => {
    setVotingOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option._id === optionID) {
          // Find the index of the first occurrence of the user's vote
          const indexToRemove = option.votes.indexOf(userID);
          if (indexToRemove !== -1) {
            // Create a new array excluding the first occurrence of the user's vote
            return {
              ...option,
              votes: [
                ...option.votes.slice(0, indexToRemove),
                ...option.votes.slice(indexToRemove + 1),
              ],
            };
          }
        }
        return option;
      })
    );
  };

  // ====== END OF REMOVING VOTES ====== //

  return {
    votingOptions,
    setVotingOptions,
    submitUserVote,
    processIncomingVote,
    removeUserVote,
    processIncomingVoteRemoval,
    userVoteCount,
  };
};

export default useVoteManagement;
