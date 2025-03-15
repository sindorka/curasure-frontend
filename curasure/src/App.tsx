import React, { useState, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HeroSection from './core/HeroSection';
import AboutSection from './core/AboutSection';
import RolesSection from './core/RolesSection';
import ContactSection from './core/ContactSection';
import './App.css';

// Optional: Define a union type for section names
type SectionKey = 'hero' | 'about' | 'roles' | 'contact';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const nodeRef = useRef<HTMLDivElement>(null);

  // Map section names to React elements
  const sections: Record<SectionKey, React.ReactNode> = {
    hero: <HeroSection />,
    about: <AboutSection />,
    roles: <RolesSection />,
    contact: <ContactSection />,
  };

  const handleNavClick = (section: SectionKey) => {
    setActiveSection(section);
  };

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">CuraSure</div>
        <div className="navbar-container">
          <ul className="navbar-menu">
            <li
              onClick={() => handleNavClick('hero')}
              className={`nav-item ${activeSection === 'hero' ? 'active' : ''}`}
            >
              Home
            </li>
            <li
              onClick={() => handleNavClick('about')}
              className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </li>
            <li
              onClick={() => handleNavClick('roles')}
              className={`nav-item ${activeSection === 'roles' ? 'active' : ''}`}
            >
              Roles
            </li>
            <li
              onClick={() => handleNavClick('contact')}
              className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <button className="login-btn">Log In</button>
        </div>
      </nav>

      {/* Section Rendering */}
      <div className="section-container">
        <CSSTransition
          in={true}
          nodeRef={nodeRef}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div ref={nodeRef}>{sections[activeSection]}</div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default App;
