import React from 'react';
import './HomePage.css';
import logoImage from '../Assets/logo-prototip3.png'; // Dodaj putanju do slike loga

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/">
                    <img src={logoImage} alt="LinguaLink logo" className="navbar-logo-img" />
                </a>
                <span>LinguaLink</span>
            </div>
            <ul className="navbar-links">
                <li><a className="navbar-link" href="/login">Prijava</a></li>
                <li><a className="navbar-link" href="/register">Registracija</a></li>
                <li><a className="navbar-link" href="https://github.com/mihovil13/LinguaLink/blob/main/readme.md">O aplikaciji</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
