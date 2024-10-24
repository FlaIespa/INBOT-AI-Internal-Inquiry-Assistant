import React from 'react';
import { Link } from 'react-router-dom';
import { ChatAlt2Icon, FolderOpenIcon, CogIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl">
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-8">Welcome to INBOT!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Your AI-Powered Internal Assistant for Document Management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chatbot */}
          <Link to="/chatbot" className="hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
              <ChatAlt2Icon className="h-14 w-14 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chatbot</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Ask questions about your documents or receive assistance.
              </p>
            </div>
          </Link>

          {/* File Management */}
          <Link to="/file-management" className="hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 bg-green-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-green-100 dark:hover:bg-gray-600 transition-colors">
              <FolderOpenIcon className="h-14 w-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">File Management</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Upload, manage, and review company documents.
              </p>
            </div>
          </Link>

          {/* Settings */}
          <Link to="/settings" className="hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors">
              <CogIcon className="h-14 w-14 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Customize your experience and configure INBOT.
              </p>
            </div>
          </Link>

          {/* Help/FAQ */}
          <Link to="/help-faq" className="hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 bg-purple-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors">
              <QuestionMarkCircleIcon className="h-14 w-14 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & FAQ</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Find answers to common questions or get support.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
