import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

const SidebarTour = () => {
  useEffect(() => {
    // Expand the sidebar if it's collapsed
    const expandSidebarIfCollapsed = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && sidebar.classList.contains('w-16')) {
        const toggleButton = document.querySelector('.sidebar-toggle');
        if (toggleButton) {
          toggleButton.click();
          return true;
        }
      }
      return false;
    };

    const wasCollapsed = expandSidebarIfCollapsed();
    // Wait for the sidebar animation to complete if it was collapsed
    const delay = wasCollapsed ? 350 : 0;

    const timeoutId = setTimeout(() => {
      // Ensure that all tour elements are present (we expect 10 elements with data-intro)
      const checkElementsExist = () =>
        document.querySelectorAll('[data-intro]').length >= 10;

      const interval = setInterval(() => {
        if (checkElementsExist()) {
          clearInterval(interval);
          const tour = introJs();
          tour.setOptions({
            showProgress: true,
            exitOnOverlayClick: false,
            disableInteraction: true,
          });
          tour.start();
        }
      }, 100);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

export default SidebarTour;
