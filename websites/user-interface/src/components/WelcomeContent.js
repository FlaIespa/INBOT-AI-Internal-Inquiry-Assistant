import React from 'react';
import { FileText, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeContent = () => {
  // Variant for the entrance animation on each card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: 'easeOut' } 
    },
  };

  // Floating animation for the icons
  const floatingAnimation = {
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Icon hover animation
  const iconAnimation = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, -10, 10, -10, 10, 0],
      scale: 1.2,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-900 dark:text-white overflow-hidden">
      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-3xl md:text-4xl font-bold text-center mb-12"
      >
        Discover how{' '}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent inline-block"
        >
          INBOT
        </motion.span>{' '}
        transforms the way teams work.
      </motion.h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
            animate="animate" 
            className="mb-6"
          >
            <motion.div
              whileHover="hover"
              variants={iconAnimation}
              className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 inline-block shadow-lg"
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">
            Seamless{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Knowledge Integration
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Effortlessly upload and organize documents while allowing INBOT to extract key information for easy retrieval.
          </p>
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 
            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
            animate="animate" 
            className="mb-6"
          >
            <motion.div
              whileHover="hover"
              variants={iconAnimation}
              className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 inline-block shadow-lg"
            >
              <Cpu className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Workflow Optimization
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Let INBOT handle repetitive tasks and provide actionable insights so you can focus on what truly matters.
          </p>
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 
            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
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
            animate="animate" 
            className="mb-6"
          >
            <motion.div
              whileHover="hover"
              variants={iconAnimation}
              className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 inline-block shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">
            Robust{' '}
            <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Security & Privacy
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Keep your data safe with INBOT’s enterprise-grade encryption and commitment to user privacy.
          </p>
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeContent;
