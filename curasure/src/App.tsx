import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeroSection from './components/core/HeroSection';
import AboutSection from './components/core/AboutSection';
import RolesSection from './components/core/RolesSection';
import ContactSection from './components/core/ContactSection';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './Routes';

// Optional: Define a union type for section names
type SectionKey = 'hero' | 'about' | 'roles' | 'contact';

const App = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Update body class when theme is toggled
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Map section names to React elements
  const sections: Record<SectionKey, React.ReactNode> = {
    hero: <HeroSection />,
    about: <AboutSection />,
    roles: <RolesSection />,
    contact: <ContactSection />,
  };

  const handleNavClick = (section: SectionKey) => {
    setActiveSection(section);
    // Smooth scroll to the clicked section
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              {/* Fixed Navbar */}
              <nav className="navbar">
                <div className="navbar-left">CuraSure</div>
                <div className="navbar-container">
                  <ul className="navbar-menu">
                    <li onClick={() => handleNavClick('hero')} className={`nav-item ${activeSection === 'hero' ? 'active' : ''}`}>Home</li>
                    <li onClick={() => handleNavClick('about')} className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}>About</li>
                    <li onClick={() => handleNavClick('roles')} className={`nav-item ${activeSection === 'roles' ? 'active' : ''}`}>Roles</li>
                    <li onClick={() => handleNavClick('contact')} className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}>Contact</li>
                  </ul>
                </div>
                
                <div className="theme-toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                      />
                      <span className="slider round"></span>
                    </label>
                    
                  </div>
                <div className="navbar-right">
                  {/* Dark/Light Mode Toggle */}
                
                  <button className="login-btn" onClick={handleLogin}>Log In</button>
                </div>
              </nav>

              <div className="section-container">
                {/* Sections will be rendered here */}
                <div id="hero">{sections['hero']}</div>
                <div id="about">{sections['about']}</div>
                <div id="roles">{sections['roles']}</div>
                <div id="contact">{sections['contact']}</div>
              </div>
            </div>
          }
        />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </>
  );
};

export default App;
