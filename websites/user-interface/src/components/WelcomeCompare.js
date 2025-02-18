import React from 'react';
import { MessageSquare, FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeCompare = () => {
  // Container variant for staggering if needed
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.3 },
    },
  };

  // Variant for the INBOT card (appearing from left)
  const leftCardVariants = {
    hidden: { opacity: 0, x: -200, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  // Variant for the ChatGPT card (appearing from right)
  const rightCardVariants = {
    hidden: { opacity: 0, x: 200, scale: 0.8, rotate: 10 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Animated Title */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-center mb-12"
      >
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          INBOT
        </span>{' '}
        vs. ChatGPT
      </motion.h2>

      {/* Cards Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-8"
      >
        {/* INBOT Card */}
        <motion.div
          variants={leftCardVariants}
          whileHover={{ scale: 1.05 }}
          className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <FilePlus className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">INBOT</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Integrated file management</li>
              <li>• Personalized document search</li>
              <li>• Tailored AI from your own files</li>
            </ul>
          </div>
        </motion.div>

        {/* ChatGPT Card */}
        <motion.div
          variants={rightCardVariants}
          whileHover={{ scale: 1.05 }}
          className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">ChatGPT</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• General-purpose conversational AI</li>
              <li>• Vast web-based knowledge</li>
              <li>• No built-in file management</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WelcomeCompare;
