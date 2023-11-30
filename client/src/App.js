// client/App.js

import "./styles/App.css";
import io from "socket.io-client";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Views/Login";
import Nickname from "./components/Views/nickname";
import Room from "./components/Views/Room";
import StartNewSession from "./components/Views/startNewSession";
import Lobby from "./components/Views/Lobby";

//Test Files
import Page1 from './components/Test/page1';
import Page2 from './components/Test/page2';
import Page3 from './components/Test/page3';

const socket = io.connect("http://localhost:3001");

// client/src/App.js

function App() {
  return (
    <>
      <head>
        <script
          src="https://unpkg.com/react/umd/react.production.min.js"
          crossorigin
        ></script>

        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
          crossorigin
        ></script>

        <script
          src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossorigin
        ></script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="style.css" crossorigin="anonymous" />
      </head>
      <body>
        <Router>
          <Routes>
            {/* Test Files */}
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />

            {/* Main Code */}
            <Route path="/" element={<Login />} />
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/room" element={<Room />} />
            <Route path="/Session" element={<StartNewSession />} />
            <Route path="/Lobby" element={<Lobby />} />
            
          </Routes>
        </Router>
      </body>
    </>
  );
}

export default App;
