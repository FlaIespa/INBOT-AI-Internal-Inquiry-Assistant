import React, { useState, useEffect } from 'react';
import { DocumentIcon, UploadIcon } from '@heroicons/react/solid';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function UserAnalyticsDashboard({ isSidebarCollapsed }) {
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    activeSessions: 0,
  });
  const [uploadTrends, setUploadTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const metricsResponse = await fetch('http://127.0.0.1:5000/api/user/metrics', { headers });
      const metricsData = await metricsResponse.json();

      const trendsResponse = await fetch('http://127.0.0.1:5000/api/user/upload-trends', { headers });
      const trendsData = await trendsResponse.json();

      const activityResponse = await fetch('http://127.0.0.1:5000/api/user/activity-logs', { headers });
      const activityData = await activityResponse.json();

      if (metricsResponse.ok) setMetrics(metricsData);
      if (trendsResponse.ok) setUploadTrends(trendsData.trends || []);
      if (activityResponse.ok) setRecentActivity(activityData.logs || []);
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = {
    labels: uploadTrends.map((item) => item.month),
    datasets: [
      {
        label: 'Documents Uploaded',
        data: uploadTrends.map((item) => item.count),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Analytics <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Gain insights into your activity and document trends.
          </p>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <DocumentIcon className="h-6 w-6 mb-2" />
            <h3 className="text-sm font-medium opacity-80">Total Documents</h3>
            <p className="text-xl font-bold">{metrics.totalDocuments}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <UploadIcon className="h-6 w-6 mb-2" />
            <h3 className="text-sm font-medium opacity-80">Active Sessions</h3>
            <p className="text-xl font-bold">{metrics.activeSessions}</p>
          </div>
        </div>

        {/* Upload Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Document Upload Trends
          </h2>
          {uploadTrends.length > 0 ? (
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data available for upload trends.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-200">{activity.description}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity to display.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserAnalyticsDashboard;
