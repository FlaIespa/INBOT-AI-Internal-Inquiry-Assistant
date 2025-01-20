import React, { useState } from 'react';
import { PaperAirplaneIcon, ChatAlt2Icon } from '@heroicons/react/solid';

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from backend');
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: data.response },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Error fetching response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-screen bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl m-6">
      {/* Header */}
      <header className="flex items-center justify-center py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl">
        <ChatAlt2Icon className="h-6 w-6" />
        <h1 className="text-lg font-bold ml-2">INBOT Chatbot</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-6 rounded-b-3xl">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                msg.type === 'bot'
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-100'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all focus:ring-2 focus:ring-blue-500"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
