import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

const ChatbotTour = () => {
  useEffect(() => {
    introJs()
      .setOptions({
        steps: [
          {
            intro: 'Welcome to the Chatbot page! Let us guide you on how to interact with INBOT.',
          },
          {
            element: '.file-selection-area',
            intro: 'This is where you select a document. Choose a document to provide context for your questions.',
          },
          {
            element: '.chatbot-header',
            intro: 'This is your conversation header where you can view and edit the conversation name.',
          },
          {
            element: '.chatbot-messages',
            intro: 'This area displays the conversation history between you and INBOT.',
          },
          {
            element: '.chatbot-input',
            intro: 'Type your question here. You can press Enter or click the send button to submit your question.',
          },
          {
            element: '.chatbot-send-btn',
            intro: 'Click this button to send your message.',
          },
          {
            intro: 'That concludes the Chatbot Tour. Enjoy interacting with INBOT!'
          }
        ],
        showProgress: true,
        exitOnOverlayClick: false,
      })
      .start();
  }, []);

  return null;
};

export default ChatbotTour;
