import React from 'react';

function Troubleshooting() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Troubleshooting</h2>
      <ul className="list-disc list-inside space-y-4 text-gray-700">
        <li className="font-semibold">
          If you get an "API Key Missing" error, ensure the key is set correctly as an environment variable.
        </li>
        <li className="font-semibold">
          If the chatbot isn’t returning responses, check your API key and make sure it has enough credits.
        </li>
        <li className="font-semibold">
          If you encounter installation errors, try updating pip or using a virtual environment.
        </li>
      </ul>
    </div>
  );
}

export default Troubleshooting;
