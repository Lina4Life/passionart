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
                  <NavLink 
                    to="/upload" 
                    className="dropdown-item"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">📤</span>
                    Upload
                  </NavLink>
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
