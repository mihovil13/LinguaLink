import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useLocation, useNavigate } from "react-router-dom";
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
    languagesKnown: [{ language: "", level: "početna" }],
    languagesToLearn: [{ language: "" }],
    languagesTeach: [{ language: "" }],
    stilPoducavanja: "",
    ciljeviUcenja: "",
    iskustvo: "",
    kvalifikacije: "",
    satnica: "",
  });

  // preko Reactovog useState pratimo je li modal otvoren ili zatvoren
  // na pocetku je zatvoren
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  //stanje za modal odabira uloge
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);

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
            let {
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
            if(languagesKnown){
              languagesKnown = languagesKnown.split(", ").map((entry) => {
                const [language, level] = entry.split("-");
                return { language: language.trim(), level: level.trim() };
              });
            }
            if(languagesToLearn){
              languagesToLearn = languagesToLearn.split(", ").map((entry) => {
                return { language: entry.trim() };
              });
            }
            if(languagesTeach){
              languagesTeach = languagesTeach.split(", ").map((entry) => {
                return { language: entry.trim() };
              });
            }

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

            if (!response.data.uloga) {
              //ako korisnilk nema definiranu ulogu, prikazuje se modal za odabir uloge
              setRoleModalOpen(true);
            }
          }
        } else {
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

  //modal za odabir uloge
  const handleRoleSelection = (role) => {
    const updatedUser = { ...user, uloga: role };
    setUser(updatedUser); //update varijable korisnika s odabranom ulogom
    setRoleModalOpen(false); //zatvaranje modala

    //slanje podataka u updajtanom korisniku na backend
    axios
      .put("http://localhost:8080/api/moj-profil", updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Uloga uspješno postavljena!");
        }
      })
      .catch((error) => {
        console.error("Error saving role:", error);
        alert("Došlo je do greške pri spremanju uloge.");
      });
  };

  const handleSaveProfile = async (updatedProfile = editedUser) => {
    try {
      console.log(updatedProfile);
      const response = await axios.put(
        "http://localhost:8080/api/moj-profil",
        updatedProfile,
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
    } else if (
      listType === "languagesTeach" ||
      listType === "languagesToLearn"
    ) {
      const updatedList = [...editedUser[listType]];
      const duplicate = updatedList.some((item) => item.language === value);
      if (duplicate) {
        alert(`Jezik ${value} se već nalazi u listi`);
      } else {
        updatedList[index][field] = value;
        setEditedUser({ ...editedUser, [listType]: updatedList });
      }
    } else if (listType === "languagesKnown") {
      const updatedList = [...editedUser[listType]];
      const duplicate = updatedList.some((item) => item.language === value);
      if (duplicate) {
        alert(`Jezik ${value} se već nalazi u listi`);
      } else {
        updatedList[index][field] = value;
        //ako jezik nema level postavljam ga na početnu
        const correctList = updatedList.map((item) => ({
          ...item,
          level: item.level || "početna",
        }));
        setEditedUser({ ...editedUser, [listType]: correctList });
      }
    } else {
      console.error("Invalid listType:", listType);
    }
  };

  // funkciju koristimo za dodavanje jezika
  const handleAddLanguage = (listType) => {
    const newElement =
      listType === "languagesKnown"
        ? { language: "", level: "" }
        : { language: "" };
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
      {/* Modal za odabir uloge */}
      {isRoleModalOpen && (
        <div className="role-modal">
          <div className="role-modal-content">
            <h2>Upozorenje</h2>
            <p>Vaša uloga nije definirana. Molimo odaberite svoju ulogu:</p>
            <div className="role-buttons">
              <button
                className="role-button"
                onClick={() => handleRoleSelection("Učenik")}
              >
                Učenik
              </button>
              <button
                className="role-button"
                onClick={() => handleRoleSelection("Učitelj")}
              >
                Učitelj
              </button>
            </div>
          </div>
        </div>
      )}
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
            {user.languagesToLearn && user.languagesToLearn.length > 0 ? (
              <ul>
                {user.languagesToLearn.map((lang, index) => (
                  <li key={index}>{lang.language}</li>
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
                      <select
                        value={lang.language}
                        onChange={(e) =>
                          handleInputChange(
                            "language",
                            index,
                            e.target.value,
                            "languagesKnown"
                          )
                        }
                      >
                        <option value="" disabled>
                          Odaberi jezik
                        </option>
                        <option value="Engleski">Engleski</option>
                        <option value="Njemački">Njemački</option>
                        <option value="Francuski">Francuski</option>
                        <option value="Španjolski">Španjolski</option>
                        <option value="Talijanski">Talijanski</option>
                        <option value="Portugalski">Portugalski</option>
                        <option value="Ruski">Ruski</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arapski">Arapski</option>
                        <option value="Mandarinski">Mandarinski</option>
                        <option value="Japanski">Japanski</option>
                      </select>
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
                      <select
                        value={lang.language}
                        onChange={(e) =>
                          handleInputChange(
                            "language",
                            index,
                            e.target.value,
                            "languagesToLearn"
                          )
                        }
                      >
                        <option value="" disabled>
                          Odaberi jezik
                        </option>
                        <option value="Engleski">Engleski</option>
                        <option value="Njemački">Njemački</option>
                        <option value="Francuski">Francuski</option>
                        <option value="Španjolski">Španjolski</option>
                        <option value="Talijanski">Talijanski</option>
                        <option value="Portugalski">Portugalski</option>
                        <option value="Ruski">Ruski</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arapski">Arapski</option>
                        <option value="Mandarinski">Mandarinski</option>
                        <option value="Japanski">Japanski</option>
                      </select>
                      <button
                        onClick={() =>
                          handleRemoveLanguage("languagesToLearn", index)
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
                        value="Vizualni"
                        title="Osobe sklone vizualnom učenju vole čitati jer uživaju gledati riječi i slova ispred sebe. Također vole stvarati jezične poveznice pomoću kartica s riječima ili fotografija."
                      >
                        Vizualni
                      </option>
                      <option
                        value="Auditorni"
                        title="Kao što ime sugerira, auditorni učenici vole učiti kroz zvuk. Jako uživaju u interakciji i razgovoru s drugima te im nije nužno vidjeti riječi napisane."
                      >
                        Auditorni
                      </option>
                      <option
                        value="Taktilni"
                        title="Oni koji imaju sklonost taktilnom učenju uživaju manipulirati raznim nastavnim materijalima dok uče jezik. Obožavaju praktične aktivnosti koje uključuju rad rukama."
                      >
                        Taktilni
                      </option>
                      <option
                        value="Kinestetički"
                        title="Ovaj tip učenika voli uzimati duže pauze i biti fizički aktivan dok uči engleski. Ne vole dugo sjediti za stolom te uživaju u kretanju tijekom učenja."
                      >
                        Kinestetički
                      </option>
                      <option
                        value="Analitički"
                        title="Ove osobe vole usmjeriti svu pažnju na sitne detalje jezika. Uživaju učiti gramatička pravila i razbijati jezik na manje dijelove. Zbog fokusa na detalje, ponekad ne vide širu sliku pri učenju jezika."
                      >
                        Analitički
                      </option>
                      <option
                        value="Globalni"
                        title="Oni ne vole ulaziti u sitnice jezika niti ih zanima kako jezik funkcionira “iznutra”. Usmjereni su na širu sliku i ono što jezik predstavlja te žele prenositi ideje, ne opterećujući se savršenom gramatikom."
                      >
                        Globalni
                      </option>
                      <option
                        value="Refleksivni"
                        title="Ovi učenici vole razmišljati o jeziku, promišljati kako točno prenijeti svoje misli te analizirati svoj napredak u učenju jezika. Skloni su činiti manje pogrešaka, ali im je potrebno više vremena da prenesu poruku."
                      >
                        Refleksivni
                      </option>
                      <option
                        value="Impulzivni"
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
                      <select
                        value={lang.language}
                        onChange={(e) =>
                          handleInputChange(
                            "language",
                            index,
                            e.target.value,
                            "languagesTeach"
                          )
                        }
                      >
                        <option value="" disabled>
                          Odaberi jezik
                        </option>
                        <option value="Engleski">Engleski</option>
                        <option value="Njemački">Njemački</option>
                        <option value="Francuski">Francuski</option>
                        <option value="Španjolski">Španjolski</option>
                        <option value="Talijanski">Talijanski</option>
                        <option value="Portugalski">Portugalski</option>
                        <option value="Ruski">Ruski</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arapski">Arapski</option>
                        <option value="Mandarinski">Mandarinski</option>
                        <option value="Japanski">Japanski</option>
                      </select>
                      <button
                        onClick={() =>
                          handleRemoveLanguage("languagesTeach", index)
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
                        value="Vizualni"
                        title="Osobe sklone vizualnom učenju vole čitati jer uživaju gledati riječi i slova ispred sebe. Također vole stvarati jezične poveznice pomoću kartica s riječima ili fotografija."
                      >
                        Vizualni
                      </option>
                      <option
                        value="Auditorni"
                        title="Kao što ime sugerira, auditorni učenici vole učiti kroz zvuk. Jako uživaju u interakciji i razgovoru s drugima te im nije nužno vidjeti riječi napisane."
                      >
                        Auditorni
                      </option>
                      <option
                        value="Taktilni"
                        title="Oni koji imaju sklonost taktilnom učenju uživaju manipulirati raznim nastavnim materijalima dok uče jezik. Obožavaju praktične aktivnosti koje uključuju rad rukama."
                      >
                        Taktilni
                      </option>
                      <option
                        value="Kinestetički"
                        title="Ovaj tip učenika voli uzimati duže pauze i biti fizički aktivan dok uči engleski. Ne vole dugo sjediti za stolom te uživaju u kretanju tijekom učenja."
                      >
                        Kinestetički
                      </option>
                      <option
                        value="Analitički"
                        title="Ove osobe vole usmjeriti svu pažnju na sitne detalje jezika. Uživaju učiti gramatička pravila i razbijati jezik na manje dijelove. Zbog fokusa na detalje, ponekad ne vide širu sliku pri učenju jezika."
                      >
                        Analitički
                      </option>
                      <option
                        value="Globalni"
                        title="Oni ne vole ulaziti u sitnice jezika niti ih zanima kako jezik funkcionira “iznutra”. Usmjereni su na širu sliku i ono što jezik predstavlja te žele prenositi ideje, ne opterećujući se savršenom gramatikom."
                      >
                        Globalni
                      </option>
                      <option
                        value="Refleksivni"
                        title="Ovi učenici vole razmišljati o jeziku, promišljati kako točno prenijeti svoje misli te analizirati svoj napredak u učenju jezika. Skloni su činiti manje pogrešaka, ali im je potrebno više vremena da prenesu poruku."
                      >
                        Refleksivni
                      </option>
                      <option
                        value="Impulzivni"
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
              <button onClick={() => handleSaveProfile(editedUser)}>
                Spremi
              </button>
              <button onClick={() => setEditModalOpen(false)}>Zatvori</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
