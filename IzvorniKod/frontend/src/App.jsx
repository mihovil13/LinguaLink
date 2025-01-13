import LoginSignup from "./Components/LoginSignup/LoginSignup";
import LoginRegister from "./Components/LoginSignup/LoginRegister";
import ProfilePage from "./Components/Profile/ProfilePage";
import TeacherList from "./Components/TeacherList/TeacherList";
import HomePage from "./Components/HomePage/HomePage";
import TeacherProfile from "./Components/TeacherProfile/TeacherProfile"
import Calendar from "./Components/Calendar/Calendar";
import React from "react";
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
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/teacher/:teacherId" element={<TeacherProfile/>} />
            <Route path="/calendar" element={<Calendar/>} />

          </Routes>
        </Router>
      </div>
  );
}

export default App;
