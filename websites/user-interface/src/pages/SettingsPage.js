import React, { useState, useEffect } from 'react';

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
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>
      
      {/* Chatbot Customization Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Chatbot Customization</h2>
        
        {/* Response Speed Setting */}
        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Chatbot Response Speed:</label>
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

        {/* Toggle Greeting Messages */}
        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Greeting Messages:</label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox h-5 w-5 dark:bg-gray-700 dark:border-gray-600" checked />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Enable Greeting Messages</span>
          </label>
        </div>
      </section>

      {/* Appearance Settings */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Appearance</h2>
        
        {/* Dark Mode Toggle */}
        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Dark Mode:</label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox h-5 w-5 dark:bg-gray-700 dark:border-gray-600" 
              checked={darkMode}
              onChange={toggleDarkMode} 
            />
            <span className="ml-2 text-gray-600 dark:text-gray-400">{darkMode ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>

        {/* Text Size Setting */}
        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Text Size:</label>
          <select className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <option value="small">Small</option>
            <option value="medium" selected>Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Notifications</h2>
        
        {/* Email Notification Toggle */}
        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Email Notifications:</label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox h-5 w-5 dark:bg-gray-700 dark:border-gray-600" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)} 
            />
            <span className="ml-2 text-gray-600 dark:text-gray-400">{notifications ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-800">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
