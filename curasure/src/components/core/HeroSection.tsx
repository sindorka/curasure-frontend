import React from 'react';
import heroImage from '../../assets/home.png';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/register");
    }

    return (
        <div className="hero-container">
            {/* Left Side - Text Content */}
            <div className="hero-text">
                <h1>
                    Empowering Healthcare with<br />
                    <span className="highlight">Technology</span>
                </h1>
                <p>
                    Your One-Stop Solution for Healthcare &amp; Insurance Management. CuraSure
                    provides seamless health management solutions, ensuring secure and efficient
                    patient care.
                </p>
                <ul className="hero-features">
                    <li> Secure Login &amp; Registration (OAuth, multi-factor, captcha)</li>
                    <li> Smart Search &amp; Filter for doctors and appointments</li>
                    <li> Custom Dashboards for patients, doctors, and insurance providers</li>
                    <li> Real-Time Chat with private and group options</li>
                    <li> Recommendations &amp; Statistics powered by Machine Learning</li>
                </ul>
                <div>
                    <button className="register-btn" onClick={handleRegister}>Register Now</button>
                    {/* <p className="cta-text">Join us today for seamless healthcare management!</p> */}
                </div>
            </div>

            <div className="hero-image">
                <img src={heroImage} alt="Healthcare Illustration" />
            </div>
        </div>
    );
};

export default HeroSection;