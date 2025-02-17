import React, { useContext, useState, useEffect } from 'react';
import { CogIcon, SunIcon, GlobeIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { DarkModeContext } from '../contexts/DarkModeContext';

function SettingsPage() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  // Track language in state
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-8');
  const [saveStatus, setSaveStatus] = useState(null);

  // Hide or show the Google Translate banner depending on language
  useEffect(() => {
    if (language === 'en') {
      // Hide the banner for English
      let styleTag = document.getElementById('hide-gt-banner');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'hide-gt-banner';
        styleTag.innerHTML = `
          .goog-te-banner-frame { display: none !important; }
          body { top: 0px !important; }
        `;
        document.head.appendChild(styleTag);
      }
    } else {
      // Remove the style so the banner can show if needed
      const styleTag = document.getElementById('hide-gt-banner');
      if (styleTag) {
        styleTag.remove();
      }
    }
  }, [language]);

  // Update language + set the Google Translate cookie
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  
    // 1. Clear the old cookie
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    // 2. Set the new cookie
    // If your original site text is in English:
    //   "googtrans=/en/pt" means "Translate from EN to PT"
    //   "googtrans=/en/en" means "Translate from EN to EN" (no translation)
    if (newLang === 'pt') {
      document.cookie = "googtrans=/en/pt; path=/;";
    } else {
      // newLang === 'en'
      document.cookie = "googtrans=/en/en; path=/;";
    }
  
    // 3. Reload to let Google Translate pick up the new cookie
    window.location.reload();
  };
  

  // Simulate saving settings
  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  // Reset everything to default
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      if (darkMode) toggleDarkMode();
      setLanguage('en');
      setTimezone('UTC-8');
      localStorage.setItem('language', 'en');

      // Clear + set the cookie to no translation
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=/en/en; path=/;";

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
      window.location.reload();
    }
  };

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Manage your preferences and application settings.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language & Region */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <GlobeIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Language &amp; Region
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Interface Language
                </label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Time Zone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="UTC-8">UTC-8 (Pacific Time)</option>
                  <option value="UTC-5">UTC-5 (Eastern Time)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <SunIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div
                  className={`w-12 h-7 rounded-full flex items-center transition-all duration-300 ${
                    darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    layout
                    className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></motion.div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Save and Reset Buttons */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <button
            onClick={handleReset}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md text-sm hover:from-blue-700 hover:to-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsPage;
