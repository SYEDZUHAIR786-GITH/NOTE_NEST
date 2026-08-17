import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('notenest_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('notenest_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
