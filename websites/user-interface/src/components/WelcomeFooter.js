import React from 'react';

const WelcomeFooter = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-purple-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-purple-400 transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-500 dark:hover:text-purple-400 transition-colors"
                >
                  How to maximize INBOT
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          © 2025 INBOT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default WelcomeFooter;
