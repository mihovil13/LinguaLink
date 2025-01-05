import React from 'react';
import './HomePage.css';

const Features = () => {
    const features = [
        { title: 'Pronađi profesora', description: 'Pristupi mreži kvalificiranih profesora.' },
        { title: 'Uči jezik', description: 'Koristi interaktivne alate za učenje jezika.' },
        { title: 'Praćenje napretka', description: 'Prati svoj napredak kroz aplikaciju.' },
    ];

    return (
        <section className="features" id="features">
            <h2 className="features-heading">Značajke</h2>
            <div className="feature-list">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
