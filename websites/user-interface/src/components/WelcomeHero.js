import React from 'react';
import { motion } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader'; // Import the WelcomeHeader component

const WelcomeHero = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navigation */}
      <WelcomeHeader /> 

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 text-center mt-16 relative">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Revolutionize Your Workflows <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            With AI-Powered Insights
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12"
        >
          Empower your team with state-of-the-art AI solutions that streamline workflows and 
          enhance productivity.
        </motion.p>

        {/* Interactive Square Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative mx-auto mt-8 mb-16"
        >
          <div className="w-full aspect-square max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
            
            {/* Content Container */}
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              {/* Placeholder for interactive content */}
              <div className="text-gray-400 dark:text-gray-500">
                Interactive Content Area
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 to-purple-600" />
        </motion.div>
      </main>
    </div>
  );
};

export default WelcomeHero;
