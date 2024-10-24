import React from 'react';

function FAQPage() {
  const faqs = [
    {
      question: "How do I upload a document?",
      answer: "To upload a document, navigate to the File Management section and use the Upload Document feature."
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, INBOT supports PDF and DOCX files. We plan to support more formats in future updates."
    },
    {
      question: "How do I ask the chatbot a question?",
      answer: "Simply go to the Chatbot section and type your query in the input box. The chatbot will respond based on the available documents."
    },
    {
      question: "Can I delete a document after uploading?",
      answer: "Yes, you can delete a document by navigating to File Management, where you will see a list of uploaded files with delete options."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all uploaded documents and interactions are processed securely. We use encryption to protect your data."
    }
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{faq.question}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
