import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

//kreiranje konteksta za spremanje informacija o korisniku
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    ime: "",
    prezime: "",
    email: "",
    slika: "",
    uloga: "",
    languagesKnown: [{ nazivJezika: "", razina: "početna" }],
    languagesToLearn: [{ nazivJezika: "" }],
    languagesTeach: [{ nazivJezika: "" }],
    stilPoducavanja: "",
    ciljeviUcenja: "",
    iskustvo: "",
    qualifications: [{ kvalifikacije: "" }],
    satnica: "",
  }); //pocetno stanje korisnika

  const location = useLocation();

  useEffect( () => {
    const token = localStorage.getItem("token");

    if (location.pathname === "/profile" || !token) {
      return;
    }

    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/moj-profil",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            if (response.data.slika==null) {
              response.data.slika="";
            }
            response.data.slika = "data:image/png;base64," + response.data.slika;
            setUser(response.data);
          }
        } catch (error) {
          console.error("Greška prilikom dohvaćanja korisnika:", error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

//hook za lakši pristup UserContext-u
export const useUser = () => useContext(UserContext);
