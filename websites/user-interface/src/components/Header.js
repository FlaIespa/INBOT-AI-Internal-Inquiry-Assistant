import React from 'react';
import { ChatAlt2Icon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';

function Header({ darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-56 bg-gray-100 dark:bg-gray-800 py-4 px-6 shadow-md z-10">
      <div className="flex items-center justify-between">
        {/* Logo Section - removed since it's in the sidebar */}
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          INBOT
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Tagline */}
          <div className="text-xs text-gray-600 dark:text-gray-300">
            AI-Powered Assistant for Document Management
          </div>

          {/* Dark Mode Toggle */}
          <div
            className={`relative inline-flex items-center h-6 w-12 rounded-full p-0.5 cursor-pointer ${
              darkMode ? 'bg-indigo-600' : 'bg-gray-400'
            } transition-colors duration-300 ease-in-out`}
            onClick={toggleDarkMode}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                darkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-yellow-400'
              }`}
            />
            <span
              className={`absolute left-1 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-white ${
                darkMode ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-200`}
            >
              ☀️
            </span>
            <span
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-white ${
                darkMode ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-200`}
            >
              🌙
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;