import LoginSignup from './Components/LoginSignup/LoginSignup';
import React from 'react';
import {BrowserRouter} from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Route path="/register" element={<LoginSignup/>} />
      </Router>
    </div>
  );
}

export default App;
