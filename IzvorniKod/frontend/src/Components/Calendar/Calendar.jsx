import React, { useState, useRef, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";
import axios from "axios";
import Modal from "react-modal";
import { useUser } from "../../UserContext";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import logo_icon from "../Assets/logo-prototip3.png";

const backend = "http://localhost:8080";

Modal.setAppElement("#root");

const getToken = () => {
  return localStorage.getItem("token");
};

// Funkcija za pronalazak prvog dana trenutnog mjeseca
const getFirstDayOfCurrentMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1); // Prvi dan trenutnog mjeseca
};

const Calendar = () => {
  const { user } = useUser();
  const { teacherId } = useParams();
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(getFirstDayOfCurrentMonth());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservedLessons, setReservedLessons] = useState([]);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);


  useEffect(() => {
    fetchAvailableTimes();
  }, []);

  const fetchAvailableTimes = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${backend}/api/dohvati-predavanja/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("response");
        console.log(response.data);
        const filteredLessons = response.data.filter(
          (lesson) => lesson.potvrdeno !== -1
        );

        const events = filteredLessons.map((lesson) => ({
          id: lesson.predavanjeId,
          title:
            lesson.potvrdeno === 0
              ? "Nepotvrđeno"
              : lesson.potvrdeno === 1
              ? "Rezervirano"
              : "Slobodno",
          start: lesson.datumVrijemePocetka,
          backgroundColor:
            lesson.potvrdeno === 0
              ? "#ffc107"
              : lesson.potvrdeno === 1
              ? "#613c78"
              : "28a745",
        }));
        setReservedLessons(events);
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja predavanja:", error);
      alert("Provjeri konzolu");
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(1, 0, 0, 0);

    if (clickedDate >= today) {
      setSelectedDate(info.dateStr);

      const allTimes = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ];

      const reservedTimes = reservedLessons
        .filter((lesson) => lesson.start.startsWith(info.dateStr)) // provjeri rezervacije za odabrani datum
        .map((lesson) => {
          const time = new Date(lesson.start).toTimeString().slice(0, 5); // izvuci vrijeme u formatu HH:mm
          return time;
        });

      const availableTimes = allTimes.filter(
        (time) => !reservedTimes.includes(time)
      );

      // ako je odabrani datum danasnji, filtriraj termine prema trenutnom vremenu
      if (clickedDate.getTime() === today.getTime()) {
        const now = new Date();
        const filteredTimes = allTimes.filter((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const termTime = new Date();
          termTime.setHours(hours, minutes, 0, 0);
          return termTime > now; // zadrzi samo termine u buducnosti
        });
        setAvailableTimes(filteredTimes);
      } else {
        setAvailableTimes(availableTimes);
      }
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const confirmReservation = async () => {
    console.log(user.id);
    console.log(teacherId);
    if (selectedDate && selectedTime && user.id !== teacherId) {
      const predavanjeData = {
        ucenikId: user.id,
        uciteljId: teacherId,
        datumVrijemePocetka: `${selectedDate}T${selectedTime}:00`,
      };

      try {
        const token = getToken();
        const response = await axios.post(
          `${backend}/api/zabiljezi-predavanje`,
          predavanjeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          setShowNotification(true); // Prikaži oblak
          setTimeout(() => setShowNotification(false), 3000); // Sakrij nakon 3 sekunde
          setIsModalOpen(false);
        
          // Dodavanje rezervacije u kalendar
          const calendarApi = calendarRef.current.getApi();
          calendarApi.addEvent({
            title: `Nepotvrđeno: ${selectedTime}`,
            start: `${selectedDate}T${selectedTime}:00`,
            allDay: false,
            backgroundColor: "#ffc107",
          });
        
          // Uklanjanje termina iz slobodnih
          setAvailableTimes((prevTimes) =>
            prevTimes.filter((time) => time !== selectedTime)
          );
        }        
      } catch (error) {
        console.error("Greška prilikom stvaranja rezervacije:", error);
        alert("Provjeri konzolu");
      }
    }
  };

  const handleDatesSet = (dateInfo) => {
    const newCurrentDate = new Date(dateInfo.view.currentStart);
    if (newCurrentDate.getTime() !== currentDate.getTime()) {
      setCurrentDate(newCurrentDate);
    }
  };

  const formatEuropeanDate = (date) => {
    const [year, month, day] = date.split("-"); // Pretpostavlja format YYYY-MM-DD
    return `${day}.${month}.${year}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div id="notification" className={`filter-notification ${showNotification ? 'show' : ''}`}>
        Rezervacija uspješno spremljena!
      </div>
      <a href="/" className="logo-link">
        <img src={logo_icon} alt="Logo" className="logo" />
      </a>
      <Fullcalendar
        ref={calendarRef}
        events={reservedLessons}
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

      {user.uloga !== "Učitelj" && (
        <div className="timeslots">
          {selectedDate ? (
            <div>
              <h3>Dostupni termini za {formatEuropeanDate(selectedDate)}:</h3>
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
          ) : (
            <p>Molimo kliknite na datum za prikaz dostupnih termina.</p>
          )}
        </div>
      )}

      {/* Modal za potvrdu rezervacije */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-calendar"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h3>📅 Potvrda rezervacije</h3>
          <p>Želite li potvrditi rezervaciju za sljedeći termin?</p>
          {selectedDate && selectedTime && (
            <p>
              <strong>Datum:</strong> {formatEuropeanDate(selectedDate)},{" "}
              <strong>Vrijeme:</strong> {selectedTime}
            </p>
          )}
          <div className="modal-calendar-actions">
            <button className="confirm-button" onClick={confirmReservation}>
              ✅ Potvrdi
            </button>
            <button className="cancel-button" onClick={closeModal}>
              ❌ Odustani
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
