import React, { useState } from 'react';
import { PaperAirplaneIcon, ChatAlt2Icon } from '@heroicons/react/solid';

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // To show a loading indicator

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    setMessages([...messages, { type: 'user', text: input }]);

    // Clear input field
    setInput('');
    setIsLoading(true);

    try {
      // Send message to the backend API
      const response = await fetch('http://127.0.0.1:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add bot's response to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: data.response },
        ]);
      } else {
        // Handle API error
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: 'Something went wrong. Please try again later.' },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Failed to connect to the server. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* Header */}
      <header className="flex items-center justify-center mb-4">
        <ChatAlt2Icon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100 ml-2">INBOT Chatbot</h1>
      </header>

      {/* Messages */}
      <div className="flex-grow messages overflow-y-auto bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`message mb-2 ${msg.type === 'bot' ? 'text-left' : 'text-right'}`}>
            <p className={`inline-block p-3 rounded-3xl ${msg.type === 'bot' ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100' : 'bg-blue-500 text-white'}`}>
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="message text-left">
            <p className="inline-block p-3 rounded-3xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
              Typing...
            </p>
          </div>
        )}
      </div>

      {/* Input field and send button */}
      <form onSubmit={handleSubmit} className="flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 focus:outline-none"
        >
          <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
