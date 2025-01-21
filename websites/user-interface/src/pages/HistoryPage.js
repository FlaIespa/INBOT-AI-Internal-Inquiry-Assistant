import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  // Mock conversation data
  const [conversations] = useState([
    { timestamp: '2025-01-01 10:00:00', message: 'What is INBOT?' },
    { timestamp: '2025-01-01 10:05:00', message: 'How can I integrate it into Slack?' },
    { timestamp: '2025-01-01 10:15:00', message: 'What are the GDPR compliance features?' },
  ]);

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Chatbot <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Review your past chatbot interactions for quick reference.
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {conversations.length > 0 ? (
            <ul className="space-y-4">
              {conversations.map((conversation, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong className="block text-sm font-semibold">Timestamp:</strong> {conversation.timestamp}
                  </p>
                  <p className="mt-2 text-gray-800 dark:text-gray-200">
                    <strong className="block text-sm font-semibold">Message:</strong> {conversation.message}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No conversation history found.
            </p>
          )}
        </div>

        {/* Clear History Button */}
        {conversations.length > 0 && (
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Clear History
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage;
