import React, { useState, useEffect } from 'react';
import './HomePage.css';
import slide1 from '../Assets/slide1.jpg';
import slide2 from '../Assets/slide2.jpg';
import slide3 from '../Assets/slide3.jpg';
import slide4 from '../Assets/slide4.jpg';
import slide5 from '../Assets/slide5.jpg';
import { useUser } from '../../UserContext'; // Koristi kontekst za korisnika

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { user } = useUser(); // Preuzimanje korisničkih podataka iz konteksta

    const slides = [slide1, slide2, slide3, slide4, slide5];

    // Automatska promena slajdova
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(slideInterval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero">
            <h1 className="hero-title">
                {user && user.ime && user.prezime ? `Dobrodošli, ${user.ime} ${user.prezime}` : "Dobrodošli u LinguaLink!"}
            </h1>
            <p className="hero-subtitle">Aplikacija za povezivanje učenika i profesora stranih jezika</p>

            <div className="hero-slideshow">
                <img src={slides[currentSlide]} alt="Slideshow" className="hero-slideshow-img" />
            </div>

            <div className="hero-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index}
                        className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>

            {/* Prikazuje gumb samo ako korisnik nije prijavljen */}
            {!user || !user.ime || !user.prezime ? (
                <a href="/register" className="hero-button">Započni sada</a>
            ) : null}
        </section>
    );
};

export default HeroSection;
