import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import logo_icon from "../Assets/logo-prototip3.png";
import { useNavigate } from "react-router-dom";
import "./Lections.css";

const backend = "http://localhost:8080";

const Lections = () => {
  const { user } = useUser();
  const [predavanja, setPredavanja] = useState([]);
  const [recenzije, setRecenzije] = useState([]);
  const [selectedPredavanje, setSelectedPredavanje] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ocjena, setOcjena] = useState(1);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPredavanja = async () => {
    if (!user.id || user.uloga !== "Učenik") {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `${backend}/api/dohvati-predavanja-ucenik/${user.id}`,
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
          return vrijemePocetka < currentTime && predavanje.potvrdeno == 1;
        });

        setPredavanja(filteredPredavanja);

        const recenzijeResponse = await axios.get(
          `${backend}/api/recenzije-ucenik/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (recenzijeResponse.status === 200) {
          console.log("recenzije", recenzijeResponse.data);
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
    setOcjena(1);
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
        alert("Recenzija uspješno spremljena!");
        fetchPredavanja();
        handleCloseModal(); // Zatvori modal nakon što je recenzija spremljena
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

      <div className="container">
        <div className="text">Moja predavanja</div>
        <div className="underline"></div>
        <div className="main-content">
          {predavanja.length > 0 ? (
            predavanja.map((predavanje) => (
              <div key={predavanje.predavanjeId} className="lection">
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
                  {hasRecenzija(
                    predavanje.predavanjeId || predavanje.recenzijaOstavljena
                  ) ? (
                    <p className="recenzija-status">Recenzija ostavljena</p>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(predavanje)}
                      className="review-button"
                    >
                      Ostavi Recenziju
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nemate predavanja u prošlosti.</p>
          )}

          {modalVisible && (
            <div className="modal">
              <div className="modal-content">
                <h2>Ostavite recenziju</h2>
                <div className="modal-body">
                  <label>Ocjena (1-5):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ocjena}
                    onChange={(e) => setOcjena(Number(e.target.value))}
                  />
                  <label>Komentar:</label>
                  <textarea
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
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
