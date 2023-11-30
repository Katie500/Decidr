// Page3.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Page3 = () => {
  const { state } = useLocation();
  const inputValue = state ? state.inputValue : '';

  return (
    <div>
      <h2>Page 3</h2>
      <p>User Input from Page1: {inputValue}</p>
    </div>
  );
};

export default Page3;