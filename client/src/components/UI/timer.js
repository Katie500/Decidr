import { useEffect, useState } from "react";

//boiler plate code from chatgpt
const Timer = () => {
  const [time, setTime] = useState(300); // time in time

  //decrements by 1 second every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once on mount

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div>
      <p>
        Time Left: {minutes}:{seconds}
      </p>
    </div>
  );
};

export default Timer;
