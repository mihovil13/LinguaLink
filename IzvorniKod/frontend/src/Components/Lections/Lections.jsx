import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import logo_icon from "../Assets/logo-prototip3.png";
import { useNavigate } from "react-router-dom";
import "./Lections.css";

const backend = "http://localhost:8080";

const Lections = () => {
  const { user, setUser } = useUser();
  const [predavanja, setPredavanja] = useState([]);
  const [recenzije, setRecenzije] = useState([]);
  const [selectedPredavanje, setSelectedPredavanje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false); // Novo stanje
  const [linkMaterijala, setLinkMaterijala] = useState("");
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [ocjena, setOcjena] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoverOcjena, setHoverOcjena] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const navigate = useNavigate();

  const handleOpenMaterialModal = async (predavanjeId) => {
    try {
      const response = await axios.get(
        `${backend}/api/dohvati-materijale/${predavanjeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response: " + response);
      // izvlacenje linka za materijale, u JSON-u je vrijednost polja materijal bila npr. "{\"materijal\":\"https://youtu.be/QnMhoBRnd1c?si=wnhRb5hExsCXt-QS&t=66\"}"
      // pa se materialString.match funkcijom makne sve osim https://youtu.be/QnMhoBRnd1c?si=wnhRb5hExsCXt-QS&t=66
      const materialString = response.data.materijal;
      var link = null;
      if (materialString != null) {
        link = materialString.match(/"materijal":"(.*?)"/)[1];
      }
      if (response.status === 200) {
        setSelectedMaterial(link);
        console.log(response);
        console.log(response.data.materijal);
        setMaterialModalVisible(true);
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja materijala:", error);
      alert("Došlo je do greške pri dohvaćanju materijala.");
    }
  };

  // Zatvaranje modalnog prozora za materijale
  const handleCloseMaterialModal = () => {
    setMaterialModalVisible(false);
    setSelectedMaterial(null);
  };

  // Otvaranje modalnog prozora za upload materijala
  const handleOpenUploadModal = (predavanje) => {
    setSelectedPredavanje(predavanje);
    setUploadModalVisible(true);
  };

  // Zatvaranje modalnog prozora za upload materijala
  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
    setLinkMaterijala("");
  };

  //slanje linka na backend
  const handleUploadMaterijala = async () => {
    if (!linkMaterijala) {
      alert("Molimo unesite link na materijale.");
      return;
    }
    try {
      console.log("Ovo je link: " + linkMaterijala);
      console.log("Id predavanja: " + selectedPredavanje.predavanjeId);
      const response = await axios.post(
        `${backend}/api/postavi-materijale/${selectedPredavanje.predavanjeId}`,
        { materijal: linkMaterijala },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setNotificationMessage("Materijali uspješno dodani!🎉");
        setShowNotification(true); // Prikaži notifikaciju
        setTimeout(() => setShowNotification(false), 3000);
        setUploadModalVisible(false);
        setLinkMaterijala("");
        fetchPredavanja(); // Osvježavanje predavanja
      }
    } catch (error) {
      console.error("Greška prilikom dodavanja materijala:", error);
      setNotificationMessage("Došlo je do greške prilikom dodavanja materijala.");
      setShowNotification(true); // Prikaži notifikaciju
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const fetchPredavanja = async () => {
    try {
      const apiUrl =
        user.uloga === "Učenik"
          ? `${backend}/api/dohvati-predavanja-ucenik/${user.id}`
          : `${backend}/api/dohvati-predavanja/${user.id}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const currentTime = new Date().getTime();
        const filteredPredavanja = response.data.filter((predavanje) => {
          const vrijemePocetka = new Date(
            predavanje.datumVrijemePocetka
          ).getTime();
          return vrijemePocetka < currentTime && predavanje.potvrdeno === 1;
        });

        setPredavanja(filteredPredavanja);

        const recenzijeUrl =
          user.uloga === "Učenik"
            ? `${backend}/api/recenzije-ucenik/${user.id}`
            : `${backend}/api/recenzije/${user.id}`;

        const recenzijeResponse = await axios.get(recenzijeUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (recenzijeResponse.status === 200) {
          setRecenzije(recenzijeResponse.data);
        }
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja lekcija:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredavanja();
  }, [user, navigate]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year}., ${hours}:${minutes}`;
  };

  const hasRecenzija = (predavanjeId) => {
    return recenzije.some(
      (recenzija) => recenzija.predavanje_id === predavanjeId
    );
  };

  if (loading) {
    return <p>Učitavanje predavanja...</p>;
  }

  const handleOpenModal = (predavanje) => {
    setSelectedPredavanje(predavanje);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setOcjena(0);
    setKomentar("");
  };

  const handleSubmitReview = async () => {
    if (!ocjena || !komentar) {
      alert("Molimo ispunite sve podatke.");
      return;
    }

    try {
      const response = await axios.post(
        `${backend}/api/recenzije`,
        {
          predavanjeId: selectedPredavanje.predavanjeId,
          ucenikId: user.id,
          uciteljId: selectedPredavanje.uciteljId,
          ocjena,
          komentar,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setNotificationMessage("Recenzija uspješno spremljena!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        fetchPredavanja();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Greška prilikom spremanja recenzije:", error);
      alert("Došlo je do greške pri spremanju recenzije.");
    }
  };

  return (
    <div className="parent-container">
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
      <div
        id="notification"
        className={`filter-notification ${showNotification ? "show" : ""}`}
      >
        {notificationMessage}
      </div>
      <div className="user-profile">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="Profile"
          className="profile-icon"
          onClick={toggleDropdown}
        />
        <span className="user-name" onClick={toggleDropdown}>
          {user.ime} {user.prezime[0]}.
        </span>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate("/profile")}>Profil</button>
            <button onClick={() => navigate(`/requests/${user.id}`)}>
              Zahtjevi
            </button>
            {user.uloga === "Učitelj" && (
              <button onClick={() => navigate(`/calendar/${user.id}`)}>
                Kalendar
              </button>
            )}
          </div>
        )}
      </div>
      <div className="container">
        <div className="text">Moje lekcije</div>
        <div className="underline"></div>
        <div className="main-content">
          {predavanja.length > 0 ? (
            predavanja.map((predavanje) => (
              <div key={predavanje.predavanjeId} className="lection">
                {user.uloga === "Učenik" ? (
                  <>
                    <div className="left">
                      <p>
                        <strong>Učitelj:</strong> {predavanje.uciteljIme}{" "}
                        {predavanje.uciteljPrezime}
                      </p>
                      <p>
                        <strong>Vrijeme početka:</strong>{" "}
                        {formatDate(predavanje.datumVrijemePocetka)}
                      </p>
                    </div>
                    <div className="right">
                      {hasRecenzija(predavanje.predavanjeId) ? (
                        <>
                          <p className="recenzija-status">
                            Recenzija ostavljena
                          </p>
                          <button
                            onClick={() =>
                              handleOpenMaterialModal(predavanje.predavanjeId)
                            }
                          >
                            Prikaz materijala
                          </button>
                          {materialModalVisible && (
                            <div className="modal-material">
                              <div className="modal-material-content">
                                <h2>Materijali</h2>
                                {selectedMaterial ? (
                                  <p>
                                    Link na materijal:{" "}
                                    <a
                                      href={selectedMaterial}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {selectedMaterial}
                                    </a>
                                  </p>
                                ) : (
                                  <p>Materijal nije dostupan.</p>
                                )}
                                <button onClick={handleCloseMaterialModal}>
                                  Zatvori
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenModal(predavanje)}
                            className="review-button"
                          >
                            Napiši recenziju
                          </button>
                          <button
                            onClick={() =>
                              handleOpenMaterialModal(predavanje.predavanjeId)
                            }
                          >
                            Prikaz materijala
                          </button>

                          {materialModalVisible && (
                            <div className="modal-material">
                              <div className="modal-material-content">
                                <h2>Materijali</h2>
                                {selectedMaterial ? (
                                  <p>
                                    Link na materijal:{" "}
                                    <a
                                      href={selectedMaterial}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {selectedMaterial}
                                    </a>
                                  </p>
                                ) : (
                                  <p>Materijal nije dostupan.</p>
                                )}
                                <button onClick={handleCloseMaterialModal}>
                                  Zatvori
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="left">
                      <p>
                        <strong>Učenik:</strong> {predavanje.ucenikIme}{" "}
                        {predavanje.ucenikPrezime}
                      </p>
                      <p>
                        <strong>Vrijeme početka:</strong>{" "}
                        {formatDate(predavanje.datumVrijemePocetka)}
                      </p>
                    </div>
                    <div className="right">
                      <button onClick={() => handleOpenUploadModal(predavanje)}>
                        Upload lekcije
                      </button>
                      <button
                        onClick={() =>
                          handleOpenMaterialModal(predavanje.predavanjeId)
                        }
                      >
                        Prikaz materijala
                      </button>
                    </div>
                    {uploadModalVisible && (
                      <div className="modal-overlay">
                        <div className="modal-upload-content">
                          <h2>Dodaj materijale</h2>
                          <div className="modal-upload-body">
                            <label>Link na video materijale:</label>
                            <input
                              type="text"
                              value={linkMaterijala}
                              onChange={(e) =>
                                setLinkMaterijala(e.target.value)
                              }
                              placeholder="Unesite link ovdje..."
                            />
                          </div>
                          <div className="modal-upload-actions">
                            <button onClick={handleUploadMaterijala}>
                              Spremi
                            </button>
                            <button onClick={handleCloseUploadModal}>
                              Zatvori
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {materialModalVisible && (
                      <div className="modal-material">
                        <div className="modal-material-content">
                          <h2>Materijali</h2>
                          {selectedMaterial ? (
                            <p>
                              Link na materijal:{" "}
                              <a
                                href={selectedMaterial}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedMaterial}
                              </a>
                            </p>
                          ) : (
                            <p>Materijal nije dostupan.</p>
                          )}
                          <button onClick={handleCloseMaterialModal}>
                            Zatvori
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nemate predavanja u prošlosti.</p>
          )}
          {modalVisible && user.uloga === "Učenik" && (
            <div className="modal-lecture">
              <div className="modal-lecture-content">
                <h2>Ostavite recenziju</h2>
                <div className="modal-lecture-body">
                  <label>Ocjena:</label>
                  <div className="rating-container">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={`star ${
                          value <= (hoverOcjena || ocjena) ? "filled" : ""
                        }`}
                        onClick={() => setOcjena(value)}
                        onMouseEnter={() => setHoverOcjena(value)}
                        onMouseLeave={() => setHoverOcjena(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <label>Komentar:</label>
                  <textarea
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    placeholder="Ostavite komentar ovdje..."
                  />
                </div>
                <div className="modal-lecture-actions">
                  <button onClick={handleSubmitReview}>Spremi</button>
                  <button onClick={handleCloseModal}>Zatvori</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lections;

