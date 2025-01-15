import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import logo_icon from "../Assets/logo-prototip3.png";
import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
    uloga: "Učenik",
  });

  const [error, setError] = useState(""); // Za čuvanje greške
  const [showNotification, setShowNotification] = useState(false); // Za vidljivost obavijesti

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const registerResponse = await axios.post(
        "http://localhost:8080/api/korisnici/register",
        formData
      );

      if (registerResponse.status === 200) {
        const userData = registerResponse.data;
        localStorage.setItem("token", userData.token);

        setUser((prev) => ({
          ...prev,
          id: userData.id,
          ime: userData.ime,
          prezime: userData.prezime,
          email: userData.email,
          uloga: userData.uloga,
        }));

        console.log("Trenutni korisnik: ", userData);

        const profileResponse = await axios.get(
          "http://localhost:8080/api/moj-profil",
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (profileResponse.status === 200) {
          navigate("/profile");
        }
      }
    } catch (error) {
      setError(
        error.response?.data ||
          "Došlo je do greške prilikom registracije ili dohvaćanja profila"
      );
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false); // Sakrij obavijest nakon 5 sekundi
      }, 5000);
    }
  };

  return (
    <div
      className="container"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleRegister();
        }
      }}
    >
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
      
      {/* Oblak za obavijesti */}
      {error && (
        <div id="notification" className={`filter-notification ${showNotification ? 'show' : ''}`}>
          {error}
        </div>
      )}

      <div className="header">
        <button
          className="teacher-button"
          onClick={() => navigate("/teachers")}
        >
          Prikaz učitelja
        </button>
        <div className="text">Registracija</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="odabir">
          <label>
            <input
              type="radio"
              name="uloga"
              value="Učenik"
              checked={formData.uloga === "Učenik"}
              onChange={handleInputChange}
            />{" "}
            Učenik
          </label>
          <label>
            <input
              type="radio"
              name="uloga"
              value="Učitelj"
              checked={formData.uloga === "Učitelj"}
              onChange={handleInputChange}
            />{" "}
            Učitelj
          </label>
        </div>
        <div className="input">
          <img src={user_icon} alt="User Icon" />
          <input
            type="text"
            name="ime"
            placeholder="Ime korisnika"
            value={formData.ime}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={user_icon} alt="User Icon" />
          <input
            type="text"
            name="prezime"
            placeholder="Prezime korisnika"
            value={formData.prezime}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input
            type="email"
            name="email"
            placeholder="E-mail adresa"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input
            type="password"
            name="lozinka"
            placeholder="Lozinka"
            value={formData.lozinka}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleRegister}>
          Registriraj se
        </div>
      </div>
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
            Registracija
          </a>
        </div>
      </div>
      <div className="ima_racun" onClick={() => navigate("/login")}>
        Imaš račun? <span>Prijavi se!</span>
      </div>
    </div>
  );
};

export default LoginRegister;
