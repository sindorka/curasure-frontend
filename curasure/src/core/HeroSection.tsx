import React from 'react';
import heroImage from '../assets/home.svg'; // Adjust path as needed

const HeroSection: React.FC = () => {
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
        <div className="register-container">
          <button className="register-btn">Register Now</button>
          <p className="cta-text">Join us today for seamless healthcare management!</p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hero-image">
        <img src={heroImage} alt="Healthcare Illustration" />
      </div>
    </div>
  );
};

export default HeroSection;
