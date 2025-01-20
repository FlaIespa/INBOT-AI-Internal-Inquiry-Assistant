import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChatAlt2Icon,
  CloudUploadIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  BellIcon,
  ChartPieIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
} from '@heroicons/react/solid';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between routes

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');

    // Redirect the user to the login page
    navigate('/login');
  };

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    // role: 'Employee',
    avatarUrl: null,
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 via-purple-600 to-purple-800 text-white flex flex-col ${
        isCollapsed ? 'w-16' : 'w-56'
      } transition-all duration-300 z-10 shadow-md`}
    >
      <div className="flex flex-col flex-1">
        {/* Top Section with Logo and Toggle */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
              <ChatAlt2Icon className="h-6 w-6 text-white" />
              <h2 className="text-lg font-bold ml-2 tracking-wide">INBOT</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white p-2 rounded-full hover:bg-blue-700 hover:bg-opacity-50 transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <Link
          to="/user-profile"
          className="px-3 py-4 border-y border-white/10 hover:bg-blue-700 hover:bg-opacity-50 
            transition-all duration-300"
        >
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-lg font-medium">{user.name.charAt(0)}</span>
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-white/70 truncate">{user.email}</p>
                <p className="text-xs text-white/70">{user.role}</p>
              </div>
            )}
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 p-3">
          <ul className="space-y-4">
            <li>
              <Link
                to="/home"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <HomeIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Home</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <ChatAlt2Icon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Chatbot</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/file-management"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <CloudUploadIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">File Management</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <CogIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Help/FAQ</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/user-profile"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <UserIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">User Profile</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <BellIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Notifications</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-all duration-300"
              >
                <ChartPieIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Analytics</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-md 
              bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <LogoutIcon className="h-4 w-4" />
            {!isCollapsed && <span className="text-xs">Logout</span>}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-3 text-center text-xs bg-opacity-20">
        <p className="text-gray-300">&copy; 2025 INBOT</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
