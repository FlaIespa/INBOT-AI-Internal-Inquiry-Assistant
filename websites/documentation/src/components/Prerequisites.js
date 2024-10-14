import React from 'react';

function Prerequisites() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Prerequisites</h2>
      <p className="text-lg text-gray-700 mb-4">Before getting started, ensure you have the following:</p>
      <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700">
        <li className="font-semibold">Python 3.7 or higher</li>
        <li className="font-semibold">pip (Python package installer)</li>
        <li className="font-semibold">Groq API Key (for chatbot integration)</li>
      </ul>
    </div>
  );
}

export default Prerequisites;
