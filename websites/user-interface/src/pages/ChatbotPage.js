import React from 'react';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChatbotTour from '../components/ChatbotTour';

function ChatbotPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showTour = searchParams.get("tour") === "true";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-56 flex flex-col items-start justify-center"
      >
        {/* Chatbot Container */}
        <div className="w-full max-w-6xl chatbot-page">
          <Chatbot />
        </div>
      </motion.div>
      {/* If the tour query parameter is present, overlay the ChatbotTour */}
      {showTour && <ChatbotTour />}
    </div>
  );
}

export default ChatbotPage;
