import React from 'react';
import { Link } from 'react-router-dom';
import { ChatAlt2Icon, CloudUploadIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className="ml-56 min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-8 py-16 flex flex-col items-center">
        {/* Welcome Section */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Welcome to{' '}
            <span className="relative">
              {/* Gradient Text */}
              <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                INBOT
              </span>
              {/* Floating Effect */}
              <span className="absolute inset-x-0 -bottom-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 h-1 w-full rounded-full"></span>
            </span>
          </h1>
          <p className="mt-5 text-lg text-gray-600 font-medium">
            Your intelligent assistant for seamless communication and{' '}
            <span className="text-blue-600 font-semibold">document management</span>.
          </p>
        </div>

        {/* Feature Cards Container */}
        <div className="w-full max-w-4xl mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Chat Card */}
            <Link to="/chatbot" className="group relative overflow-hidden rounded-xl">
              <div
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-300 border border-gray-100 h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    <ChatAlt2Icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center
                    bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300"
                  >
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                      →
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">AI Chat Assistant</h2>
                  <p className="text-gray-600">
                    Get instant answers and intelligent responses from our advanced AI system.
                  </p>
                </div>

                {/* Subtle highlight effect */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Documents Card */}
            <Link to="/file-management" className="group relative overflow-hidden rounded-xl">
              <div
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-300 border border-gray-100 h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    <CloudUploadIcon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center
                    bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300"
                  >
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                      →
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Document Manager</h2>
                  <p className="text-gray-600">
                    Upload, organize, and manage your files with intelligent assistance.
                  </p>
                </div>

                {/* Subtle highlight effect */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
