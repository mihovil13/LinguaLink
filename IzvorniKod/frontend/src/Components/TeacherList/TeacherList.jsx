import React, { useEffect, useState } from "react";
import "./TeacherList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [styleFilters, setStyleFilters] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [qualificationFilters, setQualificationfilters] = useState([]);
  const navigate = useNavigate();
  const {user} = useUser();

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
          console.log(response.data);
          //languagesTeach/qualifications podatak se iz backenda vraca kao string
          //ovom funkcijom pretvaramo taj podatak u polje
          const teachersData = response.data.map((teacher) => ({
            ...teacher,
            languagesTeach: teacher.languagesTeach
              ? teacher.languagesTeach.map((lang) => lang.nazivJezika.trim())
              : [], // Pretvorba jezika u niz,
            qualifications: teacher.qualifications
              ? teacher.qualifications
                  .map((qualification) => qualification.trim())
              : [],
          }));

        //ako je korisnik prijavljen, filtriraj učitelje prema njegovim jezicima
        const filteredByUserLanguages = isLoggedIn
          ? teachersData.filter((teacher) =>
              teacher.languagesTeach.some((lang) =>
                user.languagesToLearn
                  .map((l) => l.nazivJezika.trim())
                  .includes(lang)
              )
            )
          : teachersData; // ako korisnik nije prijavljen, prikazujemo sve

          setTeachers(filteredByUserLanguages);
          setFilteredTeachers(filteredByUserLanguages);
        }
      } catch (error) {
        console.error("Error fetching teacher list:", error);
        // alert("Došlo je do greške prilikom dohvaćanja liste učitelja.");
      }
    };

    fetchTeacherData();
  }, []);

  const applyFilters = () => {
    const filtered = teachers.filter((teacher) => {
      //uzimamo ucitelje koji u svom polju jezika koje poducavaju imaju neki od jezika iz filtra
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

      //vracamo ucitelje koji ispunjavaju oba filter uvjeta
      return matchesLanguage && matchesStyle && matchesQualification;
    });

    setFilteredTeachers(filtered); //update liste filtriranih ucitelja
    setFiltersApplied(true);

    //prikaz oblacica s porukom
    const notification = document.querySelector(".filter-notification");
    notification.classList.add("show");

    //skrivanje oblacica
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  };

  const clearFilters = () => {
    //reset svih filtera
    setLanguageFilters([]);
    setStyleFilters([]);
    setQualificationfilters([]);
    setFilteredTeachers(teachers);
    setFiltersApplied(false);

   
      //resetiraj na učitelje koji podučavaju jezike iz user.languagesToLearn
      const filteredByUserLanguages = teachers.filter((teacher) =>
        teacher.languagesTeach.some((lang) =>
          user.languagesToLearn
            .map((l) => l.nazivJezika.trim())
            .includes(lang)
        )
      );
      setFilteredTeachers(filteredByUserLanguages);
  };

  //funkcija za izmjenu filtra jezika
  const handleLanguageFilterChange = (language) => {
    //prev = trenutno stanje polja filtriranih jezika
    setLanguageFilters((prev) =>
      prev.includes(language)
        ? //ako polje prev sadrži jezik ciji smo checkbox upravo izmijenili, to znaci da ga korisnik želi maknuti iz polja jezika po kojima filtriramo
          prev.filter((lang) => lang !== language)
        : //ako polje prev ne sadrži jezik ciji smo checkbox izmijenili, to znaci da ga korisnik zeli dodati u polje jezika po kojima filtriramo
          [...prev, language]
    );
  };

  //unkcija za izmjenu filtra po stilu učenja, radi na istom principu kao gornja funkcija za filter jezika
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
    navigate(`/teacher/${teacherId}`)
  }

  return (
    <div
      className={`parent-container ${isLoggedIn ? "logged-in" : "logged-out"}`}
    >
      <div className="filter-notification">Filtri primijenjeni</div>

      <div className="container">
        <footer>
          <div className="text">Lista učitelja</div>
          <div className="underline"></div>
        </footer>
        <div className="main-content">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, index) => (
              <div className="teacher-container" key={index}
              onClick={() => handleTeacherClick(teacher.user_id)}>
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
