import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChatAlt2Icon,
  FolderOpenIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-4xl w-full"
      >
        <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-gray-800 dark:text-white mb-8"
          >
            Welcome to INBOT!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-10"
          >
            Your AI-Powered Internal Assistant for Document Management.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Chatbot */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <Link to="/chatbot">
                <ChatAlt2Icon className="h-14 w-14 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chatbot</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Ask questions about your documents or receive assistance.
                </p>
              </Link>
            </motion.div>

            {/* File Management */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 bg-green-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-green-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <Link to="/file-management">
                <FolderOpenIcon className="h-14 w-14 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">File Management</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Upload, manage, and review company documents.
                </p>
              </Link>
            </motion.div>

            {/* Settings */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <Link to="/settings">
                <CogIcon className="h-14 w-14 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Customize your experience and configure INBOT.
                </p>
              </Link>
            </motion.div>

            {/* Help/FAQ */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 bg-purple-50 dark:bg-gray-700 rounded-lg shadow-md hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <Link to="/help-faq">
                <QuestionMarkCircleIcon className="h-14 w-14 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & FAQ</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Find answers to common questions or get support.
                </p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
