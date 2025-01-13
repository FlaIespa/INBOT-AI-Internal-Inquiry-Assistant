import React, { useState } from 'react';
import { QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I upload a document?",
      answer: "Navigate to the File Management section and use the Upload Document feature. Select your file, and it will be securely uploaded to the system."
    },
    {
      question: "What file formats are supported?",
      answer: "INBOT currently supports PDF, DOCX, JPG, PNG, and JPEG files. More formats may be added in the future based on user feedback."
    },
    {
      question: "How do I preview an uploaded document?",
      answer: "In the File Management or Document Search section, click on the eye icon next to a file to view a preview of the document."
    },
    {
      question: "How do I delete a document after uploading?",
      answer: "Go to the File Management or Document Search section. Locate the file you wish to delete and click the trash icon to remove it permanently."
    },
    {
      question: "Can I download my uploaded files?",
      answer: "Yes, you can download any uploaded file by clicking the download icon in the File Management or Document Search section."
    },
    {
      question: "How do I ask the chatbot a question?",
      answer: "Go to the Chatbot section, type your query in the input box, and press Enter. The chatbot will respond using the available documents."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use encryption to secure your data. Additionally, uploaded documents are stored securely, and you have full control over managing your files."
    },
    {
      question: "What happens if I delete a file?",
      answer: "When you delete a file, it is removed from both the database and the storage system. This ensures the file is no longer accessible or searchable."
    },
    {
      question: "How can I see all the files I've uploaded?",
      answer: "You can view a list of all uploaded files in the File Management section. The list updates automatically to reflect your latest uploads or deletions."
    },
    {
      question: "What if the chatbot cannot answer my question?",
      answer: "If the chatbot cannot find relevant information in your uploaded documents, it will provide a fallback response indicating it could not find a match."
    }
  ];

  return (
    <div className="ml-56 flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {faq.question}
                </span>
                <ChevronDownIcon 
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-3"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Need More Help?
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Couldn't find what you're looking for? Contact our support team for assistance.
          </p>
          <button className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;