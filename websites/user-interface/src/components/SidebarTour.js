import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

const SidebarTour = () => {
  useEffect(() => {
    let intervalId;

    // Function to expand the sidebar if it's collapsed
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
    const delay = wasCollapsed ? 500 : 0;

    const timeoutId = setTimeout(() => {
      // Check that at least one tour element exists
      const checkElementsExist = () => document.querySelectorAll('[data-intro]').length > 0;

      intervalId = setInterval(() => {
        if (checkElementsExist()) {
          clearInterval(intervalId);

          // Dynamically build steps by sorting elements by their vertical position (top)
          const steps = Array.from(document.querySelectorAll('[data-intro]'))
            .sort(
              (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top
            )
            .map((element) => ({
              element,
              intro: element.getAttribute('data-intro'),
            }));

          const tour = introJs();
          tour.setOptions({
            steps,
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
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return null;
};

export default SidebarTour;
