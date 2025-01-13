import React, { useState } from 'react';
import { PaperAirplaneIcon, ChatAlt2Icon } from '@heroicons/react/solid';

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    // ... existing handleSubmit code stays the same
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-screen bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg m-4">
      {/* Header - made more compact */}
      <header className="flex items-center justify-center py-3 border-b dark:border-gray-700">
        <ChatAlt2Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-100 ml-2">INBOT Chatbot</h1>
      </header>

      {/* Messages - with flex-grow to take remaining space */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} mb-3`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.type === 'bot'
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input section - fixed at bottom */}
      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2.5 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;