import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import leftImage from '../assets/contact1.svg'; 
import rightImage from '../assets/contact2.svg'; 

const ContactSection: React.FC = () => {
  return (
    <div className="contact-page">
      {/* Left Image */}
      <div className="contact-image left">
        <img src={leftImage} alt="Healthcare Assistance" />
      </div>

      {/* Contact Form & Details */}
      <div className="contact-container">
        <div className="contact-form">
          <h3>📩 Send Us a Message</h3>
          <form>
            <label>Name:</label>
            <input type="text" placeholder="Enter your name" required />

            <label>Email:</label>
            <input type="email" placeholder="Enter your email" required />

            <label>Message:</label>
            <textarea placeholder="Write your message" rows={4} required></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-info">
          <h3>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Visit Us
          </h3>
          <p>123 Health Street, MedCity, USA</p>

          <h3>
            <FontAwesomeIcon icon={faPhone} /> Call Us
          </h3>
          <p>(+1) 555-1234-567</p>

          <h3>
            <FontAwesomeIcon icon={faEnvelope} /> Email Us
          </h3>
          <p>
            <a href="mailto:contact@healthsystem.com">contact@healthsystem.com</a>
          </p>

          <h3>🔗 Follow Us</h3>
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="contact-image right">
        <img src={rightImage} alt="Medical Consultation" />
      </div>
    </div>
  );
};

export default ContactSection;
