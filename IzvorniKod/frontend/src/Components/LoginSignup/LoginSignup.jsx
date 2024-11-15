import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const navigate = useNavigate(); //za preusmjeravanje na login page
  const [loginData, setLoginData] = useState({
    email: "",
    lozinka: "",
  }); //pocetno incijaliziramo email i lozinku na prazne stringove

  const handleInputChange = (e) => {
    const name = e.target.name; //ime dom objekta kojeg mijenjamo
    const value = e.target.value; //nova vrijednost objekta

    //azuriramo podatke
    if (name === "email") {
      setLoginData({ email: value, lozinka: loginData.lozinka });
    } else if (name === "lozinka") {
      setLoginData({ email: loginData.email, lozinka: value });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://lingualinkbackend.onrender.com/api/korisnici/login",
        loginData
      );

      if (response.status === 200) {
        const token = response.data.token; //dohvacamo token i spremamo ga
        localStorage.setItem("token", token);

        const profileResponse = await axios.get(
          "https://lingualinkbackend.onrender.com/api/moj-profil",
          {
            //slanje get zahtjeva prema backendu
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, //u headerima saljemo token
            },
          }
        );

        if (profileResponse.status === 200) {
          // alert(profileResponse.data);
          navigate("/profile");
        }
      }
    } catch (error) {
      alert(error.response?.data || "Došlo je do greške prilikom prijave");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="teacher-button" onClick={() => navigate("/teachers")}>Prikaz Učitelja</button>
        <div className="text">Prijava</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input
            type="email"
            name="email"
            placeholder="E-mail adresa"
            value={loginData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input
            type="password"
            name="lozinka"
            placeholder="Lozinka"
            value={loginData.lozinka}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="forgot-password">
        Zaboravljena lozinka? <span>Postavi novu lozinku</span>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          Prijavi se
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
