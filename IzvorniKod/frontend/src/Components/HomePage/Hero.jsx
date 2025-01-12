import React, { useState, useEffect } from 'react';
import './HomePage.css';
import slide1 from '../Assets/slide1.jpg';
import slide2 from '../Assets/slide2.jpg';
import slide3 from '../Assets/slide3.jpg';
import slide4 from '../Assets/slide4.jpg'
import slide5 from '../Assets/slide5.jpg'
 
const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [slide1, slide2, slide3, slide4, slide5]; // Ovdje dodaj sve slike koje želiš u slideshow

    // Funkcija za automatsku promjenu slajdova
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 4000); // 3000ms = 3 sekunde

        return () => clearInterval(slideInterval); // Očisti interval kad komponenta bude unmounted
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero">
            <h1 className="hero-title">Dobrodošli u LinguaLink!</h1>
            <p className="hero-subtitle">Aplikacija za povezivanje učenika i profesora stranih jezika</p>

            <div className="hero-slideshow">
                <img src={slides[currentSlide]} alt="Slideshow" className="hero-slideshow-img" />
            </div>

            {/* Tačkice za promjenu slajdova */}
            <div className="hero-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index}
                        className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>

            <a href="/register" className="hero-button">Započni sada</a>
        </section>
    );
};

export default HeroSection;