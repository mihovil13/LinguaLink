import LoginSignup from "./Components/LoginSignup/LoginSignup";
import LoginRegister from "./Components/LoginSignup/LoginRegister";
import ProfilePage from "./Components/Profile/ProfilePage";
import TeacherList from "./Components/TeacherList/TeacherList";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/teachers" element = {<TeacherList/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
