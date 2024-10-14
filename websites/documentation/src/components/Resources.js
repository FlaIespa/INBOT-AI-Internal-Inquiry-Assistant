import React from 'react';

function Resources() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Resources</h2>
      <ul className="list-disc list-inside space-y-4 text-gray-700">
        <li>
          <a href="https://github.com/FlaIespa/INBOT-AI-Internal-Inquiry-Assistant" 
             className="text-blue-600 hover:underline">
            GitHub Repository
          </a>
        </li>
        <li>
          <a href="https://groq.com/docs" 
             className="text-blue-600 hover:underline">
            Groq API Documentation
          </a>
        </li>
        <li>
          <a href="https://github.com/FlaIespa/INBOT-AI-Internal-Inquiry-Assistant/issues" 
             className="text-blue-600 hover:underline">
            Report an Issue
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Resources;
