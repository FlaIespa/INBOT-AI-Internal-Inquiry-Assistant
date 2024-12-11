import React from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';

function ChatbotPage() {
  return (
    <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Animated Chatbot Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start invisible and slightly below
        animate={{ opacity: 1, y: 0 }} // Fade in and slide up
        transition={{ duration: 0.8, ease: 'easeOut' }} // Smooth animation
        className="w-full max-w-5xl h-[80vh] bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl"
      >
        <Chatbot />
      </motion.div>
    </div>
  );
}

export default ChatbotPage;
