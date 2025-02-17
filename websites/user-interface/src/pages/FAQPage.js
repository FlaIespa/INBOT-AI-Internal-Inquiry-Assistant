// src/components/FAQPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

function FAQPage() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedQuestion((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqData = [
    {
      question: 'What is INBOT?',
      answer:
        'INBOT is an AI-powered assistant designed to streamline workflows, manage documents, and facilitate seamless communication across your organization.',
    },
    {
      question: 'How do I upload a document?',
      answer:
        'Navigate to the File Management page, click the Upload Document button, and either drag and drop your file or click to select one from your device.',
    },
    {
      question: 'What file formats are supported?',
      answer:
        'Currently, INBOT supports PDF and TXT files. These formats are processed to extract text and generate embeddings for AI-powered searches.',
    },
    {
      question: 'How secure is my data?',
      answer:
        'Your data security is our top priority. All files and communications are encrypted and stored securely, following industry-standard practices and GDPR compliance.',
    },
    {
      question: 'How does the AI Chat Assistant work?',
      answer:
        'The AI Chat Assistant uses embeddings generated from your documents to perform a similarity search with OpenAI’s API, allowing it to find and return the most relevant parts of your documents when you ask a question.',
    },
    {
      question: 'Can I create custom categories for my files?',
      answer:
        'Yes! In the File Management section, you can create your own categories to organize your files. You can then drag and drop files to assign them to the appropriate category.',
    },
    {
      question: 'How do I change the language of the interface?',
      answer:
        'You can change the interface language in the Settings page. We support English and Portuguese, and you can toggle between them as needed.',
    },
    {
      question: 'What should I do if I need help?',
      answer:
        'If you have questions or need support, check out our Help/FAQ section for answers to common questions. You can also contact our support team through the contact form on our website.',
    },
    {
      question: 'How are file embeddings generated?',
      answer:
        'When you upload a document, the text is extracted (using pdf.js for PDFs or built-in text extraction for TXT files), and then an embedding is generated using OpenAI’s API. This embedding is stored in the database to help with document search and retrieval.',
    },
  ];

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Find answers to common questions about INBOT.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              {/* Question Header */}
              <div
                onClick={() => toggleQuestion(index)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h2>
                </div>
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 dark:text-gray-300"
                >
                  ▼
                </motion.span>
              </div>

              {/* Answer Section */}
              {expandedQuestion === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-xs text-gray-600 dark:text-gray-400"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default FAQPage;
