import React, { useState } from 'react';
import { Bell, Trash2, Check } from 'lucide-react';

function NotificationsPage({ isSidebarCollapsed }) {
  const initialNotifications = [
    {
      id: 1,
      message: 'System update completed.',
      receivedAt: '2h ago',
      isRead: false,
    },
    {
      id: 2,
      message: 'Chatbot inquiry responded.',
      receivedAt: '1d ago',
      isRead: true,
    },
    {
      id: 3,
      message: 'New doc: Company_Policies.pdf',
      receivedAt: '3d ago',
      isRead: false,
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleReadStatus = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div
      className={`p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-screen transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-56'
      }`}
      style={{ paddingTop: '64px' }} // Adjust for header height
    >
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>

        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex justify-between items-center p-2 rounded ${
                notification.isRead ? 'bg-gray-100 dark:bg-gray-600' : 'bg-blue-50 dark:bg-blue-900'
              }`}
            >
              <div className="flex items-center">
                <Bell className="w-4 h-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{notification.receivedAt}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleReadStatus(notification.id)}
                  className={`${
                    notification.isRead ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {notifications.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            No new notifications.
          </p>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
