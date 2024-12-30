import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    ime: "",
    prezime: "",
    email: "",
    uloga: "",
    languagesKnown: ["Engleski"],
    languagesToLearn: ["Francuski"],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Extract the token from query params if present
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        if (token) {
          localStorage.setItem("token", token);

          const response = await axios.get("http://localhost:8080/api/moj-profil", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const { ime, prezime, email, uloga } = response.data;
            setUser({
              ime: ime || "",
              prezime: prezime || "",
              email: email || "",
              uloga: uloga || "",
              languagesKnown: ["Engleski"],
              languagesToLearn: ["Francuski"],
            });
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja korisničkog profila.");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
            "http://localhost:8080/api/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
      }

      // Ukloni token iz localStorage
      localStorage.removeItem("token");

      // Preusmjeri korisnika na login stranicu
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Došlo je do greške prilikom odjave.");
    }
  };

  return (
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-podaci">
            <span>Osobni podaci:</span>
            <p><strong>Ime:</strong> {user.ime}</p>
            <p><strong>Prezime:</strong> {user.prezime}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Uloga:</strong> {user.uloga || "nepoznato"}</p>
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
            <button className="odjava-button" onClick={handleLogout}>Odjava</button>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
