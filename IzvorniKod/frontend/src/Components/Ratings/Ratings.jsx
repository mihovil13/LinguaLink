import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../UserContext";
import logo_icon from "../Assets/logo-prototip3.png";
import "./Ratings.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const backend = "http://localhost:8080";

const Ratings = () => {
  const { user, setUser } = useUser();
  const { teacherId } = useParams();
  const [recenzije, setRecenzije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : ""}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="parent-container">
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
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
            <button onClick={() => navigate(`/lections/${user.id}`)}>Lekcije</button>
          </div>
        )}
      </div>

      <div className="container">
        <footer>
          <div className="text">Recenzije učenika</div>
          <div className="underline"></div>
        </footer>
        <div className="main-content"></div>
        {recenzije.length > 0 ? (
          recenzije.map((recenzija) => (
            <div key={recenzija.predavanje_id} className="rating">
              <div className="left">
                <p>
                  <strong>Učenik:</strong> {recenzija.ime}{" "}
                  {recenzija.prezime}
                </p>
              </div>
              <div className="comment-box">
                <p>
                  <strong>Ocjena: </strong>
                  <span className="stars">{renderStars(recenzija.ocjena)}</span>
                </p>
                <p>
                  <strong>Komentar: </strong> 
                  "{recenzija.komentar}"
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Trenutno nema recenzija za učitelja.</p>
        )}
      </div>
    </div>
  );
};

export default Ratings;
