import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Color theme definitions
const colorThemes = {
  default: { primary: '#00b4a6', secondary: '#6dd5ed' },
  ocean: { primary: '#2193b0', secondary: '#6dd5ed' },
  sunset: { primary: '#ff7e5f', secondary: '#feb47b' },
  forest: { primary: '#134e5e', secondary: '#71b280' },
  royal: { primary: '#667eea', secondary: '#764ba2' },
  cosmic: { primary: '#f093fb', secondary: '#f5576c' },
  lavender: { primary: '#a8edea', secondary: '#fed6e3' },
  cherry: { primary: '#ff416c', secondary: '#ff4b2b' },
  midnight: { primary: '#2c3e50', secondary: '#4ca1af' },
  emerald: { primary: '#11998e', secondary: '#38ef7d' },
  golden: { primary: '#ffb347', secondary: '#ffcc33' },
  crimson: { primary: '#eb3349', secondary: '#f45c43' },
  violet: { primary: '#8360c3', secondary: '#2ebf91' },
  aurora: { primary: '#00c9ff', secondary: '#92fe9d' },
  coral: { primary: '#fa709a', secondary: '#fee140' },
  slate: { primary: '#485563', secondary: '#29323c' },
  magenta: { primary: '#ee0979', secondary: '#ff6a00' },
  teal: { primary: '#0fd850', secondary: '#f9f047' }
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    // Check localStorage for saved color theme
    const savedColorTheme = localStorage.getItem('colorTheme');
    return savedColorTheme || 'default';
  });

  const [userThemeLoaded, setUserThemeLoaded] = useState(false);

  // Load user's theme preference from backend if authenticated
  useEffect(() => {
    // For now, just mark as loaded since we're not using backend theme storage
    setUserThemeLoaded(true);
  }, []);

  useEffect(() => {
    // Apply theme to document root
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Apply color theme
  useEffect(() => {
    const theme = colorThemes[colorTheme] || colorThemes.default;
    const root = document.documentElement;
    
    // Apply CSS custom properties for the color theme
    root.style.setProperty('--accent-color', theme.primary);
    root.style.setProperty('--accent-color-secondary', theme.secondary);
    root.style.setProperty('--accent-color-dark', theme.primary);
    
    // Set theme colors for consistency
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    
    // Ensure dark mode background is always black
    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#111111');
      root.style.setProperty('--bg-tertiary', '#1a1a1a');
    }
    
    // Save to localStorage
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme, isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light',
    userThemeLoaded,
    colorTheme,
    setColorTheme,
    colorThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

