import React, { useState, useEffect } from 'react';
import HeroSection from './home_page/HeroSection';
import AboutSection from './home_page/AboutSection';
import RolesSection from './home_page/RolesSection';
import ContactSection from './home_page/ContactSection';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

type SectionKey = 'hero' | 'about' | 'roles' | 'contact';

const NavigationMenu = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SectionKey>('hero');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    const sections: Record<SectionKey, React.ReactNode> = {
        hero: <HeroSection />,
        about: <AboutSection />,
        roles: <RolesSection />,
        contact: <ContactSection />,
    };

    const handleNavClick = (section: SectionKey) => {
        setActiveSection(section);
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogin = () => {
        navigate("/login");
    };
    return (
        <div>
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
                    <button className="login-btn" onClick={handleLogin}>Log In</button>
                </div>
            </nav>

            <div className="section-container">
                <div id="hero">{sections['hero']}</div>
                <div id="about">{sections['about']}</div>
                <div id="roles">{sections['roles']}</div>
                <div id="contact">{sections['contact']}</div>
            </div>
        </div>
    )
};

export default NavigationMenu;