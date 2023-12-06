// Bubble.js
import React, { useState, useEffect } from 'react';
import './Bubbles.css';

const Bubble = ({ initialX, initialY }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [velocity, setVelocity] = useState({ x: Math.random() - 0.5, y: Math.random() - 0.5 });

  useEffect(() => {
    const updatePosition = () => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y,
      }));
    };

    const handleBoundaryCollision = () => {
      if (position.x < 0 || position.x > window.innerWidth) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, x: -prevVelocity.x }));
      }

      if (position.y < 0 || position.y > window.innerHeight) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, y: -prevVelocity.y }));
      }
    };

    const update = () => {
      updatePosition();
      handleBoundaryCollision();
    };

    const animationId = requestAnimationFrame(function animate() {
      update();
      animationId.current = requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId.current);
  }, [position, velocity]);

  return <div className="bubble" style={{ left: position.x, top: position.y }} />;
};

export default Bubble;
