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
  

  const handleLogout = async () => {
    try {
      const token = getToken();

      if (token) {
        // Poziv backendu za odjavu
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

      // Resetiranje korisničkih podataka
      setUser({});

      // Brisanje tokena iz localStorage
      localStorage.removeItem("token");

      // Preusmjeravanje na glavnu stranicu
      navigate("/");
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
      alert("Došlo je do greške prilikom odjave.");
    }
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
            token && user.languagesToLearn.length > 0
              ? teachersData.filter((teacher) =>
                  teacher.languagesTeach.some((lang) =>
                    user.languagesToLearn
                      .map((l) => l.nazivJezika.trim())
                      .includes(lang)
                  )
                )
              : teachersData;

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

      return matchesLanguage && matchesStyle && matchesQualification;
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
    setFilteredTeachers(teachers);
    setFiltersApplied(false);
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

      {isLoggedIn && (
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
              <button onClick={handleLogout}>Odjava</button>
            </div>
          )}
        </div>
      )}

      <div className="filter-notification">Filtri primijenjeni</div>

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
                  src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
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

      {isLoggedIn && (
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
            </div>
          </div>
          <div className=" filter-buttons">
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
