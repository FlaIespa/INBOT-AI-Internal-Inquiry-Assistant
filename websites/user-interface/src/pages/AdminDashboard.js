import React from 'react';
import {
  UsersIcon,
  DocumentIcon,
  UploadIcon,
  ChartBarIcon,
} from '@heroicons/react/solid';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function AdminDashboard() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Documents Uploaded',
        data: [30, 50, 40, 60, 80, 90, 70, 100, 120, 110],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Admin Dashboard
        </h1>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="flex items-center p-6 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-lg">
            <UsersIcon className="h-10 w-10 text-blue-500 dark:text-blue-300" />
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Total Users</h2>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">1,240</p>
            </div>
          </div>

          {/* Total Documents */}
          <div className="flex items-center p-6 bg-green-100 dark:bg-green-900 rounded-lg shadow-lg">
            <DocumentIcon className="h-10 w-10 text-green-500 dark:text-green-300" />
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Total Documents</h2>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">3,582</p>
            </div>
          </div>

          {/* Active Users */}
          <div className="flex items-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-lg">
            <UploadIcon className="h-10 w-10 text-yellow-500 dark:text-yellow-300" />
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Active Users</h2>
              <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">820</p>
            </div>
          </div>
        </div>

        {/* Document Upload Trends (Chart) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Document Upload Trends
          </h2>
          <Line data={data} />
        </div>

        {/* User Management & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              User Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-200">Jane Smith</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role: Admin</p>
                </div>
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-200">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role: User</p>
                </div>
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div>
                  <p className="font-bold text-gray-700 dark:text-gray-200">Mary Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role: User</p>
                </div>
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-700 dark:text-gray-200">John Doe uploaded a document</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
              </li>
              <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-700 dark:text-gray-200">Jane Smith created a new user</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</span>
              </li>
              <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-700 dark:text-gray-200">Mary Johnson updated her profile</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
