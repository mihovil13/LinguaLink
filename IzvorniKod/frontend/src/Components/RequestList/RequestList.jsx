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
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");


  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mjeseci su 0-indeksirani
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}.${month}.${year}., ${hours}:${minutes}`;
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
        setNotificationMessage("Zahtjev uspješno prihvaćen! 🎉");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      
        setRequests((prev) =>
          prev.map((request) =>
            request.predavanjeId === id
              ? { ...request, potvrdeno: 1 }
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
        setNotificationMessage("Zahtjev uspješno odbijen! 🚫");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      
        setRequests((prev) =>
          prev.filter((request) => request.predavanjeId !== id)
        );
      }
       else {
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
    const statusClass =
      status === 1 ? "status-accepted" : status === -1 ? "status-rejected" : "status-pending";
    return <span className={statusClass}>{status === 1 ? "Prihvaćen" : status === -1 ? "Odbijen" : "Nepotvrđen"}</span>;
  };
  

  if (loading) {
    return <p>Učitavanje zahtjeva...</p>;
  }

  return (
    <div className="parent-container">
      <div id="notification" className={`filter-notification ${showNotification ? 'show' : ''}`}>
      {notificationMessage}
      </div>
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
                  <strong>
                    {user.uloga === "Učenik"
                      ? `${request.uciteljIme} ${request.uciteljPrezime}`
                      : `${request.ucenikIme} ${request.ucenikPrezime}`}
                  </strong>
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
                    <p>Status: {renderStatus(request.potvrdeno)}</p>
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
