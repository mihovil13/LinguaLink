import LoginSignup from "./Components/LoginSignup/LoginSignup";
import LoginRegister from "./Components/LoginSignup/LoginRegister";
import ProfilePage from "./Components/Profile/ProfilePage";
import TeacherList from "./Components/TeacherList/TeacherList";
import UserList from "./Components/UserList/UserList";
import HomePage from "./Components/HomePage/HomePage";
import TeacherProfile from "./Components/TeacherProfile/TeacherProfile";
import Calendar from "./Components/Calendar/Calendar";
import RequestList from "./Components/RequestList/RequestList";
import { UserProvider } from "./UserContext";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/register" element={<LoginRegister />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/teacher/:teacherId" element={<TeacherProfile />} />
            <Route path="/calendar/:teacherId" element={<Calendar />} />
            <Route path="/requests/:user_id" element={<RequestList />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
