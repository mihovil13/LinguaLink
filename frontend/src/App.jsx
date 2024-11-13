import LoginSignup from "./Components/LoginSignup/LoginSignup";
import LoginRegister from "./Components/LoginSignup/LoginRegister";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./Components/Profile/ProfilePage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/" element={<LoginRegister />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
