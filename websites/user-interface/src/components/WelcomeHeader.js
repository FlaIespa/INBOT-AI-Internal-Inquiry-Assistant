import React from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll'; // Import react-scroll for smooth scrolling
import { motion } from 'framer-motion';

const WelcomeHeader = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-gray-50 dark:bg-gray-900">
      {/* INBOT Title with Gradient Underline */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold tracking-tight"
      >
        <Link to="/" className="relative">
          INBOT
          <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
        </Link>
      </motion.div>

      {/* Navigation Links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-6"
      >
        <ScrollLink
          to="WelcomeAboutUs" // Target section's ID
          smooth={true} // Smooth scroll
          offset={-80} // Offset for fixed header
          duration={500} // Duration of scroll
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer"
        >
          About us
        </ScrollLink>
        <Link
          to="/login"
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md font-semibold shadow-md hover:from-blue-700 hover:to-purple-700"
        >
          Try INBOT For Free
        </Link>
      </motion.div>
    </nav>
  );
};

export default WelcomeHeader;
