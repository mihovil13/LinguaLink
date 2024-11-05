import './LoginSignup.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import { useState } from 'react'

const LoginSignup = () => {

    const [action, setAction] = useState("Registracija");

    return (
        <div className='container'>
            <div className='header'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Prijava" ? <div></div> :
                <div>
                    <div className="odabir">
                        <label>
                            <input type="radio" name="uloga" />Učenik
                        </label>
                        <label>
                            <input type="radio" name="uloga" />Učitelj
                        </label>
                    </div>
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder='Ime korisnika' />
                    </div>
                </div>}
        
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='E-mail adresa' />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Lozinka' />
                </div>
            </div>
            {action === "Registracija" ? 
                <div className="ima_racun" onClick={() => setAction("Prijava")}>
                    Imaš račun? <span>Prijavi se!</span>
                </div>
            : 
                <div>
                    {/* Add the forgot password message above the button */}
                    <div className="forgot-password">
                        Zaboravljena lozinka? <span>Postavi novu lozinku</span>
                    </div>
                    <div className="submit-container">
                        <div className="submit">Prijavi se</div>
                    </div>
                </div>
            }
            {action === "Registracija" && (
                <div className="submit-container">
                    <div className="submit">Registriraj se</div>
                </div>
            )}
        </div>
    )    
    
};

export default LoginSignup;
