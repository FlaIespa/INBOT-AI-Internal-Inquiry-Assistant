import React from 'react';
import CodeBlock from './CodeBlock';

function BasicUsage() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Basic Usage</h2>
      <p className="text-lg text-gray-700 mb-6">
        Here's a minimal example to get started with using the INBOT AI Library:
      </p>

      <div className="rounded-md p-4">
        <CodeBlock 
          language="python" 
          code={`from inbot import INBOTChatbot

# Initialize the chatbot
chatbot = INBOTChatbot(api_key='your-api-key')

# Ask a question
response = chatbot.ask_question('What is the weather like today?')
print(response)
`} 
        />
      </div>
    </div>
  );
}

export default BasicUsage;
