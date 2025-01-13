import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatAlt2Icon,
  CloudUploadIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  BellIcon,
  ClipboardListIcon,
  SearchIcon,
  ChartPieIcon,
  HomeIcon,
} from '@heroicons/react/solid';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-56'
      } transition-all duration-300 z-10`}
    >
      {/* Top Section */}
      <div className="p-3">
        {/* Collapsible Arrow */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
            <ChatAlt2Icon className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold ml-2">INBOT</h2>
          </div>
          <button onClick={toggleSidebar} className="text-white">
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-3">
            <li>
              <Link
                to="/home"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <HomeIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Home</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <ChatAlt2Icon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Chatbot</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/file-management"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <CloudUploadIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">File Management</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <CogIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Settings</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Help/FAQ</span>}
              </Link>
            </li>
            {/* Additional Links */}
            <li>
              <Link
                to="/user-profile"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <UserIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">User Profile</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <BellIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Notifications</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
              >
                <ChartPieIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Analytics</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <footer className="p-3">
        <p className="text-xs text-gray-400 text-center">© 2024 INBOT</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
