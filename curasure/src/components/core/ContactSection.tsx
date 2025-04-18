import React from 'react';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import leftImage from '../../assets/contact1.svg'; 
import rightImage from '../../assets/contact2.svg'; 

const ContactSection: React.FC = () => {
  return (
    <div className="contact-footer">
      
      <div className="footer-info">
        <div className="footer-item">
          <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
          <span>123 Health Street, MedCity, USA</span>
        </div>

        <div className="footer-item">
          <FontAwesomeIcon icon={faPhone} size="2x" />
          <span>(+1) 555-1234-567</span>
        </div>

        <div className="footer-item">
          <FontAwesomeIcon icon={faEnvelope} size="2x" />
          <span>
            <a href="mailto:contact@healthsystem.com">contact@healthsystem.com</a>
          </span>
        </div>
      </div>

      <div className="footer-social">
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
  );
};

export default ContactSection;