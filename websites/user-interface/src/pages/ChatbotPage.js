import React from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

function ChatbotPage() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-56" // Add margin to account for sidebar width
      >
        <div className="h-full">
          <Chatbot />
        </div>
      </motion.div>
    </div>
  );
}

export default ChatbotPage;