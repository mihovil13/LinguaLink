import React, { useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css';

// Funkcija za pronalazak prvog dana trenutnog mjeseca
const getFirstDayOfCurrentMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // Prvi dan trenutnog mjeseca
  };
  

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [currentDate, setCurrentDate] = useState(getFirstDayOfCurrentMonth());

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      setSelectedDate(info.dateStr); // Postavlja odabrani datum
      setAvailableTimes(["09:15", "09:30", "10:15", "10:45", "11:15"]); // Primjer dostupnih termina
    }
  };

  const handleDatesSet = (dateInfo) => {
    const newCurrentDate = new Date(dateInfo.view.currentStart);
    if (newCurrentDate.getTime() !== currentDate.getTime()) {
      setCurrentDate(newCurrentDate);
    }
  };
  
  return (
    <div>
      <Fullcalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView={"dayGridMonth"}
  initialDate={new Date().toISOString().split("T")[0]} // Prikazuje današnji mjesec
  headerToolbar={{
    start: "today", // Onemogućavanje "Prev" za trenutni mjesec
    center: "title",
    end: currentDate.getMonth() === new Date().getMonth() ? "next" : "prev,next",
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
      return "fc-previous-month"; // Transparentne ćelije za datume iz prethodnog mjeseca
    } else if (cellDate < today) {
      return "fc-past-date"; // Prošli datumi unutar mjeseca
    }
    return ""; // Ostali datumi
  }}
/>

      <div className="timeslots">
        {selectedDate && (
          <div style={{border: "1px solid #613c78"}}>
            <h3 >Dostupni termini za {selectedDate}:</h3>
            <div className="times">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() =>
                    alert(`Rezervirali ste termin u ${time} na datum ${selectedDate}`)
                  }
                  className="time-button"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
