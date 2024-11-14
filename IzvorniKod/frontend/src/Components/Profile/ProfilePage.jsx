import React from "react";
import profilePicture from "../Assets/person.png";

import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";



const ProfilePage = ({
  user = {
    name: "Aleksandar",
    surname: "Jovanović",
    profilePicture: "",
    email: "johndoe@example.com",
    role: "Učitelj",
    languagesKnown: ["Spanish"],
    languagesToLearn: ["English"],
  },
}) => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-podaci">
          <span>Osobni podaci:</span>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Uloga:</strong> {user.role || "nepoznato"}
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
              user.profilePicture ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={`${user.name}'s profile`}
            className="profile-picture-large"
          />
          <h1 className="profile-name">{user.name}</h1>
          <h1 className="profile-surname">{user.surname}</h1>
        </div>
        <div className="profile-buttons">
          <button className="teachers-button" onClick={() => navigate("/teachers")}>Prikaz učitelja</button>
          <button className="odjava-button">Odjava</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
