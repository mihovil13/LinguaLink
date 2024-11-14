import React, { useEffect, useState } from "react";
import "./TeacherList.css";
import axios from "axios";

const TeacherList = () => {

    // definiramo podatke 
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
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
        <div className="container">
            {teachers.map((teacher, index) => (
            <div className="teacher-container" key={index}>
                <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="" />
                <p>{teacher.ime} {teacher.prezime}</p>
            </div>
        ))}
        </div>
    );

}


export default TeacherList;