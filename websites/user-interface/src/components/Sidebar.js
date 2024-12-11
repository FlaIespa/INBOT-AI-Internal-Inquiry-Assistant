import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChatAlt2Icon, CloudUploadIcon, CogIcon, QuestionMarkCircleIcon, UserIcon, BellIcon, ClipboardListIcon, SearchIcon, ChartPieIcon, HomeIcon } from '@heroicons/react/solid';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`h-screen bg-gray-800 text-white flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="p-4">
        {/* Collapsible Arrow */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
            <ChatAlt2Icon className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-bold ml-3">INBOT</h2>
          </div>
          <button onClick={toggleSidebar} className="text-white">
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/home" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6" />
                {!isCollapsed && <span>Home</span>}
              </Link>
            </li>
            <li>
              <Link to="/chatbot" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <ChatAlt2Icon className="h-6 w-6" />
                {!isCollapsed && <span>Chatbot</span>}
              </Link>
            </li>
            <li>
              <Link to="/file-management" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <CloudUploadIcon className="h-6 w-6" />
                {!isCollapsed && <span>File Management</span>}
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <CogIcon className="h-6 w-6" />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6" />
                {!isCollapsed && <span>Help/FAQ</span>}
              </Link>
            </li>

            {/* New Sidebar Links */}
            <li>
              <Link to="/user-profile" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <UserIcon className="h-6 w-6" />
                {!isCollapsed && <span>User Profile</span>}
              </Link>
            </li>
            <li>
              <Link to="/notifications" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <BellIcon className="h-6 w-6" />
                {!isCollapsed && <span>Notifications</span>}
              </Link>
            </li>
            <li>
              <Link to="/activity-logs" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <ClipboardListIcon className="h-6 w-6" />
                {!isCollapsed && <span>Activity Logs</span>}
              </Link>
            </li>
            <li>
              <Link to="/document-search" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <SearchIcon className="h-6 w-6" />
                {!isCollapsed && <span>Document Search</span>}
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard" className="flex items-center space-x-2 hover:bg-gray-700 p-3 rounded-lg">
                <ChartPieIcon className="h-6 w-6" />
                {!isCollapsed && <span>Admin Dashboard</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <footer className="p-4">
        <p className="text-sm text-gray-400">© 2024 INBOT</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
