import React, { useState } from 'react';
import MethodCard from '../components/MethodCard';
import { BookOpenIcon, CodeIcon } from '@heroicons/react/solid';

function APIReference() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (cardName) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800">API Reference</h1>
      <p className="mb-10 text-lg text-gray-600 text-center">
        Explore the methods and functions available in the INBOT AI Library.
      </p>

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
          example={`from inbot import INBOTChatbot\n\nchatbot = INBOTChatbot(api_key='your-api-key')`}
          expanded={expandedCard === 'INBOTChatbot'}
          onToggle={() => toggleCard('INBOTChatbot')}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <CodeIcon className="h-6 w-6 text-gray-800" />
          <h2 className="text-3xl font-semibold text-gray-800">Methods</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Existing Methods */}
          <MethodCard
            name="ask_question"
            description="Sends a question to the chatbot and receives a response."
            parameters={[{ name: "question", description: "The question string to be sent." }]}
            returns="A response object with the chatbot's answer."
            example={`response = chatbot.ask_question('What is the weather like today?')\nprint(response)`}
            expanded={expandedCard === 'ask_question'}
            onToggle={() => toggleCard('ask_question')}
          />
          <MethodCard
            name="upload_document"
            description="Uploads a document and saves it in the chatbot's data directory."
            parameters={[{ name: "file_path", description: "The path to the document." }]}
            returns="A success or error message."
            example={`upload_response = chatbot.upload_document('/path/to/document.pdf')\nprint(upload_response)`}
            expanded={expandedCard === 'upload_document'}
            onToggle={() => toggleCard('upload_document')}
          />
          <MethodCard
            name="parse_document"
            description="Parses an uploaded document and extracts its text content."
            parameters={[{ name: "file_path", description: "The path to the document." }]}
            returns="The extracted text."
            example={`parsed_text = chatbot.parse_document('/path/to/document.pdf')\nprint(parsed_text)`}
            expanded={expandedCard === 'parse_document'}
            onToggle={() => toggleCard('parse_document')}
          />
          <MethodCard
            name="clean_parsed_text"
            description="Cleans up and processes the parsed text for querying."
            parameters={[{ name: "parsed_text", description: "Raw text extracted from the document." }]}
            returns="The cleaned version of the text."
            example={`cleaned_text = chatbot.clean_parsed_text(parsed_text)\nprint(cleaned_text)`}
            expanded={expandedCard === 'clean_parsed_text'}
            onToggle={() => toggleCard('clean_parsed_text')}
          />
          <MethodCard
            name="search_documents"
            description="Searches through all documents for the query with fuzzy matching."
            parameters={[
              { name: "query", description: "Search string or query to be matched." },
              { name: "threshold", description: "Fuzzy matching threshold." },
            ]}
            returns="Relevant search results or a 'No matches found' message."
            example={`results = chatbot.search_documents('Find keyword')\nprint(results)`}
            expanded={expandedCard === 'search_documents'}
            onToggle={() => toggleCard('search_documents')}
          />

          {/* Newly Added Methods */}
          <MethodCard
            name="Text Cleaning"
            description="Cleans and processes text for better readability and search efficiency."
            parameters={[{ name: "text", description: "The raw text to be cleaned." }]}
            returns="The cleaned version of the text."
            example={`cleaned_text = chatbot.clean_parsed_text(raw_text)\nprint(cleaned_text)`}
            expanded={expandedCard === 'Text Cleaning'}
            onToggle={() => toggleCard('Text Cleaning')}
          />
          <MethodCard
            name="Groq AI Integration"
            description="Uses Groq's AI model to generate context-aware responses."
            parameters={[{ name: "question", description: "The question string for AI processing." }]}
            returns="An AI-generated response."
            example={`response = chatbot.ask_question("What is the company's policy on remote work?")\nprint(response)`}
            expanded={expandedCard === 'Groq AI Integration'}
            onToggle={() => toggleCard('Groq AI Integration')}
          />
          <MethodCard
            name="Error Handling"
            description="Manages errors like file not found or parsing issues gracefully."
            parameters={[{ name: "error", description: "The error type to handle." }]}
            returns="Error message or fallback mechanism."
            example={`try:\n    chatbot.upload_document('/invalid/path')\nexcept FileNotFoundError as e:\n    print(f"Error: {e}")`}
            expanded={expandedCard === 'Error Handling'}
            onToggle={() => toggleCard('Error Handling')}
          />
        </div>
      </div>
    </div>
  );
}

export default APIReference;
