// src/components/Settings.js
import React, { useState, useEffect } from 'react';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Load dark mode preference from localStorage (if available)
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Settings</h2>
      <div className="flex items-center">
        <label className="mr-4 text-gray-700 dark:text-gray-300">Dark Mode</label>
        <button
          className={`${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          onClick={toggleDarkMode}
        >
          <span
            className={`${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
          />
        </button>
      </div>
    </div>
  );
}

export default Settings;
