import React from 'react';
import { ChatAlt2Icon } from '@heroicons/react/solid'; // Chat icon
import { useNavigate } from 'react-router-dom'; // For navigation after logout

function Header({ darkMode, toggleDarkMode, onLogout }) {
  const navigate = useNavigate(); // Hook for navigation

  // Handle Logout Click
  const handleLogout = () => {
    onLogout(); // Call parent logout function
    navigate('/login'); // Redirect to the login page
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 py-6 px-8 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ChatAlt2Icon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          <h1 className="ml-3 text-3xl font-bold text-gray-800 dark:text-gray-100">
            INBOT
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            AI-Powered Internal Assistant for Document Management
          </div>

          {/* Redesigned Dark Mode Toggle Button */}
          <div
            className={`relative inline-flex items-center h-8 w-16 rounded-full p-1 cursor-pointer ${
              darkMode ? 'bg-indigo-600' : 'bg-gray-400'
            } transition-colors duration-300 ease-in-out`}
            onClick={toggleDarkMode}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                darkMode ? 'translate-x-8 bg-white' : 'translate-x-0 bg-yellow-400'
              }`}
            />
            <span
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white ${
                darkMode ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-200`}
            >
              ☀️
            </span>
            <span
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white ${
                darkMode ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-200`}
            >
              🌙
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-red-600 hover:text-red-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
