import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

function NotificationsPage({ isSidebarCollapsed }) {
  const initialNotifications = [
    {
      id: 1,
      message: 'System update completed successfully.',
      receivedAt: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      message: 'Chatbot inquiry responded.',
      receivedAt: '1 day ago',
      isRead: true,
    },
    {
      id: 3,
      message: 'New document uploaded: Company_Policies.pdf',
      receivedAt: '3 days ago',
      isRead: false,
    },
  ];

  const [notifications] = useState(initialNotifications);

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-4"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Stay updated with the latest alerts and updates.
          </p>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Notifications
          </h2>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700"
                >
                  <div className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <Bell className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.receivedAt}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You have no new notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NotificationsPage;
