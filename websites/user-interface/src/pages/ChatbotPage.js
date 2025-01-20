import React from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';

function ChatbotPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-56 flex items-start justify-center" // Added `pt-16` to pull the chatbot up
      >
        {/* Chatbot Container */}
        <div className="w-full max-w-6xl">
          <Chatbot />
        </div>
      </motion.div>
    </div>
  );
}

export default ChatbotPage;
