import React, { useState } from 'react';
import MethodCard from '../components/MethodCard';
import { BookOpenIcon, CodeIcon } from '@heroicons/react/solid';

function APIReference() {
  // State to track which card is currently expanded
  const [expandedCard, setExpandedCard] = useState(null);

  // Function to handle card toggle
  const toggleCard = (cardName) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800">API Reference</h1>
      <p className="mb-10 text-lg text-gray-600 text-center">
        Explore the methods and functions available in the INBOT AI Library.
      </p>

      {/* Chatbot Initialization Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-6 w-6 text-gray-800" />
          <h2 className="text-3xl font-semibold text-gray-800">Chatbot Initialization</h2>
        </div>
        <MethodCard
          name="INBOTChatbot"
          description="Initializes the chatbot instance with your API key."
          parameters={[
            { name: "api_key", description: "Your Groq API key for authentication." },
          ]}
          returns="A new INBOTChatbot instance."
          example={`from inbot import INBOTChatbot

# Initialize the chatbot
chatbot = INBOTChatbot(api_key='your-api-key')`}
          expanded={expandedCard === 'INBOTChatbot'}
          onToggle={() => toggleCard('INBOTChatbot')}
        />
      </div>

      {/* Methods Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <CodeIcon className="h-6 w-6 text-gray-800" />
          <h2 className="text-3xl font-semibold text-gray-800">Methods</h2>
        </div>

        {/* Each method in a card design with collapsible details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MethodCard
            name="ask_question"
            description="Sends a question to the chatbot and receives a response."
            parameters={[{ name: "question", description: "The question string to be sent." }]}
            returns="A response object with the chatbot's answer."
            example={`response = chatbot.ask_question('What is the weather like today?')
print(response)`}
            expanded={expandedCard === 'ask_question'}
            onToggle={() => toggleCard('ask_question')}
          />

          <MethodCard
            name="upload_document"
            description="Uploads a document and saves it in the chatbot's data directory."
            parameters={[{ name: "file_path", description: "The path to the document." }]}
            returns="A success or error message."
            example={`upload_response = chatbot.upload_document('/path/to/document.pdf')
print(upload_response)`}
            expanded={expandedCard === 'upload_document'}
            onToggle={() => toggleCard('upload_document')}
          />

          <MethodCard
            name="parse_document"
            description="Parses an uploaded document and extracts its text content."
            parameters={[{ name: "file_path", description: "The path to the document." }]}
            returns="The extracted text."
            example={`parsed_text = chatbot.parse_document('/path/to/document.pdf')
print(parsed_text)`}
            expanded={expandedCard === 'parse_document'}
            onToggle={() => toggleCard('parse_document')}
          />

          <MethodCard
            name="clean_parsed_text"
            description="Cleans up and processes the parsed text for querying."
            parameters={[{ name: "parsed_text", description: "Raw text extracted from the document." }]}
            returns="The cleaned version of the text."
            example={`cleaned_text = chatbot.clean_parsed_text(parsed_text)
print(cleaned_text)`}
            expanded={expandedCard === 'clean_parsed_text'}
            onToggle={() => toggleCard('clean_parsed_text')}
          />
        </div>
      </div>
    </div>
  );
}

export default APIReference;
