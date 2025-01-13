import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './HomePage.css';

const Features = () => {
    const navigate = useNavigate(); 

    const features = [
        { 
            title: 'Pronađi profesora', 
            description: 'Pristupi mreži kvalificiranih profesora.',
            redirect: '/teachers' 
        },
        { 
            title: 'Uči jezik', 
            description: 'Koristi interaktivne alate za učenje jezika.' 
        },
        { 
            title: 'Praćenje napretka', 
            description: 'Prati svoj napredak kroz aplikaciju.' 
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
                        onClick={() => feature.redirect && navigate(feature.redirect)} // Dodajemo redirekciju
                        style={{ cursor: feature.redirect ? 'pointer' : 'default' }} // Indikator za klik
                    >
                        <h3 className={`feature-title ${feature.redirect ? 'clickable' : ''}`}>
                            {feature.title}
                        </h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
