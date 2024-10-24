import React, { useState } from 'react';
import { PencilIcon, DocumentTextIcon, ChatAlt2Icon } from '@heroicons/react/solid';

function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
        <div className="relative">
          {/* Editable Profile Picture */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 relative overflow-hidden shadow-lg">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full shadow-md cursor-pointer hover:bg-blue-600">
                <PencilIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">John Doe</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">john.doe@example.com</p>
          <p className="text-sm font-semibold text-blue-500 dark:text-blue-400">Admin</p>
        </div>

        {/* Editable Bio */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">About Me</h2>
          {editing ? (
            <textarea
              className="w-full p-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod neque in massa blandit gravida."
            ></textarea>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod neque in massa blandit gravida.
            </p>
          )}
        </div>

        {/* User Stats */}
        <div className="flex justify-between space-x-4">
          <div className="w-1/3 bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center">
            <ChatAlt2Icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-800 dark:text-white font-bold">125</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Chatbot Interactions</p>
          </div>
          <div className="w-1/3 bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center">
            <DocumentTextIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-800 dark:text-white font-bold">50</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Documents Uploaded</p>
          </div>
          <div className="w-1/3 bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center">
            <PencilIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-800 dark:text-white font-bold">10</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Edits Made</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="text-center">
          <button
            onClick={handleEditToggle}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            {editing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
