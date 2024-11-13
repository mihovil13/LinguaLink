import React from 'react';
import profilePicture from '../Assets/person.png';

import './ProfilePage.css';

const ProfilePage = ({ 
    user = {
        name: "John Doe",
        profilePicture: profilePicture,
        email: "johndoe@example.com",
        location: "",
        languagesKnown: ["Spanish"],
        languagesToLearn: ["English"]
    } 
}) => {
    return (
        <div className="profile-page">
            <div className="profile-sidebar">
              <div className="profile-podaci">
                <span>Osobni podaci:</span>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Broj telefona:</strong> {user.location || "nepoznato"}</p>
              </div>
              <div className="profile-jezici">
                <span>Jezici koje znam:</span>
                <ul>
                    {user.languagesKnown.map((lang, index) => (
                        <li key={index}>{lang}</li>
                    ))}
                </ul>
                
                <span>Jezici koje želim naučiti:</span>
                <ul>
                    {user.languagesToLearn.map((lang, index) => (
                        <li key={index}>{lang}</li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="profile-header">
              <div className="profile-imagetext">
                <img 
                    src={user.profilePicture || "https://via.placeholder.com/150"} 
                    alt={`${user.name}'s profile`} 
                    className="profile-picture-large" 
                />
                <h1 className="profile-name">{user.name}</h1>
              </div>
                <div className="profile-buttons">
                  <button className='homepage-button'> Početna stranica </button>
                  <button className='odjava-button'>Odjava</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
