// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./components/Index";
import Room from "./components/Room";
import Test from "./test";

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
      </head>
      <body>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:roomName" element={<Room />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </body>
    </>
  );
}

export default App;
