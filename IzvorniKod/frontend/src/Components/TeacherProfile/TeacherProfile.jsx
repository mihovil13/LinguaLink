import React, { useEffect, useState } from "react";
import "./TeacherProfile.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherProfile = () => {
  const backend = "http://localhost:8080/";
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

  //dohvat podataka o ucitelju prilikom prvog ucitavanja stranice
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        if (token) {
          console.log("Token dobar");
          localStorage.setItem("token", token);
          const response = await axios.get(
            `${backend}ucitelj/${teacherId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                // slanje upita prema backendu, u headerima se salje token
              },
            }
          );

          if (response.status === 200) {
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
            } = response.data; // iz odgovora uzimamo navedene varijable
            console.log(response.data);
            if (languagesTeach) {
              languagesTeach = languagesTeach.split(", ").map((entry) => {
                return { language: entry.trim() };
              });
            }
            if (qualifications) {
              qualifications = qualifications.split(", ").map((entry) => {
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
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        alert("Došlo je do greške prilikom dohvaćanja profila učitelja.");
        navigate("/login");
      }
    };

    fetchTeacherProfile();
  }, [location, navigate]);

  return (
    <div className="profile-page">
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
        </div>

        <div className="profile-jezici">
          <span>Jezici koje podučavam</span>
          {teacher.languagesTeach && teacher.languagesTeach.length > 0 ? (
            <ul>
              {teacher.languagesTeach.map((lang, index) => (
                <li key={index}>{lang.language}</li>
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
                <li key={index}>{item.kvalifikacije}</li>
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
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-teacher-vector.jpg"
            }
            alt={`${teacher.ime}'s profile`}
            className="profile-picture-large"
          />
          <h1 className="profile-name">{teacher.ime}</h1>
          <h1 className="profile-surname">{teacher.prezime}</h1>
        </div>
        <div className="buttons">
          <div className="edit-button">
            <button className="calendar-button" onClick={() => navigate(``)}>
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
