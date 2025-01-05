import React from 'react';
import './HomePage.css';

//kod za navigacijsku traku na početnoj stranici, linkovi vode na stranice za registraciju,
//prijavu te na Github wiki

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">LinguaLink</div>
            <ul className="navbar-links">
                <li><a className="navbar-link" href="/login">Prijava</a></li>
                <li><a className="navbar-link" href="/register">Registracija</a></li>
                <li><a className="navbar-link" href="https://github.com/mihovil13/LinguaLink/blob/main/readme.md">O aplikaciji</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
