import React, { useEffect, useState } from "react";
import "./TeacherList.css";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          setTeachers(response.data);
        }
      } catch (error) {
        console.error("Error fetching teacher list:", error);
        // alert("Došlo je do greške prilikom dohvaćanja liste učitelja.");
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <div
      className={`parent-container ${isLoggedIn ? "logged-in" : "logged-out"}`}
    >
      <div className="container">
        <div className="main-content">
          <footer>
            <div className="text">Lista učitelja</div>
            <div className="underline"></div>
          </footer>
          {teachers.map((teacher, index) => (
            <div className="teacher-container" key={index}>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                alt=""
              />
              <p>
                {teacher.ime} {teacher.prezime}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isLoggedIn && (
        <div className="filtered-teachers-container">
          <footer>
            <div className="text">Lista učitelja po vašim preferencama</div>
            <div className="underline"></div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
