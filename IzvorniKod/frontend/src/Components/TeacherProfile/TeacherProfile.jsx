import React, { useEffect, useState } from "react";
import "./TeacherProfile.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo_icon from "../Assets/logo-prototip3.png";
import { useUser } from "../../UserContext";


const TeacherProfile = () => {
  const backend = "http://lingualink-backend-better:8080";
  const { teacherId } = useParams(); //izvlacimo teacherId iz url-a
  const navigate = useNavigate();
  const location = useLocation();
  const [teacher, setTeacher] = useState({
    ime: "",
    prezime: "",
    email: "",
    uloga: "",
    languagesTeach: [{ language: "" }],
    stilPoducavanja: "",
    iskustvo: "",
    qualifications: [{ kvalifikacije: "" }],
    satnica: "",
  });
  const { user, setUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  

  //dohvat podataka o ucitelju prilikom prvog ucitavanja stranice
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        const response = await axios.get(`${backend}/ucitelj/${teacherId}`);

        if (response.status === 200) {
          const rawData = response.data;
          const firstJson = rawData.split("}{")[0] + "}";

          const data = JSON.parse(firstJson);
          let {
            ime,
            prezime,
            email,
            uloga,
            languagesTeach,
            stilPoducavanja,
            iskustvo,
            qualifications,
            satnica,
          } = data; // iz odgovora uzimamo navedene varijable
          console.log(data);
          if (languagesTeach) {
            console.log(languagesTeach);
            languagesTeach = languagesTeach.map((entry) => {
              return {
                jezik_id: entry.jezik_id,
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
          setTeacher({
            ime: ime || "",
            prezime: prezime || "",
            email: email || "",
            uloga: uloga || "",
            languagesTeach: languagesTeach || [],
            stilPoducavanja: stilPoducavanja || "",
            iskustvo: iskustvo || "",
            qualifications: qualifications || [],
            satnica: satnica || "",
          });
          console.log(teacher);
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja profila učitelja.");
        navigate("/login");
      }
    };

    fetchTeacherProfile();
  }, [location, navigate]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <div className="profile-page">
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
            <button onClick={() => navigate(`/lections/${user.id}`)}>Lekcije</button>
          </div>
        )}
      </div>
      <div className="profile-sidebar">
        <div className="profile-podaci">
          <span>Osobni podaci</span>
          <p>
            <strong>Ime:</strong> {teacher.ime}
          </p>
          <p>
            <strong>Prezime:</strong> {teacher.prezime}
          </p>
          <p>
            <strong>Email:</strong> {teacher.email}
          </p>
          <p>
            <strong>Uloga:</strong> {teacher.uloga}
          </p>
          <button className="recenzije-button" onClick={() => 
            navigate(`/ratings/${teacherId}`)}>⭐ Recenzije učenika</button>
        </div>

        <div className="profile-jezici">
          <span>Jezici koje podučavam</span>
          {teacher.languagesTeach && teacher.languagesTeach.length > 0 ? (
            <ul>
              {teacher.languagesTeach.map((lang, index) => (
                <li key={index || lang.jezik_id}>
                  {lang.language || lang.nazivJezika}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nema unesenih podataka o jezicima.</p>
          )}

          <span>Iskustvo</span>
          <p>{teacher.iskustvo || "Nema unesenih podataka o iskustvu."}</p>

          <span>Kvalifikacije</span>
          {teacher.qualifications && teacher.qualifications.length > 0 ? (
            <ul>
              {teacher.qualifications.map((item, index) => (
                <li key={index}>{item.kvalifikacije === "Izvorni_govornik" ? "Izvorni govornik" : item.kvalifikacije}</li>
              ))}
            </ul>
          ) : (
            <p>Nema unesenih podataka o kvalifikacijama.</p>
          )}

          <span>Stil podučavanja</span>
          <p>
            {teacher.stilPoducavanja ||
              "Nema unesenih podataka o stilu podučavanja."}
          </p>

          <span>Satnica</span>
          <p>
            {teacher.satnica
              ? `${teacher.satnica}€/h`
              : "Nema unesenih podataka o satnici."}
          </p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-imagetext">
          <img
            src={
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={`${teacher.ime}'s profile`}
            className="profile-picture-large"
          />
          <h1 className="profile-name">{teacher.ime}</h1>
          <h1 className="profile-surname">{teacher.prezime}</h1>
        </div>
        <div className="buttons">
          <div className="edit-button">
            <button
              className="calendar-button"
              onClick={() => navigate(`/calendar/${teacherId}`)}
            >
              Prikaz kalendara
            </button>
          </div>
          <div className="profile-buttons">
            <button
              className="teachers-button"
              onClick={() => navigate("/teachers")}
            >
              Prikaz učitelja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
