import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CodeIcon } from '@heroicons/react/solid';  // Import icons

function Sidebar() {
  const location = useLocation();

  // Function to dynamically apply styles to active link
  const getLinkClasses = (path) => {
    return location.pathname === path
      ? 'bg-gray-300 text-gray-900 flex items-center space-x-3 p-3 rounded-md w-full transition duration-150' // Ensure full width
      : 'hover:bg-gray-200 text-gray-700 flex items-center space-x-3 p-3 rounded-md w-full transition duration-150';
  };

  // Function to dynamically apply styles to active icons
  const getIconClasses = (path) => {
    return location.pathname === path ? 'text-gray-900' : 'text-gray-500';
  };

  return (
    <div className="w-64 h-screen bg-gray-100 text-gray-700 fixed">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10 text-gray-800">INBOT Docs</h1>
        <ul className="space-y-6">
          <li>
            <Link to="/" className={getLinkClasses('/')}>
              <HomeIcon className={`w-6 h-6 ${getIconClasses('/')}`} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/getting-started" className={getLinkClasses('/getting-started')}>
              <BookOpenIcon className={`w-6 h-6 ${getIconClasses('/getting-started')}`} />
              <span>Getting Started</span>
            </Link>
          </li>
          <li>
            <Link to="/api-reference" className={getLinkClasses('/api-reference')}>
              <CodeIcon className={`w-6 h-6 ${getIconClasses('/api-reference')}`} />
              <span>API Reference</span>
            </Link>
          </li>
          
          <li>            
          <Link to="/slack-integration" className={getLinkClasses('/slack-integration')}>
              <CodeIcon className={`w-6 h-6 ${getIconClasses('/slack-integration')}`} />
              <span>Slack Integration</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
