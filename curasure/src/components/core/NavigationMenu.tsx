
import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import RolesSection from './RolesSection';
import ContactSection from './ContactSection';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

type SectionKey = 'hero' | 'about' | 'roles' | 'contact';

const NavigationMenu = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SectionKey>('hero');
    const nodeRef = useRef<HTMLDivElement>(null);

    const sections: Record<SectionKey, React.ReactNode> = {
        hero: <HeroSection />,
        about: <AboutSection />,
        roles: <RolesSection />,
        contact: <ContactSection />,
    };
    const handleNavClick = (section: SectionKey) => {
        setActiveSection(section);
    };

    const handleLogin = () => {
        navigate("/login");
    }
    return (
        <div>
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
                    <button className="login-btn"
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                </div>
            </nav>
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
    )
};

export default NavigationMenu;