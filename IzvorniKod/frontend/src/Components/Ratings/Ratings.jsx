import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import logo_icon from "../Assets/logo-prototip3.png";
import "./Ratings.css";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";

const backend = "http://localhost:8080";

const Ratings = () => {
  const { user } = useUser();
  const { teacherId } = useParams();
  const [recenzije, setRecenzije] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecenzije = async () => {
      if (!user.id) {
        console.error("Korisnik nije prijavljen.");
        return;
      }

      try {
        const response = await axios.get(
          `${backend}/api/recenzije/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
            console.log("recenzije", response.data);
          setRecenzije(response.data);
        } else {
          console.error("Greška prilikom dohvaćanja recenzija.");
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja recenzija:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecenzije();
  }, [user, navigate]);

  if (loading) {
    return <p>Učitavanje recenzija...</p>;
  }

  return (
    <div className="parent-container">
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>

      <div className="container">
        <div className="text">Recenzije učenika</div>
        <div className="underline"></div>
        <div className="main-content"></div>
        {recenzije.length > 0 ? (
          recenzije.map((recenzija) => (
            <div key={recenzija.predavanje_id} className="rating">
              <div className="left">
                <p>
                  <strong>Ocjena:</strong> {recenzija.ocjena} / 5
                </p>
                <p>
                  <strong>Učenik:</strong> {recenzija.ime}{" "}
                  {recenzija.prezime}
                </p>
              </div>
              <div className="right">
                <p>
                  <strong>Komentar:</strong> {recenzija.komentar}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Trenutno nema recenzija za ovog učitelja.</p>
        )}
      </div>
    </div>
  );
};

export default Ratings;
