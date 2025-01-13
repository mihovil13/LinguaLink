import React, { useState, useRef, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";
import axios from "axios";
import Modal from "react-modal";
import { useUser } from "../../UserContext";
const BACKEND = "http://localhost:8080";

Modal.setAppElement("#root");
// Funkcija za pronalazak prvog dana trenutnog mjeseca
const getFirstDayOfCurrentMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1); // Prvi dan trenutnog mjeseca
};

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [currentDate, setCurrentDate] = useState(getFirstDayOfCurrentMonth());
  const [selectedTime, setSelectedTime] = useState(null); // Odabrano vrijeme
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const calendarRef = useRef(null);

  var user = useUser();
  console.log(user);
  useEffect(() => {
    fetchReservedLessons(); // Dohvati termine prilikom učitavanja komponente
  }, []);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token") || localStorage.getItem("token");

        const response = await axios.get(`${BACKEND}/ucitelj/8`);

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
      }
    };

    fetchTeacherProfile();
  }, []);

  const fetchReservedLessons = async () => {
    try {
      const teacherId = 8; // Ovdje zamijenite s odgovarajućim ID-om učitelja
      const response = await axios.get(
        BACKEND + `/api/dohvati-predavanja/${teacherId}`
      );
      if (response.status === 200) {
        const events = response.data.map((lesson) => ({
          id: lesson.predavanjeId,
          title: "Rezervirano",
          start: lesson.datumVrijemePocetka,
          backgroundColor: "#ff0000", // Crvena boja za zauzete termine
        }));

        // Dodaj događaje u kalendar
        const calendarApi = calendarRef.current.getApi();
        events.forEach((event) => calendarApi.addEvent(event));
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja predavanja:", error);
      alert("Došlo je do greške prilikom dohvaćanja predavanja.");
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(1, 0, 0, 0);
    console.log("Kliknuti " + clickedDate);
    console.log("Danasnji " + today);

    if (clickedDate >= today) {
      setSelectedDate(info.dateStr);

      const allTimes = ["09:15", "09:30", "10:15", "10:45", "11:15", "15:00"]; // Svi potencijalni termini

      if (clickedDate.getTime() === today.getTime()) {
        // Ako je odabrani datum današnji, filtriraj termine prema trenutnom vremenu
        const now = new Date();
        const filteredTimes = allTimes.filter((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const termTime = new Date();
          termTime.setHours(hours, minutes, 0, 0);
          return termTime > now; // Zadrži samo termine u budućnosti
        });
        setAvailableTimes(filteredTimes);
      } else {
        // Ako nije današnji datum, prikazuj sve termine
        setAvailableTimes(allTimes);
      }
    }
  };

  const confirmReservation = async () => {
    if (selectedDate && selectedTime) {
      const calendarApi = calendarRef.current.getApi();
      const predavanjeData = {
        ucenik: {
          user_id: user.user_id, // ID učenika (možete ga zamijeniti dinamičkim ID-om)
        },
        ucitelj: {
          user_id: 1, // ID učitelja (možete ga zamijeniti dinamičkim ID-om)
        },
        datumVrijemePocetka: `${selectedDate}T${selectedTime}:00`, // Datum i vrijeme u ISO formatu
      };

      try {
        const response = await axios.post(
          BACKEND + "/api/zabiljezi-predavanje",
          predavanjeData
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Predavanje uspješno spremljeno:", response.data);
          alert("Rezervacija je uspješno spremljena!");

          // Dodavanje događaja u kalendar
          calendarApi.addEvent({
            title: `Rezervirano: ${selectedTime}`,
            start: `${selectedDate}T${selectedTime}:00`,
            allDay: false,
            backgroundColor: "#613c78", // Boja za označavanje rezervacije
          });

          // Uklanjanje rezerviranog termina iz dostupnih termina
          setAvailableTimes((prevTimes) =>
            prevTimes.filter((time) => time !== selectedTime)
          );

          // Zatvaranje modala
          setIsModalOpen(false);
        } else {
          throw new Error("Greška prilikom spremanja predavanja.");
        }
      } catch (error) {
        console.error("Greška prilikom slanja zahtjeva:", error);
        alert("Došlo je do greške prilikom spremanja rezervacije.");
      }
    }
  };

  const handleDatesSet = (dateInfo) => {
    const newCurrentDate = new Date(dateInfo.view.currentStart);
    if (newCurrentDate.getTime() !== currentDate.getTime()) {
      setCurrentDate(newCurrentDate);
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time); // Postavlja odabrano vrijeme
    setIsModalOpen(true); // Otvara modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Zatvara modal
  };

  return (
    <div>
      <Fullcalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        initialDate={new Date().toISOString().split("T")[0]} // Prikazuje današnji mjesec
        headerToolbar={{
          start: "today", // Onemogućavanje "Prev" za trenutni mjesec
          center: "title",
          end:
            currentDate.getMonth() === new Date().getMonth()
              ? "next"
              : "prev,next",
        }}
        validRange={{
          start: getFirstDayOfCurrentMonth().toISOString().split("T")[0], // Prikaz počinje od trenutnog mjeseca
        }}
        datesSet={handleDatesSet} // Postavlja trenutno prikazani mjesec
        dateClick={handleDateClick}
        height={"70vh"}
        dayCellClassNames={(info) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const cellDate = new Date(info.date);
          const firstDayOfMonth = getFirstDayOfCurrentMonth();

          if (cellDate < firstDayOfMonth) {
            return "fc-past-date"; // Transparentne ćelije za datume iz prethodnog mjeseca
          } else if (cellDate < today) {
            return "fc-past-date"; // Prošli datumi unutar mjeseca
          }
          return ""; // Ostali datumi
        }}
      />

      <div className="timeslots">
        {selectedDate && (
          <div style={{ border: "1px solid #613c78" }}>
            <h3>Dostupni termini za {selectedDate}:</h3>
            <div className="times">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)} // Otvara modal na klik
                  className="time-button"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal za potvrdu rezervacije */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="modal">
          <div className="title">
            <h3>Potvrda rezervacije</h3>
          </div>
          <div className="text">
            <p>Želite li potvrditi rezervaciju?</p>
          </div>
          <div className="terminTime">
            {selectedDate && selectedTime && (
              <p className="selected-datetime">
                Datum: {selectedDate}, Vrijeme: {selectedTime}
              </p>
            )}
          </div>
          <div className="modal-actions">
            <button className="confirm-button" onClick={confirmReservation}>
              Potvrdi
            </button>
            <button className="cancel-button" onClick={closeModal}>
              Odustani
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Calendar;
