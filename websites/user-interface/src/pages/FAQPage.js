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
        'INBOT is an AI-powered assistant designed to streamline workflows and enhance document and communication management.',
    },
    {
      question: 'How do I upload a document?',
      answer:
        'Navigate to the "File Management" page, click "Upload Document," and drag and drop your file or click to select one from your device.',
    },
    {
      question: 'How secure is my data?',
      answer:
        'We prioritize your privacy and security. All files and communications are encrypted and adhere to GDPR compliance standards.',
    },
    {
      question: 'Can I integrate INBOT with other tools?',
      answer:
        'Yes! INBOT can integrate with tools like Slack and Microsoft Teams to streamline collaboration.',
    },
    {
      question: 'How do I enable dark mode?',
      answer:
        'Go to the "Settings" page, navigate to the "Appearance" section, and toggle the dark mode switch.',
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
