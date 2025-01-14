import React, { useEffect, useState } from "react";
import "./RequestList.css";
import { useUser } from "../../UserContext";
import logo_icon from "../Assets/logo-prototip3.png";
import axios from "axios";

const backend = "http://localhost:8080";

const RequestList = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const endpoint =
          user.uloga === "Učenik"
            ? `/api/dohvati-predavanja-ucenik/${user.id}`
            : `/api/dohvati-predavanja/${user.id}`;
        console.log("TOKEN: ", localStorage.getItem("token"));

        const response = await axios.get(`${backend}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          console.log("Response iz backenda", response.data);

          const currentTime = new Date().getTime();

          const filteredRequests =
            user.uloga === "Učenik"
              ? response.data.filter(
                  (req) =>
                    new Date(req.datumVrijemePocetka).getTime() >= currentTime
                )
              : response.data.filter((req) => req.potvrdeno !== -1);

          setRequests(filteredRequests);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja zahtjeva:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backend}/api/prihvati-predavanje/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Zahtjev uspješno prihvaćen! 🎉");
        setRequests((prev) =>
            prev.map((request) =>
              request.predavanjeId === id
                ? { ...request, potvrdeno: 1 } // Ažuriraj status u 'prihvaćeno'
                : request
            )
          );
      } else {
        alert(`Neočekivan odgovor: ${response.status}`);
      }
    } catch (error) {
      console.error("Greška prilikom prihvaćanja zahtjeva:", error);
      alert(
        "Došlo je do greške prilikom prihvaćanja zahtjeva. Pokušajte ponovno."
      );
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backend}/api/otkazi-predavanje/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ODGOVOR ODBIJANJA", response);

      if (response.status === 200) {
        alert("Zahtjev uspješno odbijen! 🚫");
        setRequests((prev) =>
          prev.filter((request) => request.predavanjeId !== id)
        );
      } else {
        alert(`Neočekivan odgovor: ${response.status}`);
      }
    } catch (error) {
      console.error("Greška prilikom odbijanja zahtjeva:", error);
      alert(
        "Došlo je do greške prilikom odbijanja zahtjeva. Pokušajte ponovno."
      );
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return "Prihvaćen";
      case -1:
        return "Odbijen";
      default:
        return "Nepotvrđen";
        break;
    }
  };

  if (loading) {
    return <p>Učitavanje zahtjeva...</p>;
  }

  return (
    <div className="parent-container">
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>

      <div className="container">
        <footer>
          <div className="text">Moji zahtjevi</div>
          <div className="underline"></div>
        </footer>
        <div className="main-content">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div className="request-container" key={request.predavanjeId}>
                <div className="left">
                  <p>
                    {user.uloga === "Učenik"
                      ? `${request.uciteljIme} ${request.uciteljPrezime}`
                      : `${request.ucenikIme} ${request.ucenikPrezime}`}
                  </p>
                  <p>
                    Datum i vrijeme: {formatDate(request.datumVrijemePocetka)}
                  </p>
                </div>
                <div className="right">
                  {user.uloga === "Učenik" ? (
                    <p>Status: {renderStatus(request.potvrdeno)}</p>
                  ) : request.potvrdeno === 0 ? (
                    <div className="actions">
                      <button
                        onClick={() => handleAccept(request.predavanjeId)}
                        className="accept-button"
                      >
                        Prihvati
                      </button>
                      <button
                        onClick={() => handleReject(request.predavanjeId)}
                        className="reject-button"
                      >
                        Odbij
                      </button>
                    </div>
                  ) : (
                    <p>Status: Prihvaćeno</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">Trenutno nemate aktivnih zahtjeva.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;
