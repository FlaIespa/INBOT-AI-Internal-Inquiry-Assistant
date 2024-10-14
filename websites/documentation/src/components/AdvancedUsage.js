import React from 'react';
import CodeBlock from './CodeBlock';

function AdvancedUsage() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Advanced Usage</h2>
      <p className="text-lg text-gray-700 mb-6">
        You can also upload documents and ask questions based on their content:
      </p>

      <div className="rounded-md p-4">
        <CodeBlock 
          language="python" 
          code={`# Upload a document and use the parsed content
chatbot.upload_document('/path/to/your/document.pdf')
parsed_text = chatbot.parse_document('/path/to/your/document.pdf')

# Ask questions based on the document
response = chatbot.ask_question(parsed_text)
print(response)
`} 
        />
      </div>
    </div>
  );
}

export default AdvancedUsage;
