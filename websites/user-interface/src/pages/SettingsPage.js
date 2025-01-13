import React, { useState, useEffect } from 'react';
import { 
  CogIcon, BellIcon, SunIcon, GlobeIcon, 
  ShieldCheckIcon, DocumentTextIcon 
} from '@heroicons/react/solid';

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-8');
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [activityTracking, setActivityTracking] = useState(true);
  const [defaultFormat, setDefaultFormat] = useState('pdf');
  const [autoConvert, setAutoConvert] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate saving
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setDarkMode(false);
      setNotifications(true);
      setLanguage('en');
      setTimezone('UTC-8');
      setShareAnalytics(true);
      setActivityTracking(true);
      setDefaultFormat('pdf');
      setAutoConvert(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  return (
    <div className="ml-56 flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Settings
        </h1>

        <div className="space-y-4">
          {/* Language Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <GlobeIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Language & Region
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Interface Language
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
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

          {/* Appearance Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Appearance
              </h2>
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </section>

          {/* Privacy Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Privacy
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Share Usage Analytics
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={shareAnalytics}
                    onChange={() => setShareAnalytics(!shareAnalytics)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Allow Activity Tracking
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={activityTracking}
                    onChange={() => setActivityTracking(!activityTracking)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Document Processing */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Document Processing
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Default File Format
                </label>
                <select
                  value={defaultFormat}
                  onChange={(e) => setDefaultFormat(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="txt">TXT</option>
                  <option value="docx">DOCX</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Auto-Convert Documents
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoConvert}
                    onChange={() => setAutoConvert(!autoConvert)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Notifications Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </section>

          {/* Save and Reset Buttons */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                Reset to Default
              </button>
              <p className="text-sm">
                {saveStatus === 'saving' && (
                  <span className="text-yellow-500 dark:text-yellow-400">Saving changes...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-green-500 dark:text-green-400">✓ Changes saved</span>
                )}
              </p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;