import React from 'react';
import './HomePage.css';

//središnja sekcija početne stranice

const HeroSection = () => {
    return (
        <section className="hero">
            <h1 className="hero-title">Dobrodošli u LinguaLink!</h1>
            <p className="hero-subtitle">Aplikacija za povezivanje učenika i profesora stranih jezika</p>
            <a href="/register" className="hero-button">Započni sada</a>
        </section>
    );
};

export default HeroSection;
