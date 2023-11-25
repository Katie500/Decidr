// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Index from './components/Index';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:roomName" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
