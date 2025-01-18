import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";
import logo_icon from "../Assets/logo-prototip3.png";
import edit_icon from "../Assets/pencil.png";
import default_profile from "../Assets/person.jpg";
import { useUser } from "../../UserContext";

const backend = "http://localhost:8080";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(`${backend}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Ukloni token iz localStorage
      localStorage.removeItem("token");

      // Resetiraj korisnika u kontekstu
      // setUser({
      //   id: null,
      //   ime: "",
      //   prezime: "",
      //   email: "",
      //   slika: "",
      //   uloga: "",
      //   languagesKnown: [],
      //   languagesToLearn: [],
      //   languagesTeach: [],
      //   stilPoducavanja: "",
      //   ciljeviUcenja: "",
      //   iskustvo: "",
      //   qualifications: [],
      //   satnica: "",
      // });

      // Preusmjeri korisnika na početnu stranicu
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Došlo je do greške prilikom odjave.");
    }
  };

  const location = useLocation();
  const { user, setUser } = useUser() || { user: {}, setUser: () => {} };
  const [editedUser, setEditedUser] = useState(user);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
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
            } = response.data;

            let temp = "data:image/png;base64," + response.data.slika;
            const profileImageUrl = base64ToImage(temp);
            slika = profileImageUrl.url;
            setProfileImage(profileImageUrl.url);

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
  }, [location, navigate, profileImage]);

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
      .put(`${backend}/api/moj-profil`, updatedUser, {
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
        setUser(editedUser);
        setEditModalOpen(false);
        setNotificationMessage("Profil uspješno spremljen! 🎉");
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000);
      } else {
        alert("Došlo je do greške prilikom spremanja profila.");
      }
    } catch (error) {
      console.error("Greška prilikom spremanja profila:", error);
      alert("Došlo je do greške prilikom spremanja profila.");
    }
  };

  // funkciju koristimo za mijenjanje postojećih vrijednosti, a ne stvaranje novih
  const handleInputChange = (field, index, value, listType) => {
    // field = naziv polja unutar objekta (language, level ili kvalifikacije)
    // index = indeks u listi koju uredujem (liste su languagesToLearn, languagesKnown, languagesTeach i qualifications)
    // value = nova vrijednost koju korisnik unosi
    // listType = odreduje koju listu uredujemo

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
    const updatedList = editedUser[listType].filter((_, i) => i !== index);
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

  // svaki put kad promjenimo sliku, zelim da se ta slika pohrani
  // sliku prvo spremamo kakva je, pretvaramo u base64 string
  // nakon pretvaranja u string, POST u backend da se tam spremi
  // nakon spremanja u backend, dohvacamo istu tu sliku s backenda i prikazujemo je kao base64

  // useEffect(() => {}, [])
  // [] je dependency array, odnosno kaj treba slusat da bi se pokretal kod unutar useEffect-a
  // hocu da svaki put kad uploadam sliku korisnika, da se ona posalje u backend
  // da se prije tog pretvori u base64 string
  // nakon tog ju hocu dohvatit i postavit ju kao profilnu sliku

  // kad se prvi put pokrene stranica, hocu provjerit u backendu jel imamo koji podatak o slici
  // ako nemamo, ucitamo sliku kao i inace

  // ovo zapravo ne treba jer vec imamo hook za to

  // useEffect(() => {
  //   const fetchUserProfilePicture = async () => {
  //     try {
  //       console.log("Jel se ovo pokrenulo?");
  //       const response = await axios.get(`${backend}/api/moj-profil`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });

  //       if (response.status === 200) {
  //         console.log(response.data.profilePicture);
  //       }
  //     } catch (error) {
  //       console.error("Greška stari: ", error);
  //       alert("Greška");
  //     }
  //   };

  //   fetchUserProfilePicture();
  // }, []);

  const handleImage = async (e) => {
    const selectedImage = e.target.files[0];
    console.log(selectedImage);

    if (selectedImage) {
      const base64String = await convertToBase64(selectedImage);
      const imageDetails = base64ToImage(base64String);

      if (imageDetails) {
        console.log(`Image URL: ${imageDetails.url}`);
        console.log(`Image Extension: ${imageDetails.extension}`);

        setProfileImage(imageDetails.url);
        await handleApi(base64String);
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
    if (!matches) {
      console.error("Invalid base64 string");
      return null;
    }

    const mimeType = matches[1];
    const data = matches[2];
    const extension = mimeType.split("/")[1];

    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mimeType });
    const url = URL.createObjectURL(blob);

    return { url, extension };
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

      if (response.status === 200) {
        console.log("Slika je poslana na backend");
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
                  <li key={index}>{item.kvalifikacije}</li>
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
              src={user.slika || default_profile}
              alt={`${user.ime}'s profile`}
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
            <button className="edit-profile-button" onClick={handleEditProfile}>
              Uredi profil
            </button>
            <button
              className="zahtjevi-button"
              onClick={() => navigate(`/requests/${user.id}`)}
            >
              Moji zahtjevi
            </button>
          </div>
          <div className="profile-buttons">
            {user.uloga === "Učenik" && (
              <button
                className="teachers-button"
                onClick={() => navigate("/teachers")}
              >
                Učitelji
              </button>
            )}
            {user.uloga === "Učitelj" && (
              <button
                className="calendar-button"
                onClick={() => navigate(`/calendar/${user.id}`)}
              >
                Moj kalendar
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
                    type="number"
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
