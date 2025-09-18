import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {isDarkMode ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5"/>
              <path d="m12 1-1.6 3.3M12 23l-1.6-3.3M4.2 4.2l2.3 2.3M17.5 17.5l2.3 2.3M1 12l3.3-1.6M23 12l-3.3-1.6M4.2 19.8l2.3-2.3M17.5 6.5l2.3-2.3"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;

