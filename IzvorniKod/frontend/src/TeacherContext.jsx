import React, { createContext, useState, useContext } from "react";

// kreiramo kontekst za ucitelja
const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState({
    id: null,
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
  }); //pocetno stanje ucitelja
  return (
    <TeacherContext.Provider value={{ teacher, setTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

//hook za lakši pristup UserContext-u
export const useTeacher = () => useContext(TeacherContext);
