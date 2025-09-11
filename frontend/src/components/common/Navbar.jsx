/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import FeedbackPopup from './FeedbackPopup';
import '../Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  // Check if current user is admin
  const isAdmin = user && user.email === 'admin@passionart.com';
  
  // Check if current user is artist (by specific emails or user_type)
  const artistEmails = [
    'sss@passionart.com',
    'booga@passionart.com', 
    'ungsbunga@gmail.com',
    'yy@passionart.com',
    'uu@passiontart.com',
    'youssefelgharib03@gmail.com',
    'booga5682@gmail.com',
    'sophia.martinez@example.com',
    'james.parker@example.com',
    'elena.rodriguez@example.com',
    'alex.chen@example.com',
    'maya.patel@example.com',
    'david.kim@example.com',
    'isabella.taylor@example.com',
    'marcus.johnson@example.com',
    'zoe.williams@example.com',
    'gabriel.santos@example.com',
    'aria.nakamura@example.com',
    'oliver.brown@example.com',
    'luna.garcia@example.com',
    'ethan.moore@example.com',
    'nora.anderson@example.com'
  ];
  const isArtistByEmail = user && artistEmails.includes(user.email);
  
  // Check if user can upload (admins and artists)
  const canUpload = isAdmin || isArtistByEmail || (user && user.user_type === 'artist');
  
  // Check different user permissions
  const isArtist = isArtistByEmail || (user && user.user_type === 'artist');
  const isGallery = user && user.user_type === 'gallery';
  const isCollector = user && user.user_type === 'collector';
  const isInstitution = user && user.user_type === 'institution';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
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
              to="/artists" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              ARTISTS
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
              to="/store" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              STORE
            </NavLink>
          </li>
          
          {/* User type specific navigation links */}
          {isGallery && (
            <li>
              <NavLink 
                to="/gallery-dashboard" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                DASHBOARD
              </NavLink>
            </li>
          )}
          
          {(isCollector || isInstitution) && (
            <li>
              <NavLink 
                to="/marketplace" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                MARKETPLACE
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {isAdmin && (
            <NavLink 
              to="/admin" 
              className="admin-btn"
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: '500',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                marginRight: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
              }}
            >
              ADMIN
            </NavLink>
          )}
          <LanguageSelector />
          <ThemeToggle />
          {user ? (
            <div className="profile-dropdown">
              <button 
                className="profile-btn" 
                onClick={toggleProfileDropdown}
              >
                <div className="profile-avatar">
                  {getUserInitials()}
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {getUserInitials()}
                      </div>
                      <div className="user-details">
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <NavLink 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </NavLink>
                  {canUpload && (
                    <NavLink 
                      to="/upload" 
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">📤</span>
                      Upload
                    </NavLink>
                  )}
                  
                  
                  {/* Gallery-specific links */}
                  {isGallery && (
                    <>
                      <NavLink 
                        to="/my-exhibitions" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">🏛️</span>
                        My Exhibitions
                      </NavLink>
                      <NavLink 
                        to="/manage-artists" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">👥</span>
                        Manage Artists
                      </NavLink>
                    </>
                  )}
                  
                  {/* Collector-specific links */}
                  {isCollector && (
                    <>
                      <NavLink 
                        to="/my-collection" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">🖼️</span>
                        My Collection
                      </NavLink>
                      <NavLink 
                        to="/wishlist" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">❤️</span>
                        Wishlist
                      </NavLink>
                    </>
                  )}
                  
                  {/* Institution-specific links */}
                  {isInstitution && (
                    <>
                      <NavLink 
                        to="/institutional-collection" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">🏛️</span>
                        Institutional Collection
                      </NavLink>
                      <NavLink 
                        to="/educational-programs" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">🎓</span>
                        Educational Programs
                      </NavLink>
                    </>
                  )}
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsFeedbackOpen(true);
                    }}
                  >
                    <span className="dropdown-icon">💬</span>
                    Send Feedback
                  </button>
                  {isAdmin && (
                    <NavLink 
                      to="/admin" 
                      className="dropdown-item admin-dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
                        color: 'white',
                        fontWeight: 'bold',
                        margin: '0.25rem 0',
                        borderRadius: '6px'
                      }}
                    >
                      <span className="dropdown-icon">🏛️</span>
                      Admin Panel
                    </NavLink>
                  )}
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
              to="/artists" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              ARTISTS
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
              to="/store" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              OUR PIECES
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PROFILE
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink 
                    to="/admin" 
                    className="mobile-nav-link admin-mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      margin: '0.25rem 0'
                    }}
                  >
                    ADMIN PANEL
                  </NavLink>
                </li>
              )}
              <li>
                <button 
                  className="mobile-nav-link logout-btn-mobile"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  LOGOUT
                </button>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
      
      {/* Feedback Popup */}
      <FeedbackPopup 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        user={user}
      />
    </nav>
  );
};

export default Navbar;
