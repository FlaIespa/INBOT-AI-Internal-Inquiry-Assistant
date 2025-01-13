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
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        fill: true,
      },
    ],
  };

  return (
    <div
      className={`p-4 bg-gray-50 dark:bg-gray-900 h-screen transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-14' : 'ml-48'
      }`}
      style={{ paddingTop: '64px' }}
    >
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          My Analytics
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <>
            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-md">
                <DocumentIcon className="h-6 w-6 text-green-500 dark:text-green-300" />
                <div className="ml-3">
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    Total Documents
                  </h2>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {metrics.totalDocuments}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-md">
                <UploadIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
                <div className="ml-3">
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    Active Sessions
                  </h2>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {metrics.activeSessions}
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Trends */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                Document Upload Trends
              </h2>
              <Line data={chartData} />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                Recent Activity
              </h2>
              <ul className="space-y-3">
                {recentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-200">{activity.description}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserAnalyticsDashboard;
