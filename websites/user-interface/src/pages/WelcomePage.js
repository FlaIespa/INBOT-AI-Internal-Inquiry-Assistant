import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react'; // Import Lottie
import robotAnimation from '../assets/robot_animation.json'; // Import animation file

function WelcomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Inner Container with INBOT Branding Colors */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl text-center">
          {/* Lottie Animation */}
          <div className="mb-6 flex justify-center">
            <Lottie
              animationData={robotAnimation}
              style={{ height: 150, width: 150 }}
              loop
            />
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            Welcome to INBOT
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-8">
            INBOT is your AI-powered assistant for smarter document management and seamless conversations.
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-md text-sm font-medium hover:bg-purple-600 dark:hover:bg-purple-700">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WelcomePage;
