import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();

  // definiramo podatke u korisniku
  const [user, setUser] = useState({
    ime: "",
    prezime: "",
    email: "",
    uloga: "",
    languagesKnown: ["Engleski"],
    languagesToLearn: ["Francuski"],
  });

  // useEffect je hook koji upravlja stvarima poput dohvacanja podataka, manipulacije DOM-a itd...
  //sastoji se od funkcije, i od polja ovisnosti koje nareduje kada ce se funkcija izvrsiti
  //u ovom primjeru, polje ovisnosti je prazno (nalazi se na samom kraju hooka), sto znaci da ce se hook izvrsiti prilikom ucitavanja stranice
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://lingualinkbackend.onrender.com/api/moj-profil", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // slanje upita prema backendu, u headerima se salje token
          },
        });

        if (response.status === 200) {
          const { ime, prezime, email, uloga } = response.data; //iz odgovora uzimamo navedene varijable

          // azuriramo podatke
          setUser({
            ime: ime || "",
            prezime: prezime || "",
            email: email || "",
            uloga: uloga || "",
            languagesKnown: ["Engleski"],
            languagesToLearn: ["Francuski"],
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja korisničkog profila.");
      }
    };

    fetchUserProfile(); //pozivanje funkcije koja se nalazi unutar hooka
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-podaci">
          <span>Osobni podaci:</span>
          <p>
            <strong>Ime:</strong> {user.ime}
          </p>
          <p>
            <strong>Prezime:</strong> {user.prezime}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Uloga:</strong> {user.uloga || "nepoznato"}
          </p>
        </div>
        <div className="profile-jezici">
          <span>Jezici koje znam:</span>
          <ul>
            {user.languagesKnown.map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>

          <span>Jezici koje želim naučiti:</span>
          <ul>
            {user.languagesToLearn.map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-imagetext">
          <img
            src={
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={`${user.ime}'s profile`}
            className="profile-picture-large"
          />
          <h1 className="profile-name">{user.ime}</h1>
          <h1 className="profile-surname">{user.prezime}</h1>
        </div>
        <div className="profile-buttons">
          <button className="teachers-button" onClick={() => navigate("/teachers")}>Prikaz učitelja</button>
          <button className="odjava-button" onClick={() => navigate("/")}>Odjava</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
