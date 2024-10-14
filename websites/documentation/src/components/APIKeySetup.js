import React from 'react';
import CodeBlock from './CodeBlock';

function APIKeySetup() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Setting Up Your API Key</h2>
      <p className="text-lg text-gray-700 mb-6">
        To use the INBOT AI Library, you need a valid Groq API key. Follow these steps to configure it:
      </p>

      <ol className="list-decimal list-inside space-y-6 pl-4 text-gray-700">
        <li className="font-semibold">
          Obtain your API key from the Groq platform.
        </li>

        <li className="font-semibold">
          Add the key to your environment variables:
          <div className="rounded-md p-4 mt-2">
            <CodeBlock language="bash" code={`export GROQ_API_KEY='your-api-key'`} />
          </div>
        </li>

        <li className="font-semibold">
          Use this key when initializing the chatbot in your project.
        </li>
      </ol>
    </div>
  );
}

export default APIKeySetup;
