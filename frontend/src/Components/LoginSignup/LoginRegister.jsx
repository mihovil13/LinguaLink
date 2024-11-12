import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const navigate = useNavigate(); //za preusmjeravanje na login page
  const [formData, setFormData] = useState({
    ime: "",
    email: "",
    lozinka: "",
    uloga: "Učenik",
  });

  const handleInputChange = (e) => {
    const name = e.target.name; //ime objekta kojeg korisnik mijenja
    const value = e.target.value; // vrijednost koju korisnik unosi

    // azuriranje podataka
    if (name === "ime") {
      setFormData({
        ime: value,
        email: formData.email,
        lozinka: formData.lozinka,
        uloga: formData.uloga,
      });
    } else if (name === "email") {
      setFormData({
        ime: formData.ime,
        email: value,
        lozinka: formData.lozinka,
        uloga: formData.uloga,
      });
    } else if (name === "lozinka") {
      setFormData({
        ime: formData.ime,
        email: formData.email,
        lozinka: value,
        uloga: formData.uloga,
      });
    } else if (name === "uloga") {
      setFormData({
        ime: formData.ime,
        email: formData.email,
        lozinka: formData.lozinka,
        uloga: value,
      });
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/korisnici/register",
        formData
      ); //upit prema backendu
      alert(response.data); //prikaz rezultata funkcije
    } catch (error) {
      alert(error.response?.data || "Došlo je do greške prilikom registracije");
    }
  };

  return (
    <div className="container">
      <div className="header">
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
      <div className="ima_racun" onClick={() => navigate("/login")}>
        Imaš račun? <span>Prijavi se!</span>
      </div>
    </div>
  );
};

export default LoginRegister;