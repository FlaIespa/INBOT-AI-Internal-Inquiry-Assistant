import React, { useState } from 'react';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 shadow-md p-4 rounded-lg mb-6">
      <h3
        className="font-semibold cursor-pointer text-lg text-gray-800 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '▲' : '▼'}
        </span>
      </h3>
      {isOpen && (
        <p className="mt-4 text-gray-700">
          {answer}
        </p>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Frequently Asked Questions (FAQs)</h2>

      <FAQItem 
        question="I get an 'API Key missing' error, what should I do?" 
        answer="Make sure you've set your API key correctly as an environment variable, or pass it directly when initializing the chatbot."
      />
      <FAQItem 
        question="Can I upload different file types?" 
        answer="Currently, we support PDF and DOCX files. Additional file types will be supported in future updates."
      />
    </div>
  );
}

export default FAQ;
