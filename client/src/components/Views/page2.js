import React from 'react';
import { useLocation } from 'react-router-dom';

const Page2 = () => {
  const { state } = useLocation();

  // Retrieve the inputValue from the state
  const inputValue = state ? state.inputValue : '';

  return (
    <div>
      <h2>Page 2</h2>
      <p>User Input: {inputValue}</p>
    </div>
  );
};

export default Page2;
