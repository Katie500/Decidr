import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Page1 = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const navigateToPage2 = () => {
    // Use navigate to go to Page2 and pass the inputValue as state
    navigate('/page2', { state: { inputValue } });
  };

  return (
    <div>
      <h2>Page 1</h2>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={navigateToPage2}>Go to Page 2</button>
    </div>
  );
};

export default Page1;
