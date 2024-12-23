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
    languagesKnown: [{language: "", level: ""}],
    languagesToLearn: [{language: "", level: ""}],
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // useEffect je hook koji upravlja stvarima poput dohvacanja podataka, manipulacije DOM-a itd...
  //sastoji se od funkcije, i od polja ovisnosti koje nareduje kada ce se funkcija izvrsiti
  //u ovom primjeru, polje ovisnosti je prazno (nalazi se na samom kraju hooka), sto znaci da ce se hook izvrsiti prilikom ucitavanja stranice
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/moj-profil", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // slanje upita prema backendu, u headerima se salje token
          },
        });

        if (response.status === 200) {
          const { ime, prezime, email, uloga, languagesKnown, languagesToLearn } = response.data; //iz odgovora uzimamo navedene varijable

          // azuriramo podatke
          setUser({
            ime: ime || "",
            prezime: prezime || "",
            email: email || "",
            uloga: uloga || "",
            languagesKnown: languagesKnown || [],
            languagesToLearn: languagesToLearn || [],
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja korisničkog profila.");
      }
    };

    fetchUserProfile(); //pozivanje funkcije koja se nalazi unutar hooka
  }, []);

  const handleEditProfile = () => {
    setEditedUser(user); // postavlja trenutno stanje korisnika u stanje uredivanja
    setEditModalOpen(true); // otvara modal
  }

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put("http://localhost:8080/api/moj-profil", editedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      if (response.data === 200) {
        setUser(editedUser);
        setEditModalOpen(false);
        alert("Profil uspjesno spremljen");
      } else {
        alert("Doslo je do greske prilikom spremanja profila");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Doslo je do pogreske prilikom spremanja profila");
    }
  }

  const handleInputChange = (field, index, value, listType) => {
    const updatedList = [...editedUser[listType]]; // kopira listu iz objekta editedUser
    updatedList[index][field] = value;
    setEditedUser({...editedUser, [listType]: updatedList });
  }

  const handleAddLanguage = (listType) => {
    const updatedList = [...editedUser[listType], { language: "", level: "početna" }];
    setEditedUser({...editedUser, [listType]: updatedList });
  }

  const handleRemoveLanguage = (index, listType) => {
    const updatedList = editedUser[listType].filter((_, i) => i !== index); // izostavlja element na danom indexu
    setEditedUser({...editedUser, [listType]: updatedList });
  }

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
              <li key={index}>{lang.language} - {lang.level}</li>
            ))}
          </ul>

          <span>Jezici koje želim naučiti:</span>
          <ul>
            {user.languagesToLearn.map((lang, index) => (
              <li key={index}>{lang.language} - {lang.level}</li>
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
        <div className="buttons">
          <div className="edit-button">
            <button className="edit-profile-button" onClick={handleEditProfile}>Uredi profil</button>
          </div>
          <div className="profile-buttons">
            <button className="teachers-button" onClick={() => navigate("/teachers")}>Prikaz učitelja</button>
            <button className="odjava-button" onClick={() => navigate("/")}>Odjava</button>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="jezici-koje-znam">
              <h3>Jezici koje znam</h3>
              {editedUser.languagesKnown.map((lang, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) =>
                      handleInputChange("language", index, e.target.value, "languagesKnown")
                    }
                    placeholder="Jezik"
                  />
                  <select
                    value={lang.level}
                    onChange={(e) =>
                      handleInputChange("level", index, e.target.value, "languagesKnown")
                    }
                  >
                    <option value="početna">Početna</option>
                    <option value="srednja">Srednja</option>
                    <option value="napredna">Napredna</option>
                  </select>
                  <button onClick={() => handleRemoveLanguage(index, "languagesKnown")}>Ukloni</button>
                </div>
              ))}
              <button onClick={() => handleAddLanguage("languagesKnown")}>Dodaj Jezik</button>
            </div>

            <div className="jezici-koje-zelim-nauciti">
              <h3>Jezici koje želim naučiti</h3>
              {editedUser.languagesToLearn.map((lang, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) =>
                      handleInputChange("language", index, e.target.value, "languagesToLearn")
                    }
                    placeholder="Jezik"
                  />
                  <select
                    value={lang.level}
                    onChange={(e) =>
                      handleInputChange("level", index, e.target.value, "languagesToLearn")
                    }
                  >
                    <option value="početna">Početna</option>
                    <option value="srednja">Srednja</option>
                    <option value="napredna">Napredna</option>
                  </select>
                  <button onClick={() => handleRemoveLanguage(index, "languagesToLearn")}>
                    Ukloni
                  </button>
                </div>
              ))}
              <button onClick={() => handleAddLanguage("languagesToLearn")}>Dodaj Jezik</button>
            </div>
            <div className="spremi-zatvori">
              <button onClick={handleSaveProfile}>Spremi</button>
              <button onClick={() => setEditModalOpen(false)}>Zatvori</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;