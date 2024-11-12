import LoginSignup from "./Components/LoginSignup/LoginSignup";
import LoginRegister from "./Components/LoginSignup/LoginRegister";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/" element={<LoginRegister />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
