import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import logo_icon from "../Assets/logo-prototip3.png";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend = "http://localhost:8080";

const LoginSignup = () => {
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate(); // za preusmjeravanje na login page
  const [loginData, setLoginData] = useState({
    email: "",
    lozinka: "",
  }); // početno inicijaliziramo email i lozinku na prazne stringove

  const handleInputChange = (e) => {
    const name = e.target.name; // ime dom objekta kojeg mijenjamo
    const value = e.target.value; // nova vrijednost objekta

    // ažuriramo podatke
    if (name === "email") {
      setLoginData({ email: value, lozinka: loginData.lozinka });
    } else if (name === "lozinka") {
      setLoginData({ email: loginData.email, lozinka: value });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${backend}/api/korisnici/login`,
        loginData
      );

      if (response.status === 200) {
        const token = response.data.token; // dohvaćamo token i spremamo ga
        localStorage.setItem("token", token);

        // const adminResponse = awawit axios.get(`${backend}/api`)
        const profileResponse = await axios.get(`${backend}/api/moj-profil`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (profileResponse.status === 200) {
          const role = profileResponse.data.uloga;
          if (role === "Admin") {
            navigate("/teachers");
          } else {
            navigate("/profile");
          }
        }
      }
    } catch (error) {
      setError(error.response?.data || "Došlo je do greške prilikom prijave");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="container">
      {error && (
        <div
          id="notification"
          className={`filter-notification ${showNotification ? "show" : ""}`}
        >
          {error}
        </div>
      )}
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
      <div className="header">
        <button
          className="teacher-button"
          onClick={() => navigate("/teachers")}
        >
          Prikaz učitelja
        </button>
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
      {/* Dodajemo OAuth2 prijavu putem GitHub-a */}
      <div className="submit-container">
        <div className="submit">
          <a
            href="http://localhost:8080/oauth2/authorization/github"
            className="oauth2-btn2"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
              className="github-avatar"
            />
            Prijava
          </a>
        </div>
      </div>

      <div className="ima_racun" onClick={() => navigate("/register")}>
        Nemaš račun? <span>Registriraj se!</span>
      </div>
    </div>
  );
};

export default LoginSignup;
