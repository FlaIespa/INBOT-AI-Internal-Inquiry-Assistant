import React from 'react';
import { Link } from 'react-router-dom';
import { ChatAlt2Icon, CloudUploadIcon, ChartBarIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

function GettingStartedPage() {
  // Function to start the Sidebar Tour on the current page (without navigation)
  const startSidebarTour = () => {
    introJs()
      .setOptions({
        steps: [
          {
            element: '.sidebar-profile',
            intro: 'This is your profile section. Click here to view or edit your profile.',
          },
          {
            element: '.sidebar-link-home',
            intro: 'Go to the Home page for an overview of your dashboard.',
          },
          {
            element: '.sidebar-link-fileManagement',
            intro: 'Use this to upload and manage your documents.',
          },
          {
            element: '.sidebar-link-chatbot',
            intro: 'Access the Chatbot to interact with INBOT.',
          },
          {
            element: '.sidebar-link-history',
            intro: 'View and manage your past interactions and chat history.',
          },
          {
            element: '.sidebar-link-userProfile',
            intro: 'View and update your user profile information here.',
          },
          {
            element: '.sidebar-link-notifications',
            intro: 'Check your notifications here.',
          },
          {
            element: '.sidebar-link-analytics',
            intro: 'View analytics and insights about your interactions.',
          },
          {
            element: '.sidebar-link-settings',
            intro: 'Modify your settings, including preferences and dark mode.',
          },
          {
            element: '.sidebar-link-faq',
            intro: 'Find help, documentation, and frequently asked questions.',
          },
          {
            element: '.sidebar-logout',
            intro: 'Click here to log out of your account safely.',
          },
        ],
        showProgress: true,
        exitOnOverlayClick: false,
      })
      .start();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
            Welcome to INBOT
          </h1>
          <p className="text-xl mb-10">
            Your intelligent assistant for seamless communication and efficient document management.
          </p>
          <div className="flex justify-center">
            <button
              onClick={startSidebarTour}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg transition-all hover:bg-gray-100"
            >
              Sidebar Tour
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI Chat Assistant Card */}
          <Link
            to="/chatbot"
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <ChatAlt2Icon className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center text-gray-900 dark:text-white">
              AI Chat Assistant
            </h2>
            <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
              Ask questions and receive intelligent responses.
            </p>
          </Link>
          {/* Document Manager Card */}
          <Link
            to="/file-management"
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <CloudUploadIcon className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center text-gray-900 dark:text-white">
              Document Manager
            </h2>
            <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
              Upload, organize, and manage your files.
            </p>
          </Link>
          {/* Analytics Dashboard Card */}
          <Link
            to="/admin-dashboard"
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <ChartBarIcon className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center text-gray-900 dark:text-white">
              Analytics Dashboard
            </h2>
            <p className="mt-1 text-center text-gray-600 dark:text-gray-300">
              Gain insights into your document activity.
            </p>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}

export default GettingStartedPage;
