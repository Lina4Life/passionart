import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import '../Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          PASSION—ART
        </NavLink>
        
        <ul className="nav-menu">
          <li>
            <NavLink 
              to="/articles" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              ARTICLES
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              GALLERY
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/community" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              COMMUNITY
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ai-chat" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              AI ASSISTANT
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/upload" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              UPLOAD
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/store" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              STORE
            </NavLink>
          </li>
        </ul>

        <div className="nav-auth">
          <ThemeToggle />
          <NavLink 
            to="/login" 
            className="auth-link login-btn"
          >
            LOGIN
          </NavLink>
          <NavLink 
            to="/register" 
            className="auth-link register-btn"
          >
            SIGN UP
          </NavLink>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-menu">
          <li>
            <NavLink 
              to="/articles" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              ARTICLES
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/gallery" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              GALLERY
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/community" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              COMMUNITY
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ai-chat" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              AI ASSISTANT
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/upload" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              UPLOAD
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/store" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              OUR PIECES
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/login" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              LOGIN
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/register" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              SIGN UP
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
