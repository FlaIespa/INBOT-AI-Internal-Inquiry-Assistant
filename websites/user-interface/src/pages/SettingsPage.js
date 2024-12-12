import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [responseSpeed, setResponseSpeed] = useState('normal');
  const [notifications, setNotifications] = useState(true);

  // Toggle dark mode and update the `document.documentElement` class
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load dark mode preference from localStorage (if available)
  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-4xl w-full"
      >
        <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 text-center"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center"
          >
            Customize your INBOT experience and preferences.
          </motion.p>

          <div className="space-y-8">
            {/* Chatbot Customization Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
                Chatbot Customization
              </h2>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-400 mb-2">Response Speed:</label>
                <select
                  value={responseSpeed}
                  onChange={(e) => setResponseSpeed(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </motion.section>

            {/* Appearance Settings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
                Appearance
              </h2>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-400 mb-2">Dark Mode:</label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 dark:bg-gray-700 dark:border-gray-600"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {darkMode ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </motion.section>

            {/* Notifications Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4">
                Notifications
              </h2>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-400 mb-2">Email Notifications:</label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 dark:bg-gray-700 dark:border-gray-600"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </motion.section>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-right mt-8"
          >
            <button className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-800">
              Save Changes
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SettingsPage;
