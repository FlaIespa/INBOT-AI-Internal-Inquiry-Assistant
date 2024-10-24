import React, { useState } from 'react';
import { BellIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/solid';

function NotificationsPage() {
  // Sample notifications data
  const initialNotifications = [
    {
      id: 1,
      type: 'system',
      message: 'System update completed successfully.',
      receivedAt: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'chatbot',
      message: 'Your chatbot inquiry has been responded to.',
      receivedAt: '1 day ago',
      isRead: true,
    },
    {
      id: 3,
      type: 'document',
      message: 'New document uploaded: Company_Policies.pdf',
      receivedAt: '3 days ago',
      isRead: false,
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  // Mark notification as read/unread
  const toggleReadStatus = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Notifications
        </h1>

        {/* Notifications List */}
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                notification.isRead
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-blue-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                {/* Notification Icon */}
                <BellIcon className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {notification.receivedAt}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleReadStatus(notification.id)}
                  className={`${
                    notification.isRead
                      ? 'text-gray-500 hover:text-green-500'
                      : 'text-green-500 hover:text-gray-500'
                  } transition-colors`}
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* No Notifications */}
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No new notifications.
          </p>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
