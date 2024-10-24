import React from 'react';
import Chatbot from '../components/Chatbot'; // Import the Chatbot component

function ChatbotPage() {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex-grow">
        <Chatbot /> {/* Render the chatbot component */}
      </div>
    </div>
  );
}

export default ChatbotPage;
