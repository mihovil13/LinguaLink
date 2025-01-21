import React, { useEffect, useState } from "react";
import "./TeacherList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo_icon from "../Assets/logo-prototip3.png";
import { useUser } from "../../UserContext";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [styleFilters, setStyleFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [minHourlyRate, setMinHourlyRate] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState("");
  const [qualificationFilters, setQualificationfilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const backend = "http://localhost:8080";

  const styles = [
    "Vizualni",
    "Auditorni",
    "Taktilni",
    "Kinestetički",
    "Analitički",
    "Globalni",
    "Refleksivni",
    "Impulzivni",
  ];

  const default_profile_picture = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";


  const languages = [
    "Engleski",
    "Njemački",
    "Francuski",
    "Španjolski",
    "Talijanski",
    "Portugalski",
    "Ruski",
    "Hindi",
    "Arapski",
    "Mandarinski",
    "Japanski",
  ];

  const qualifications = ["Profesor", "Izvorni govornik", "Certifikat"];
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchTeacherData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/teachers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          const teachersData = response.data.map((teacher) => ({
            ...teacher,
            slika: teacher.slika==null ? "data:image/png;base64," : "data:image/png;base64," + teacher.slika,
            languagesTeach: teacher.languagesTeach
              ? teacher.languagesTeach.map((lang) => lang.nazivJezika.trim())
              : [],
            qualifications: teacher.qualifications
              ? teacher.qualifications.map((qualification) =>
                  qualification.trim()
                )
              : [],
          }));

          

          const filteredByUserLanguages =
            user.id && user.languagesToLearn.length > 0
              ? teachersData.filter((teacher) =>
                  teacher.languagesTeach.some((lang) =>
                    user.languagesToLearn
                      .map((l) => l.nazivJezika.trim())
                      .includes(lang)
                  )
                )
              : teachersData;

          console.log(teachersData);

          setTeachers(teachersData);
          setFilteredTeachers(filteredByUserLanguages);

          if (user.languagesToLearn.length > 0) {
            const userLanguages = user.languagesToLearn.map((l) =>
              l.nazivJezika.trim()
            );
            setLanguageFilters(userLanguages);
          }
        }
      } catch (error) {
        console.error("Error fetching teacher list:", error);
      }
    };

    fetchTeacherData();
  }, [user]);

  const applyFilters = () => {
    if (maxHourlyRate && parseFloat(minHourlyRate) > parseFloat(maxHourlyRate)) {
      setMinHourlyRate("");
      showErrorMessage();
      return;
    }
    const filtered = teachers.filter((teacher) => {
      const matchesLanguage =
        languageFilters.length === 0 ||
        teacher.languagesTeach.some((lang) => languageFilters.includes(lang));

      const matchesStyle =
        styleFilters.length === 0 ||
        styleFilters.includes(teacher.stilPoducavanja);

      const matchesQualification =
        qualificationFilters.length === 0 ||
        qualificationFilters.some((qualification) =>
          teacher.qualifications.includes(qualification)
        );

      const matchesHourlyRate =
        (!minHourlyRate && !maxHourlyRate) || //ako nisu postavljeni filteri za satnicu, nema filtriranja
        (teacher.satnica !== null && //provjera da satnica ucitelja nije null
          (!minHourlyRate || teacher.satnica >= Number(minHourlyRate)) &&
          (!maxHourlyRate || teacher.satnica <= Number(maxHourlyRate)));

      return (
        matchesLanguage &&
        matchesStyle &&
        matchesQualification &&
        matchesHourlyRate
      );
    });

    setFilteredTeachers(filtered);
    setFiltersApplied(true);

    const notification = document.querySelector(".filter-notification");
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  };

  const clearFilters = () => {
    setLanguageFilters([]);
    setStyleFilters([]);
    setQualificationfilters([]);
    setMinHourlyRate("");
    setMaxHourlyRate("");
    setFilteredTeachers(teachers);
    setFiltersApplied(false);
  };

  const showErrorMessage = () => {
    const notification = document.querySelector(".error-message");
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  };

  const handleLanguageFilterChange = (language) => {
    setLanguageFilters((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );
  };

  const handleStyleFilterChange = (style) => {
    setStyleFilters((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleQualificationFilterChange = (qualification) => {
    setQualificationfilters((prev) =>
      prev.includes(qualification)
        ? prev.filter((q) => q !== qualification)
        : [...prev, qualification]
    );
  };

  //uvjet, value mora biti broj i vrijednost mora biti veca ili jednaka 0
  const handleMinHourlyRateChange = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      setMinHourlyRate(""); // Ako unos nije  broj, resetira na prazan string
      return;
    }

    if (Number(value) < 0) {
      setMinHourlyRate("");
      return;
    }

    setMinHourlyRate(value);
  };

  const handleMaxHourlyRateChange = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      setMaxHourlyRate(""); // ako unos nije  broj, resetira na prazan string
      return;
    }

    // Provjera za negativne brojeve
    if (Number(value) < 0) {
      setMaxHourlyRate("");
      return;
    }

    setMaxHourlyRate(value);
  };

  const handleTeacherClick = (teacherId) => {
    navigate(`/teacher/${teacherId}`);
  };

  return (
    <div
      className={`parent-container ${isLoggedIn ? "logged-in" : "logged-out"}`}
    >
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>

      {user.uloga === "Učenik" && (
        <div className="user-profile">
          <img
            src={user.slika === "data:image/png;base64," ? default_profile_picture : user.slika}
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
              <button onClick={() => navigate(`/lections/${user.id}`)}>
                Lekcije
              </button>
            </div>
          )}
        </div>
      )}

      <div className="filter-notification">Filtri primijenjeni</div>
      <div className="error-message">Minimalna satnica ne može biti veća od maksimalne satnice.</div>

      <div className="container">
        <footer>
          <div className="text">Lista učitelja</div>
          <div className="underline"></div>
        </footer>
        <div className="main-content">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, index) => (
              <div
                className="teacher-container"
                key={index}
                onClick={() => handleTeacherClick(teacher.user_id)}
              >
                <img
                  src={teacher.slika === "data:image/png;base64," ? default_profile_picture : teacher.slika}
                  alt=""
                />
                <div className="teacher-info">
                  <p>
                    {teacher.ime} {teacher.prezime}
                  </p>
                </div>
                <div className="teacher-languages">
                  <p>{teacher.languagesTeach.join(", ")}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">
              Nema dostupnih učitelja prema odabranim filtrima.
            </p>
          )}
        </div>
      </div>

      {user.id && (
        <div className="filter-container">
          <footer>
            <div className="text">Filtriranje učitelja</div>
            <div className="underline"></div>
          </footer>

          <div className="filters">
            <div className="filter-group">
              <label>Filtriraj po jezicima:</label>
              <div className="filter-options">
                {languages.map((language, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={languageFilters.includes(language)}
                      onChange={() => handleLanguageFilterChange(language)}
                    />
                    {language}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Filtriraj po stilu učenja:</label>
              <div className="filter-options">
                {styles.map((style, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={styleFilters.includes(style)}
                      onChange={() => handleStyleFilterChange(style)}
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Filtriraj po kvalifikacijama:</label>
              <div className="filter-options">
                {qualifications.map((qualification, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={qualificationFilters.includes(qualification)}
                      onChange={() =>
                        handleQualificationFilterChange(qualification)
                      }
                    />
                    {qualification}
                  </label>
                ))}
              </div>
              <div className="filter-group-satnica">
              <label>Filtriraj po satnici (€/h):</label>
              <div className="filter-options">
                <input
                  type="text"
                  placeholder="Min. satnica"
                  value={minHourlyRate}
                  onChange={(e) => handleMinHourlyRateChange(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Max. satnica"
                  value={maxHourlyRate}
                  onChange={(e) => handleMaxHourlyRateChange(e.target.value)}
                />
              </div>
            </div>
            </div>
          </div>
          <div className=" filter-buttons-list">
            <button onClick={applyFilters}>Primijeni filtre</button>
            <div className="clear-filters">
              <button onClick={clearFilters}>Poništi filtre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
