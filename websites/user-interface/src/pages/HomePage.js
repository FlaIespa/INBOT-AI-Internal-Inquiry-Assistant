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

  // Framer Motion container animations
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
      className="ml-56 min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section - White background */}
      <section className="w-full bg-white text-gray-800 py-20 px-4 border-b border-gray-200">
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
              className="px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg transition-all hover:bg-purple-700"
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
            className="block bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <ChatAlt2Icon className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center">
              AI Chat Assistant
            </h2>
            <p className="mt-1 text-center text-gray-600">
              Ask questions and receive intelligent responses.
            </p>
          </Link>

          {/* Document Manager Card */}
          <Link
            to="/file-management"
            className="block bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <CloudUploadIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center">
              Document Manager
            </h2>
            <p className="mt-1 text-center text-gray-600">
              Upload, organize, and manage your files.
            </p>
          </Link>

          {/* Analytics Dashboard Card */}
          <Link
            to="/admin-dashboard"
            className="block bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transform hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">
              <ChartBarIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="mt-2 text-xl font-bold text-center">
              Analytics Dashboard
            </h2>
            <p className="mt-1 text-center text-gray-600">
              Gain insights into your document activity.
            </p>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}

export default GettingStartedPage;
