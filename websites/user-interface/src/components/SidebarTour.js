import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

const SidebarTour = () => {
  useEffect(() => {
    introJs()
      .setOptions({
        steps: [
          {
            element: '.sidebar-profile',
            intro: 'This is your profile section. Click here to view or edit your profile.',
          },
          {
            element: '.sidebar-link-home',
            intro: 'Go to the Home page for an overview of your dashboard.',
          },
          {
            element: '.sidebar-link-chatbot',
            intro: 'Access the Chatbot to interact with INBOT.',
          },
          {
            element: '.sidebar-link-fileManagement',
            intro: 'Upload and manage your documents here.',
          },
          {
            element: '.sidebar-link-settings',
            intro: 'Change your settings and preferences here.',
          },
          {
            element: '.sidebar-link-faq',
            intro: 'Find help and FAQs in this section.',
          },
          {
            element: '.sidebar-link-userProfile',
            intro: 'View and update your user profile.',
          },
          {
            element: '.sidebar-link-notifications',
            intro: 'Check your notifications here.',
          },
          {
            element: '.sidebar-link-analytics',
            intro: 'View your analytics and insights here.',
          },
          {
            element: '.sidebar-link-history',
            intro: 'Access your chat history here.',
          },
          {
            element: '.sidebar-logout',
            intro: 'Click here to log out of your account.',
          },
        ],
        showProgress: true,
        exitOnOverlayClick: false,
      })
      .start();
  }, []);

  return null;
};

export default SidebarTour;
