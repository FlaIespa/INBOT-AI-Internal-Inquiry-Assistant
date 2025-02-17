// src/contexts/DarkModeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the Context
export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Check localStorage for dark mode preference, default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Apply dark mode class to <html> to ensure correct styling on load
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle Dark Mode and persist the setting
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
