import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo_icon from "../Assets/logo-prototip3.png";
import edit_icon from "../Assets/pencil.png";
import profileimg from "../Assets/person.jpg";
import { useUser } from "../../UserContext";

const backend = "https://lingualink-rxoa.onrender.com";

const ProfilePage = () => {
  const navigate = useNavigate();
  const default_profile_picture = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleLogout = async () => {
    try {
      const token = getToken();

      if (token) {
        // Poziv backendu za odjavu
        await axios.post(
          `${backend}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Resetiranje korisničkih podataka
      setUser({
        id: null,
        ime: "",
        prezime: "",
        email: "",
        slika: "",
        uloga: "",
        languagesKnown: [{ nazivJezika: "", razina: "početna" }],
        languagesToLearn: [{ nazivJezika: "" }],
        languagesTeach: [{ nazivJezika: "" }],
        stilPoducavanja: "",
        ciljeviUcenja: "",
        iskustvo: "",
        qualifications: [{ kvalifikacije: "" }],
        satnica: "",
      });

      // Brisanje tokena iz localStorage
      localStorage.removeItem("token");

      // Preusmjeravanje na glavnu stranicu
      navigate("/");
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
      alert("Došlo je do greške prilikom odjave.");
    }
  };

  const location = useLocation();
  // definiramo podatke u korisniku
  const { user, setUser } = useUser() || { user: {}, setUser: () => {} };

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

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        if (token) {
          localStorage.setItem("token", token);

          const response = await axios.get(`${backend}/api/moj-profil`, {
            headers: {
              Authorization: `Bearer ${token}`,
              // slanje upita prema backendu, u headerima se salje token
            },
          });

          if (response.status === 200) {
            let {
              id,
              ime,
              prezime,
              email,
              slika,
              uloga,
              languagesKnown,
              languagesToLearn,
              languagesTeach,
              stilPoducavanja,
              ciljeviUcenja,
              iskustvo,
              qualifications,
              satnica,
            } = response.data; // iz odgovora uzimamo navedene varijable
            if (slika==null) {
              slika="";
            }
            slika = "data:image/png;base64," + slika;

            languagesKnown = languagesKnown || [];
            languagesToLearn = languagesToLearn || [];
            languagesTeach = languagesTeach || [];
            qualifications = qualifications || [];

            if (languagesKnown) {
              languagesKnown = languagesKnown.map((entry) => {
                const [language, level] = entry.split("-");
                return { nazivJezika: language.trim(), razina: level.trim() };
              });
            }
            if (languagesToLearn) {
              languagesToLearn = languagesToLearn.map((entry) => {
                return {
                  nazivJezika: entry.nazivJezika.trim(),
                };
              });
            }
            if (languagesTeach) {
              languagesTeach = languagesTeach.map((entry) => {
                return {
                  nazivJezika: entry.nazivJezika.trim(),
                };
              });
            }
            if (qualifications) {
              qualifications = qualifications.map((entry) => {
                return { kvalifikacije: entry.trim() };
              });
            }

            // azuriramo podatke s onima iz backenda
            setUser({
              id: id || null,
              ime: ime || "",
              prezime: prezime || "",
              email: email || "",
              slika: slika || "",
              uloga: uloga || "",
              languagesKnown: languagesKnown || [],
              languagesToLearn: languagesToLearn || [],
              languagesTeach: languagesTeach || [],
              stilPoducavanja: stilPoducavanja || "",
              ciljeviUcenja: ciljeviUcenja || "",
              iskustvo: iskustvo || "",
              qualifications: qualifications || [],
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
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [location, navigate]);

  const handleEditProfile = () => {
    setEditedUser(user); // postavlja trenutno stanje korisnika u stanje uredivanja
    setEditModalOpen(true); // otvara modal
  };

  //modal za odabir uloge
  const handleRoleSelection = (role) => {
    const updatedUser = { ...user, uloga: role };
    setUser(updatedUser); // Ažuriraj korisnički objekt s odabranom ulogom
    setRoleModalOpen(false); // Zatvori modal

    // Slanje podataka o ažuriranom korisniku na backend
    axios
      .put(`${backend}/api/moj-profil`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setNotificationMessage("Uloga uspješno postavljena! 🎉"); // Postavi poruku
          setShowNotification(true); // Prikaži notifikaciju

          setTimeout(() => setShowNotification(false), 3000); // Sakrij notifikaciju nakon 3 sekunde
        }
      })
      .catch((error) => {
        console.error("Error saving role:", error);
        setNotificationMessage("Došlo je do greške pri spremanju uloge. 😔");
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000);
      });
  };

  const handleSaveProfile = async (updatedProfile = editedUser) => {
    if (isNaN(updatedProfile.satnica) || updatedProfile.satnica < 0) {
      alert("Molimo unesite ispravnu satnicu.");
      return;
    }


    try {
      const response = await axios.put(
        `${backend}/api/moj-profil`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(editedUser); // Spremanje promjena
        setEditModalOpen(false); // Zatvaranje modalnog prozora
        setNotificationMessage("Profil uspješno spremljen! 🎉"); // Postavljanje poruke
        setShowNotification(true); // Prikazivanje notifikacije

        setTimeout(() => setShowNotification(false), 3000); // Sakrivanje notifikacije nakon 3 sekunde
      } else {
        setNotificationMessage("Došlo je do greške prilikom spremanja profila"); // Postavljanje poruke
        setShowNotification(true); // Prikazivanje notifikacije
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error("Greška prilikom spremanja profila:", error);
      setNotificationMessage("Došlo je do greške prilikom spremanja profila"); // Postavljanje poruke
      setShowNotification(true); // Prikazivanje notifikacije
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // funkciju koristimo za mijenjanje postojećih vrijednosti, a ne stvaranje novih
  const handleInputChange = (field, index, value, listType) => {
    // field = naziv polja unutar objekta (language, level ili kvalifikacije)
    // index = indeks u listi koju uredujem (liste su languagesToLearn, languagesKnown, languagesTeach i qualifications)
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
      const duplicate = updatedList.some((item) => item.nazivJezika === value);
      if (duplicate) {
        alert(`Jezik ${value} se već nalazi u listi`);
      } else {
        updatedList[index][field] = value;
        setEditedUser({ ...editedUser, [listType]: updatedList });
      }
    } else if (listType === "languagesKnown") {
      const updatedList = [...editedUser[listType]];
      const duplicate = updatedList.some((item) => item.nazivJezika === value);
      if (duplicate) {
        alert(`Jezik ${value} se već nalazi u listi`);
      } else {
        updatedList[index][field] = value;
        //ako jezik nema level postavljam ga na početnu
        const correctList = updatedList.map((item) => ({
          ...item,
          razina: item.razina || "početna",
        }));
        setEditedUser({ ...editedUser, [listType]: correctList });
      }
    } else if (listType === "qualifications") {
      const updatedList = [...editedUser[listType]];
      const duplicate = updatedList.some(
        (item) => item.kvalifikacije === value
      );
      if (duplicate) {
        alert(`Već ste naveli ovu kvalifikaciju: ${value}`);
      } else {
        updatedList[index][field] = value;
        setEditedUser({ ...editedUser, [listType]: updatedList });
      }
    } else {
      console.error("Invalid listType:", listType);
    }
  };

  // funkciju koristimo za dodavanje jezika
  const handleAddLanguage = (listType) => {
    const newElement =
      listType === "languagesKnown"
        ? { nazivJezika: "", razina: "" }
        : { nazivJezika: "" };
    const updatedList = [...editedUser[listType], newElement];
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  // funkciju koristimo za uklanjanje jezika
  const handleRemoveLanguage = (listType, index) => {
    const updatedList = editedUser[listType].filter((_, i) => i !== index); // izostavlja element na danom indexu
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  // funkciju koristimo za dodavanje kvalifikacije
  const handleAddQualification = (listType) => {
    const newElement = { kvalifikacije: "" };
    const updatedList = [...editedUser[listType], newElement];
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  // funkciju koristimo za uklanjanje kvalifikacije
  const handleRemoveQualification = (listType, index) => {
    const updatedList = editedUser[listType].filter((_, i) => i !== index);
    setEditedUser({ ...editedUser, [listType]: updatedList });
  };

  const handleImage = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage.type != "image/png") {
      alert("Dozvoljen je samo PNG format slike");
      return;
    }

    if (selectedImage) {
      try {
        const base64String = await convertToBase64(selectedImage);
        const imageDetails = base64ToImage(base64String);

        if (imageDetails) {

          await handleApi(base64String);
        }
      } catch (error) {
        console.error("Error processing image: ", error);
      }
    }
    e.target.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToImage = (base64String) => {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error("Invalid base64 string format");
      return null;
    }

    const mimeType = matches[1];
    const data = matches[2];

    try {
      const binary = atob(data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mimeType });
      const url = URL.createObjectURL(blob);

      return { url, extension: mimeType.split("/")[1] };
    } catch (error) {
      console.error("Error decoding base64 string: ", error);
      return null;
    }
  };

  const handleApi = async (convertedImage) => {
    try {
      const response = await axios.post(
        `${backend}/api/spremi-sliku`,
        { email: user.email, slika: convertedImage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const responseProfile = await axios.get(`${backend}/api/moj-profil`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const serverBase64 = responseProfile.data.slika;
      const completeBase64 = `data:image/png;base64,${serverBase64}`;

      const imageDetails = base64ToImage(completeBase64);

      if (imageDetails) {
        setProfileImage(imageDetails.url);
        setUser({
          ...user,
          slika: imageDetails.url,
        });
      }
    } catch (error) {
      console.error("Error during image upload: ", error);
    }
  };

  return (
    <div className="profile-page">
      <div
        id="notification"
        className={`filter-notification ${showNotification ? "show" : ""}`}
      >
        {notificationMessage}
      </div>
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
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
          {user.uloga === "Učitelj" && (
            <button
              className="recenzije-button"
              onClick={() => navigate(`/ratings/${user.id}`)}
            >
              ⭐ Recenzije učenika
            </button>
          )}
        </div>
        {user.uloga === "Učenik" && (
          <div className="profile-jezici">
            <span>Jezici koje znam</span>
            {user.languagesKnown && user.languagesKnown.length > 0 ? (
              <ul>
                {user.languagesKnown.map((lang, index) => (
                  <li key={index}>
                    {lang.nazivJezika} - {lang.razina}
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
                  <li key={lang.jezik_id || index}>{lang.nazivJezika}</li>
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
                  <li key={lang.jezik_id || index}>{lang.nazivJezika}</li>
                ))}
              </ul>
            ) : (
              <p>Nema unesenih podataka o jezicima.</p>
            )}

            <span>Iskustvo</span>
            <p>{user.iskustvo || "Nema unesenih podataka o iskustvu."}</p>

            <span>Kvalifikacije</span>
            {user.qualifications && user.qualifications.length > 0 ? (
              <ul>
                {user.qualifications.map((item, index) => (
                  <li key={index}>
                    {item.kvalifikacije === "Izvorni_govornik"
                      ? "Izvorni govornik"
                      : item.kvalifikacije}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nema unesenih podataka o kvalifikacijama.</p>
            )}

            <span>Stil podučavanja</span>
            <p>
              {user.stilPoducavanja ||
                "Nema unesenih podataka o stilu podučavanja."}
            </p>

            <span>Satnica</span>
            <p>
              {user.satnica
                ? `${user.satnica}€/h`
                : "Nema unesenih podataka o satnici."}
            </p>
          </div>
        )}
      </div>

      <div className="profile-header">
        <div className="profile-imagetext">
          <div className="profile-image-container">
            <img
              src={user.slika==="data:image/png;base64," ? default_profile_picture : user.slika}
              alt={
                `${user.ime}'s profile picture`
              }
              className="profile-picture-large"
            />
            <label htmlFor="input-file">
              <img src={edit_icon} alt="Uredi sliku" />
            </label>
          </div>
          <input
            type="file"
            accept="image/png"
            id="input-file"
            onChange={handleImage}
          />
          <h1 className="profile-name">{user.ime}</h1>
          <h1 className="profile-surname">{user.prezime}</h1>
        </div>
        <div className="buttons">
          <div className="edit-button">
            {(user.uloga === "Učenik" || user.uloga === "Učitelj") && (
              <button
                className="edit-profile-button"
                onClick={handleEditProfile}
              >
                Uredi profil
              </button>
            )}
            {user.uloga === "Učenik" && (
              <div className="first-row-profile-buttons">
                <button
                  className="teachers-button"
                  onClick={() => navigate("/teachers")}
                >
                  Učitelji
                </button>
              </div>
            )}
            {user.uloga === "Učitelj" && (
              <div className="first-row-profile-buttons">
                <button
                  className="lections-button"
                  onClick={() => navigate(`/lections/${user.id}`)}
                >
                  Odrađene lekcije
                </button>
              </div>
            )}
          </div>
          <div className="profile-buttons">
            {(user.uloga === "Učenik" || user.uloga === "Učitelj") && (
              <button
                className="zahtjevi-button"
                onClick={() => navigate(`/requests/${user.id}`)}
              >
                Moji zahtjevi
              </button>
            )}
            {user.uloga === "Učenik" && (
              <div className="first-row-profile-buttons">
                <button
                  className="lections-button"
                  onClick={() => navigate(`/lections/${user.id}`)}
                >
                  Moje lekcije
                </button>
              </div>
            )}

            {user.uloga === "Učitelj" && (
              <button
                className="calendar-button"
                onClick={() => navigate(`/calendar/${user.id}`)}
              >
                Moj kalendar
              </button>
            )}
            {user.uloga === "Admin" && (
              <button
                className="admin-button"
                onClick={() => navigate(`/users`)}
              >
                Korisnici
              </button>
            )}
            <button className="odjava-button" onClick={handleLogout}>
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
                        value={lang.nazivJezika}
                        onChange={(e) =>
                          handleInputChange(
                            "nazivJezika",
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
                        value={lang.razina}
                        onChange={(e) =>
                          handleInputChange(
                            "razina",
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
                        value={lang.nazivJezika}
                        onChange={(e) =>
                          handleInputChange(
                            "nazivJezika",
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
                        value={lang.nazivJezika}
                        onChange={(e) =>
                          handleInputChange(
                            "nazivJezika",
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
                <div className="jezici-koje-znam">
                  <h3>Kvalifikacije</h3>
                  {editedUser.qualifications.map((kval, index) => (
                    <div key={index}>
                      <select
                        value={kval.kvalifikacije}
                        onChange={(e) =>
                          handleInputChange(
                            "kvalifikacije",
                            index,
                            e.target.value,
                            "qualifications"
                          )
                        }
                      >
                        <option value="" disabled>
                          Odaberi
                        </option>
                        <option value="Profesor">Profesor</option>
                        <option value="Izvorni_govornik">
                          Izvorni govornik
                        </option>
                        <option value="Certifikat">Certifikat</option>
                      </select>
                      <button
                        onClick={() =>
                          handleRemoveQualification("qualifications", index)
                        }
                      >
                        Ukloni
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddQualification("qualifications")}
                  >
                    Dodaj kvalifikaciju
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
                <div className="satnica-section">
                  <h3>Satnica (cijena po satu)</h3>
                  <input
                    type="text"
                    value={editedUser.satnica || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleInputChange(
                          "satnica",
                          null,
                          e.target.value,
                          null
                        );
                      }
                    }}
                    placeholder="Unesite satnicu(€/h)"
                  />
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
