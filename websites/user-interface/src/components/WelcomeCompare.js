import React from 'react';
import { MessageSquare, FilePlus } from 'lucide-react'; // Replaced ChatBubble with MessageSquare
import { motion } from 'framer-motion';

const WelcomeCompare = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const iconAnimation = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, -10, 10, -10, 10, 0],
      scale: 1.2,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-gray-900 dark:text-white">
      {/* Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-3xl md:text-4xl font-bold text-center mb-12"
      >
        INBOT vs. ChatGPT
      </motion.h2>

      {/* Comparison Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* INBOT Card */}
        <motion.div
          whileHover={{
            scale: 1.05,
            rotateX: 5,
            rotateY: -5,
            boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700 transform-gpu"
        >
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            <motion.div
              whileHover="hover"
              variants={iconAnimation}
              className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 inline-block shadow-lg"
            >
              <FilePlus className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            INBOT
          </h3>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• Integrated file management</li>
            <li>• Personalized document search & organization</li>
            <li>• Tailored AI experience from your own files</li>
          </ul>
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 
              transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />
        </motion.div>

        {/* ChatGPT Card */}
        <motion.div
          whileHover={{
            scale: 1.05,
            rotateX: 5,
            rotateY: -5,
            boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border border-gray-100 dark:border-gray-700 transform-gpu"
        >
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            <motion.div
              whileHover="hover"
              variants={iconAnimation}
              className="p-3 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 inline-block shadow-lg"
            >
              <MessageSquare className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            ChatGPT
          </h3>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• General-purpose conversational AI</li>
            <li>• Vast, web-based knowledge</li>
            <li>• No built-in file management features</li>
          </ul>
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600 
              transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WelcomeCompare;
