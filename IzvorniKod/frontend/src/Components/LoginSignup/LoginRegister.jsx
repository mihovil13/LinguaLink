import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const navigate = useNavigate(); //za preusmjeravanje na login page ili profile page
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
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
        prezime: formData.prezime,
        email: formData.email,
        lozinka: formData.lozinka,
        uloga: formData.uloga,
      });
    } else if (name === "prezime") {
      setFormData({
        ime: formData.ime,
        prezime: value,
        email: formData.email,
        lozinka: formData.lozinka,
        uloga: formData.uloga,
      });
    } else if (name === "email") {
      setFormData({
        ime: formData.ime,
        prezime: formData.prezime,
        email: value,
        lozinka: formData.lozinka,
        uloga: formData.uloga,
      });
    } else if (name === "lozinka") {
      setFormData({
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        lozinka: value,
        uloga: formData.uloga,
      });
    } else if (name === "uloga") {
      setFormData({
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        lozinka: formData.lozinka,
        uloga: value,
      });
    }
  };

  const handleRegister = async () => {
    try {
      //slanje post zahtjeva prema backendu
      const registerResponse = await axios.post(
        "http://localhost:8080/api/korisnici/register",
        formData
      );
      //ako je zahtjev uspio
      if (registerResponse.status === 200) {
        const token = registerResponse.data.token; //dohvacamo token i spremamo ga
        localStorage.setItem("token", token);

        const profileResponse = await axios.get(
          "http://localhost:8080/api/moj-profil",
          {
            //slanje get zahtjeva prema backendu
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, //u headerima saljemo token
            },
          }
        ); //slanje get zahtjeva prema backendu

        if (profileResponse.status === 200) {
          // alert(profileResponse.data);
          navigate("/profile");
        }
      }
    } catch (error) {
      alert(
        error.response?.data ||
          "Došlo je do greške prilikom registracije ili dohvaćanja profila"
      );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="teacher-button" onClick={() => navigate("/teachers")}>Prikaz Učitelja</button>
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
      <div className="ima_racun" onClick={() => navigate("/login")}>
        Imaš račun? <span>Prijavi se!</span>
      </div>
    </div>
  );
};

export default LoginRegister;
