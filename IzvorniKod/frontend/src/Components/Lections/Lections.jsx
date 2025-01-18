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
  const [ocjena, setOcjena] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoverOcjena, setHoverOcjena] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const navigate = useNavigate();

  const fetchPredavanja = async () => {
    if (!user.id) {
      navigate("/");
      return;
    }

    try {
      const apiUrl =
        user.uloga === "Učenik"
          ? `${backend}/api/dohvati-predavanja-ucenik/${user.id}`
          : `${backend}/api/dohvati-predavanja/${user.id}`;
      const response = await axios.get(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const currentTime = new Date().getTime();
        const filteredPredavanja = response.data.filter((predavanje) => {
          const vrijemePocetka = new Date(
            predavanje.datumVrijemePocetka
          ).getTime();
          return vrijemePocetka < currentTime && predavanje.potvrdeno === 1;
        });

        setPredavanja(filteredPredavanja);

        const recenzijeUrl = user.uloga === "Učenik"
        ? `${backend}/api/recenzije-ucenik/${user.id}`
        : `${backend}/api/recenzije/${user.id}`;

        const recenzijeResponse = await axios.get(
          `${backend}/api/recenzije-ucenik/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
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

      setUser({});
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
      alert("Došlo je do greške prilikom odjave.");
    }
  };

  return (
    <div className="parent-container">
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
      <div id="notification" className={`filter-notification ${showNotification ? 'show' : ''}`}>
        Recenzija uspješno spremljena!
      </div>
      <div className="user-profile">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="Profile"
          className="profile-icon"
          onClick={toggleDropdown}
        />
        <span
          className="user-name"
          onClick={toggleDropdown}
        >
          {user.ime} {user.prezime[0]}.
        </span>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate("/profile")}>Profil</button>
            <button onClick={() => navigate(`/requests/${user.id}`)}>Zahtjevi</button>
            {user.uloga === "Učitelj" && (
              <button onClick={() => navigate(`/calendar/${user.id}`)}>Kalendar</button>
            )}
            <button onClick={handleLogout}>Odjava</button>
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
                        <strong>Učitelj:</strong> {predavanje.uciteljIme} {" "}
                        {predavanje.uciteljPrezime}
                      </p>
                      <p>
                        <strong>Vrijeme početka:</strong> {formatDate(predavanje.datumVrijemePocetka)}
                      </p>
                    </div>
                    <div className="right">
                      {hasRecenzija(predavanje.predavanjeId) ? (
                        <>
                        <p className="recenzija-status">Recenzija ostavljena</p>
                        <button>
                          Prikaz materijala
                        </button>

                        </>
                      ) : (
                        <>
                        <button
                          onClick={() => handleOpenModal(predavanje)}
                          className="review-button"
                        >
                          Napiši recenziju
                        </button>
                        <button>
                          Prikaz materijala
                        </button>
                      </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="left">
                      <p>
                        <strong>Učenik:</strong> {predavanje.ucenikIme} {" "}
                        {predavanje.ucenikPrezime}
                      </p>
                      <p>
                        <strong>Vrijeme početka:</strong> {formatDate(predavanje.datumVrijemePocetka)}
                      </p>
                    </div>
                    <div className="right">
                        <button>
                          Upload lekcije
                        </button>
                        <button>
                          Prikaz materijala
                        </button>
                    </div>
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
                      className={`star ${value <= (hoverOcjena || ocjena) ? "filled" : ""}`}
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

