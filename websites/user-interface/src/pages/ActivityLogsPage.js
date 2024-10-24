import React, { useState } from 'react';
import { CalendarIcon, DocumentTextIcon, SearchIcon, UserIcon } from '@heroicons/react/solid';

function ActivityLogsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample activity logs data
  const activityLogs = [
    {
      id: 1,
      type: 'upload',
      description: 'Uploaded Company_Policies.pdf',
      user: 'John Doe',
      date: '2024-10-15 14:23',
    },
    {
      id: 2,
      type: 'edit',
      description: 'Edited Employee_Handbook.docx',
      user: 'Jane Smith',
      date: '2024-10-14 09:15',
    },
    {
      id: 3,
      type: 'login',
      description: 'Admin login from IP 192.168.1.100',
      user: 'Admin',
      date: '2024-10-13 18:47',
    },
  ];

  // Filter and search logic
  const filteredLogs = activityLogs.filter(
    (log) =>
      (filter === 'all' || log.type === filter) &&
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Activity Logs</h1>

        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-300" />
          </div>
        </div>

        {/* Filter by Activity Type */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upload')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'upload'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Uploads
          </button>
          <button
            onClick={() => setFilter('edit')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'edit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Edits
          </button>
          <button
            onClick={() => setFilter('login')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'login'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Logins
          </button>
        </div>

        {/* Activity Logs List */}
        <ul className="space-y-4">
          {filteredLogs.map((log) => (
            <li key={log.id} className="flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-4">
                {/* Activity Icon */}
                {log.type === 'upload' && (
                  <DocumentTextIcon className="h-6 w-6 text-green-500" />
                )}
                {log.type === 'edit' && (
                  <DocumentTextIcon className="h-6 w-6 text-yellow-500" />
                )}
                {log.type === 'login' && (
                  <UserIcon className="h-6 w-6 text-blue-500" />
                )}

                {/* Activity Description */}
                <div>
                  <p className="text-gray-700 dark:text-gray-200">{log.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {log.user} • {log.date}
                  </p>
                </div>
              </div>
              {/* Timestamp */}
              <div className="text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-5 w-5 inline mr-2" />
                {log.date}
              </div>
            </li>
          ))}
        </ul>

        {/* No Activity Logs */}
        {filteredLogs.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No activity logs found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ActivityLogsPage;
