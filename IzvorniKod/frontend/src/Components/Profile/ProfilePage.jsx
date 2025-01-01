import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // definiramo podatke u korisniku
  const [user, setUser] = useState({
    ime: "",
    prezime: "",
    email: "",
    uloga: "",
    languagesKnown: [{ language: "", level: "" }],
    languagesToLearn: [{ language: "", level: "" }],
    languagesTeach: [],
    stilPoducavanja: "",
    ciljeviUcenja: "",
    iskustvo: "",
    kvalifikacije: "",
    satnica: "",
  });

  // preko Reactovog useState pratimo je li modal otvoren ili zatvoren
  // na pocetku je zatvoren
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // stvaramo stanje koje pohranjuje privremene podatke korisnika kad uredujemo profil
  const [editedUser, setEditedUser] = useState(user);

  // useEffect je hook koji upravlja stvarima poput dohvacanja podataka, manipulacije DOM-a itd...
  // sastoji se od funkcije, i od polja ovisnosti koje nareduje kada ce se funkcija izvrsiti
  // u ovom primjeru, polje ovisnosti je prazno (nalazi se na samom kraju hooka),
  // sto znaci da ce se hook izvrsiti prilikom ucitavanja stranice
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        if (token) {
          localStorage.setItem("token", token);

          const response = await axios.get(
              "http://localhost:8080/api/moj-profil",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // slanje upita prema backendu, u headerima se salje token
                },
              }
          );

          if (response.status === 200) {
            const {
              ime,
              prezime,
              email,
              uloga,
              languagesKnown,
              languagesToLearn,
              languagesTeach,
              stilPoducavanja,
              ciljeviUcenja,
              iskustvo,
              kvalifikacije,
              satnica,
            } = response.data; // iz odgovora uzimamo navedene varijable

            // azuriramo podatke s onima iz backenda
            setUser({
              ime: ime || "",
              prezime: prezime || "",
              email: email || "",
              uloga: uloga || "",
              languagesKnown: languagesKnown || [],
              languagesToLearn: languagesToLearn || [],
              languagesTeach: languagesTeach || [],
              stilPoducavanja: stilPoducavanja || "",
              ciljeviUcenja: ciljeviUcenja || "",
              iskustvo: iskustvo || "",
              kvalifikacije: kvalifikacije || "",
              satnica: satnica || "",
            });
          }
        }else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja korisničkog profila.");
      }
    };
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

    fetchUserProfile(); // pozivanje funkcije koja se nalazi unutar hooka
  }, []);

  const handleEditProfile = () => {
    setEditedUser(user); // postavlja trenutno stanje korisnika u stanje uredivanja
    setEditModalOpen(true); // otvara modal
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
          "http://localhost:8080/api/moj-profil",
          editedUser,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );

      if (response.status === 200) {

        setUser(editedUser); // spremili smo promjene
        setEditModalOpen(false); // zatvaramo prozor za uredivanje
        alert("Profil uspjesno spremljen");
      } else {
        alert("Doslo je do greske prilikom spremanja profila");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Doslo je do pogreske prilikom spremanja profila");
    }
  };

  // funkciju koristimo za mijenjanje postojećih vrijednosti, a ne stvaranje novih
  const handleInputChange = (field, index, value, listType) => {
    // field = naziv polja unutar objekta (language ili level)
    // index = indeks u listi koju uredujem (liste su languagesToLearn i languagesTeach)
    // value = nova vrijednost koju korisnik unosi
    // listType = odreduje koju listu uredujemo

    // azuriranje za ime, prezime, email, uloga, stilPoducavanja, ciljeviUcenja,
    // iskustvo, kvalifikacije, satnica

    if (!listType) {
      setEditedUser({ ...editedUser, [field]: value });
    } else if (listType === "languagesTeach") {
      const updatedList = [...editedUser[listType]];
      updatedList[index] = value;
      setEditedUser({ ...editedUser, [listType]: updatedList });
    } else if (editedUser[listType]) {
      const updatedList = [...editedUser[listType]];
      updatedList[index][field] = value;
      setEditedUser({ ...editedUser, [listType]: updatedList });
    } else {
      console.error("Invalid listType:", listType);
    }
  };

  // funkciju koristimo za dodavanje jezika
  const handleAddLanguage = (listType) => {
    const newElement =
        listType === "languagesTeach" ? "" : { language: "", level: "" };
    const updatedList = [...editedUser[listType], newElement];
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  // funkciju koristimo za uklanjanje jezika
  const handleRemoveLanguage = (listType, index) => {
    const updatedList = editedUser[listType].filter((_, i) => i !== index); // izostavlja element na danom indexu
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  return (
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-podaci">
            <span>Osobni podaci</span>
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
              <strong>Uloga:</strong> {user.uloga}
            </p>
          </div>
          {user.uloga === "Učenik" && (
              <div className="profile-jezici">
                <span>Jezici koje znam</span>
                {user.languagesKnown && user.languagesKnown.length > 0 ? (
                    <ul>
                      {user.languagesKnown.map((lang, index) => (
                          <li key={index}>
                            {lang.language} - {lang.level}
                          </li>
                      ))}
                    </ul>
                ) : (
                    <p>Nema unesenih podataka o jezicima koje znate.</p>
                )}

                <span>Jezici koje želim naučiti</span>
                {user.languagesToLearn && user.languagesToLearn > 0 ? (
                    <ul>
                      {user.languagesToLearn.map((lang, index) => (
                          <li key={index}>
                            {lang.language} - {lang.level}
                          </li>
                      ))}
                    </ul>
                ) : (
                    <p>Nema unesenih podataka o jezicima koje želite naučiti.</p>
                )}

                <span>Preferirani stil podučavanja</span>
                <p>
                  {user.stilPoducavanja ||
                      "Nema unesenih podataka o preferiranom stilu podučavanja."}
                </p>

                <span>Ciljevi učenja</span>
                <p>
                  {user.ciljeviUcenja ||
                      "Nema unesenih podataka o ciljevima učenja."}
                </p>
              </div>
          )}

          {user.uloga === "Učitelj" && (
              <div className="profile-jezici">
                <span>Jezici koje podučavam</span>
                {user.languagesTeach && user.languagesTeach.length > 0 ? (
                    <ul>
                      {user.languagesTeach.map((lang, index) => (
                          <li key={index}>{lang.language}</li>
                      ))}
                    </ul>
                ) : (
                    <p>Nema unesenih podataka o jezicima.</p>
                )}

                <span>Iskustvo</span>
                <p>{user.iskustvo || "Nema unesenih podataka o iskustvu."}</p>

                <span>Kvalifikacije</span>
                <p>
                  {user.kvalifikacije ||
                      "Nema unesenih podataka o kvalifikacijama."}
                </p>

                <span>Stil podučavanja</span>
                <p>
                  {user.stilPoducavanja ||
                      "Nema unesenih podataka o stilu podučavanja."}
                </p>

                <span>Satnica</span>
                <p>{user.satnica || "Nema unesenih podataka o satnici."}</p>
              </div>
          )}
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
              <button className="edit-profile-button" onClick={handleEditProfile}>
                Uredi profil
              </button>
            </div>
            <div className="profile-buttons">
              <button
                  className="teachers-button"
                  onClick={() => navigate("/teachers")}
              >
                Prikaz učitelja
              </button>
              <button className="odjava-button" onClick={() => navigate("/")}>
                Odjava
              </button>
            </div>
          </div>
        </div>
        {isEditModalOpen && (
            <div className="modal">
              <div className="modal-content">
                {user.uloga === "Učenik" && (
                    <div className="scrollable-content">
                      <div className="jezici-koje-znam">
                        <h3>Jezici koje znam</h3>
                        {editedUser.languagesKnown.map((lang, index) => (
                            <div key={index}>
                              <input
                                  type="text"
                                  value={lang.language}
                                  onChange={(e) =>
                                      handleInputChange(
                                          "language",
                                          index,
                                          e.target.value,
                                          "languagesKnown"
                                      )
                                  }
                                  placeholder="Jezik"
                              />
                              <select
                                  value={lang.level}
                                  onChange={(e) =>
                                      handleInputChange(
                                          "level",
                                          index,
                                          e.target.value,
                                          "languagesKnown"
                                      )
                                  }
                              >
                                <option value="početna">Početna</option>
                                <option value="srednja">Srednja</option>
                                <option value="napredna">Napredna</option>
                              </select>
                              <button
                                  onClick={() =>
                                      handleRemoveLanguage("languagesKnown", index)
                                  }
                              >
                                Ukloni
                              </button>
                            </div>
                        ))}
                        <button onClick={() => handleAddLanguage("languagesKnown")}>
                          Dodaj jezik
                        </button>
                      </div>

                      <div className="jezici-koje-zelim-nauciti">
                        <h3>Jezici koje želim naučiti</h3>
                        {editedUser.languagesToLearn.map((lang, index) => (
                            <div key={index}>
                              <input
                                  type="text"
                                  value={lang.language}
                                  onChange={(e) =>
                                      handleInputChange(
                                          "language",
                                          index,
                                          e.target.value,
                                          "languagesToLearn"
                                      )
                                  }
                                  placeholder="Jezik"
                              />
                              <select
                                  value={lang.level}
                                  onChange={(e) =>
                                      handleInputChange(
                                          "level",
                                          index,
                                          e.target.value,
                                          "languagesToLearn"
                                      )
                                  }
                              >
                                <option value="početna">Početna</option>
                                <option value="srednja">Srednja</option>
                                <option value="napredna">Napredna</option>
                              </select>
                              <button
                                  onClick={() =>
                                      handleRemoveLanguage(index, "languagesToLearn")
                                  }
                              >
                                Ukloni
                              </button>
                            </div>
                        ))}
                        <button onClick={() => handleAddLanguage("languagesToLearn")}>
                          Dodaj jezik
                        </button>
                      </div>

                      <div className="styles-section">
                        <h3>Stilovi podučavanja jezika</h3>
                        <div className="tooltip-container">
                          <select
                              value={editedUser.stilPoducavanja || ""}
                              onChange={(e) =>
                                  handleInputChange(
                                      "stilPoducavanja",
                                      null,
                                      e.target.value,
                                      null
                                  )
                              }
                          >
                            <option value="" disabled>
                              Odaberi stil podučavanja
                            </option>
                            <option
                                value="style1"
                                title="Osobe sklone vizualnom učenju vole čitati jer uživaju gledati riječi i slova ispred sebe. Također vole stvarati jezične poveznice pomoću kartica s riječima ili fotografija."
                            >
                              Vizualni
                            </option>
                            <option
                                value="style2"
                                title="Kao što ime sugerira, auditorni učenici vole učiti kroz zvuk. Jako uživaju u interakciji i razgovoru s drugima te im nije nužno vidjeti riječi napisane."
                            >
                              Auditorni
                            </option>
                            <option
                                value="style3"
                                title="Oni koji imaju sklonost taktilnom učenju uživaju manipulirati raznim nastavnim materijalima dok uče jezik. Obožavaju praktične aktivnosti koje uključuju rad rukama."
                            >
                              Taktilni
                            </option>
                            <option
                                value="style4"
                                title="Ovaj tip učenika voli uzimati duže pauze i biti fizički aktivan dok uči engleski. Ne vole dugo sjediti za stolom te uživaju u kretanju tijekom učenja."
                            >
                              Kinestetički
                            </option>
                            <option
                                value="style5"
                                title="Ove osobe vole usmjeriti svu pažnju na sitne detalje jezika. Uživaju učiti gramatička pravila i razbijati jezik na manje dijelove. Zbog fokusa na detalje, ponekad ne vide širu sliku pri učenju jezika."
                            >
                              Analitički
                            </option>
                            <option
                                value="style6"
                                title="Oni ne vole ulaziti u sitnice jezika niti ih zanima kako jezik funkcionira “iznutra”. Usmjereni su na širu sliku i ono što jezik predstavlja te žele prenositi ideje, ne opterećujući se savršenom gramatikom."
                            >
                              Globalni
                            </option>
                            <option
                                value="style7"
                                title="Ovi učenici vole razmišljati o jeziku, promišljati kako točno prenijeti svoje misli te analizirati svoj napredak u učenju jezika. Skloni su činiti manje pogrešaka, ali im je potrebno više vremena da prenesu poruku."
                            >
                              Refleksivni
                            </option>
                            <option
                                value="style8"
                                title="Ovi učenici su rođeni da riskiraju pri učenju engleskog. Žele govoriti, komunicirati i ne brinu se previše o gramatici. Stalno isprobavaju nove stvari, griješe i uče iz tih pogrešaka."
                            >
                              Impulzivni
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="ciljevi-ucenja-section">
                        <h3>Ciljevi učenja</h3>
                        <div className="learning-goals-box">
                    <textarea
                        value={editedUser.ciljeviUcenja || ""}
                        onChange={(e) => {
                          setEditedUser({
                            ...editedUser,
                            ciljeviUcenja: e.target.value,
                          });
                        }}
                        placeholder="Koji su vaši ciljevi učenja?"
                    ></textarea>
                        </div>
                      </div>
                    </div>
                )}
                {user.uloga === "Učitelj" && (
                    <div className="scrollable-content">
                      <div className="jezici-koje-znam">
                        <h3>Jezici koje podučavam</h3>
                        {editedUser.languagesTeach.map((lang, index) => (
                            <div key={index}>
                              <input
                                  type="text"
                                  value={lang.language}
                                  onChange={(e) =>
                                      handleInputChange(
                                          null,
                                          index,
                                          e.target.value,
                                          "languagesTeach"
                                      )
                                  }
                                  placeholder="Jezik"
                              />
                              <button
                                  onClick={() =>
                                      handleRemoveLanguage(index, "languagesTeach")
                                  }
                              >
                                Ukloni
                              </button>
                            </div>
                        ))}
                        <button onClick={() => handleAddLanguage("languagesTeach")}>
                          Dodaj jezik
                        </button>
                      </div>
                      <div className="ciljevi-ucenja-section">
                        <h3>Iskustvo</h3>
                        <div className="learning-goals-box">
                    <textarea
                        value={editedUser.iskustvo || ""}
                        onChange={(e) => {
                          setEditedUser({
                            ...editedUser,
                            iskustvo: e.target.value,
                          });
                        }}
                        placeholder="Koje je vaše iskustvo?"
                    ></textarea>
                        </div>
                      </div>
                      <div className="ciljevi-ucenja-section">
                        <h3>Kvalifikacije</h3>
                        <div className="learning-goals-box">
                    <textarea
                        value={editedUser.kvalifikacije || ""}
                        onChange={(e) => {
                          setEditedUser({
                            ...editedUser,
                            kvalifikacije: e.target.value,
                          });
                        }}
                        placeholder="Koje su vaše kvalifikacije?"
                    ></textarea>
                        </div>
                      </div>
                      <div className="styles-section">
                        <h3>Stilovi podučavanja jezika</h3>
                        <div className="tooltip-container">
                          <select
                              value={editedUser.stilPoducavanja || ""}
                              onChange={(e) =>
                                  handleInputChange(
                                      "stilPoducavanja",
                                      null,
                                      e.target.value,
                                      null
                                  )
                              }
                          >
                            <option value="" disabled>
                              Odaberi stil podučavanja
                            </option>
                            <option
                                value="style1"
                                title="Osobe sklone vizualnom učenju vole čitati jer uživaju gledati riječi i slova ispred sebe. Također vole stvarati jezične poveznice pomoću kartica s riječima ili fotografija."
                            >
                              Vizualni
                            </option>
                            <option
                                value="style2"
                                title="Kao što ime sugerira, auditorni učenici vole učiti kroz zvuk. Jako uživaju u interakciji i razgovoru s drugima te im nije nužno vidjeti riječi napisane."
                            >
                              Auditorni
                            </option>
                            <option
                                value="style3"
                                title="Oni koji imaju sklonost taktilnom učenju uživaju manipulirati raznim nastavnim materijalima dok uče jezik. Obožavaju praktične aktivnosti koje uključuju rad rukama."
                            >
                              Taktilni
                            </option>
                            <option
                                value="style4"
                                title="Ovaj tip učenika voli uzimati duže pauze i biti fizički aktivan dok uči engleski. Ne vole dugo sjediti za stolom te uživaju u kretanju tijekom učenja."
                            >
                              Kinestetički
                            </option>
                            <option
                                value="style5"
                                title="Ove osobe vole usmjeriti svu pažnju na sitne detalje jezika. Uživaju učiti gramatička pravila i razbijati jezik na manje dijelove. Zbog fokusa na detalje, ponekad ne vide širu sliku pri učenju jezika."
                            >
                              Analitički
                            </option>
                            <option
                                value="style6"
                                title="Oni ne vole ulaziti u sitnice jezika niti ih zanima kako jezik funkcionira “iznutra”. Usmjereni su na širu sliku i ono što jezik predstavlja te žele prenositi ideje, ne opterećujući se savršenom gramatikom."
                            >
                              Globalni
                            </option>
                            <option
                                value="style7"
                                title="Ovi učenici vole razmišljati o jeziku, promišljati kako točno prenijeti svoje misli te analizirati svoj napredak u učenju jezika. Skloni su činiti manje pogrešaka, ali im je potrebno više vremena da prenesu poruku."
                            >
                              Refleksivni
                            </option>
                            <option
                                value="style8"
                                title="Ovi učenici su rođeni da riskiraju pri učenju engleskog. Žele govoriti, komunicirati i ne brinu se previše o gramatici. Stalno isprobavaju nove stvari, griješe i uče iz tih pogrešaka."
                            >
                              Impulzivni
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                )}
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