import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Page2 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Retrieve the inputValue from the state
  const inputValue = state ? state.inputValue : '';

  const navigateToPage3 = () => {
    // Use navigate to go to Page3 and pass the inputValue as state
    navigate('/page3', { state: { inputValue } });
  };

  return (
    <div>
      <h2>Page 2</h2>
      <p>User Input: {inputValue}</p>
      <button onClick={navigateToPage3}>Go to Page 3</button>
    </div>
  );
};

export default Page2;