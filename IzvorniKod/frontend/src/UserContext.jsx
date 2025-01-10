import React, { createContext, useState, useContext } from "react";

//kreiranje konteksta za spremanje informacija o korisniku
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    ime: "",
    prezime: "",
    email: "",
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
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

//hook za lakši pristup UserContext-u
export const useUser = () => useContext(UserContext);
