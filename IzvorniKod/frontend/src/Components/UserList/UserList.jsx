import React, { useEffect, useState } from "react";
import "./UserList.css";
import axios from "axios";
import logo_icon from "../Assets/logo-prototip3.png";
import delete_icon from "../Assets/delete.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";


const backend = "http://localhost:8080";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get(`${backend}/api/admin/korisnici`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data;
          setUsers(userData);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchUsersData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `${backend}/api/admin/delete_korisnik/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const { user, setUser } = useUser() || { user: {}, setUser: () => {} };
  const navigate = useNavigate();
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <div className={`parent-container logged-out}`}>
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
          Administator
        </span>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate("/profile")}>Profil</button>
          </div>
        )}
      </div>
      <div className="container">
        <footer>
          <div className="text">Lista korisnika</div>
          <div className="underline"></div>
        </footer>
        <div className="main-content">
          {users.length > 0 ? (
            users.map((user, index) => {
              return (
                <div className="user-container" key={index}>
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    alt=""
                  />
                  <div className="user-info">
                    <p>
                      {user.ime} {user.prezime}
                    </p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user.user_id)}
                    aria-label="Obriši korisnika"
                  >
                    <img src={delete_icon} alt="Delete" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="empty-message">Nema postojećih korisnika.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
