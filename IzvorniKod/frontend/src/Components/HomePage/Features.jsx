import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { useUser } from "../../UserContext"; // Pretpostavljamo da koristite kontekst za korisnika.

const Features = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Preuzimanje informacija o korisniku.

  const features = [
    {
      title: "Pronađi profesora",
      description: "Pristupi mreži kvalificiranih profesora.",
      action: () => {
        if(user.uloga!=="Učitelj" || user.uloga === "Učenik") {
          navigate("/teachers");
        }        
      },
    },
    {
        title: "Uči jezik",
        description: "Koristi interaktivne alate za učenje jezika.",
        action: () => {
          if (user) {
            navigate("/profile"); 
          } else {
            navigate("/login", { state: { returnTo: "/profile" } }); 
          }
        },
      },
      {
        title: "Praćenje napretka",
        description: "Prati svoj napredak kroz aplikaciju.",
        action: () => {
          if (user) {
            navigate(`/lections/${user.id}`); 
          } else {
            navigate("/login", { state: { returnTo: "/profile" } }); 
          }
        },
      },
      
  ];

  return (
    <section className="features" id="features">
      <h2 className="features-heading">Značajke</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={feature.action} 
            style={{ cursor: "pointer" }}
          >
            <h3 className="feature-title clickable">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
