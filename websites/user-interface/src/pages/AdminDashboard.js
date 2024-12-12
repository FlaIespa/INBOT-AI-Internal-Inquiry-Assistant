import React, { useState, useEffect } from 'react';
import {
  DocumentIcon,
  UploadIcon,
  ChartBarIcon,
} from '@heroicons/react/solid';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function UserAnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    activeSessions: 0,
  });
  const [uploadTrends, setUploadTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data for individual user
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user-specific metrics
      const metricsResponse = await fetch('http://127.0.0.1:5000/api/user/metrics', { headers });
      const metricsData = await metricsResponse.json();

      // Fetch user-specific upload trends
      const trendsResponse = await fetch('http://127.0.0.1:5000/api/user/upload-trends', { headers });
      const trendsData = await trendsResponse.json();

      // Fetch user-specific recent activity
      const activityResponse = await fetch('http://127.0.0.1:5000/api/user/activity-logs', { headers });
      const activityData = await activityResponse.json();

      // Set state with fetched data
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

  // Chart data for document upload trends
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          My Analytics
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <>
            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Total Documents */}
              <div className="flex items-center p-6 bg-green-100 dark:bg-green-900 rounded-lg shadow-lg">
                <DocumentIcon className="h-10 w-10 text-green-500 dark:text-green-300" />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Total Documents
                  </h2>
                  <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
                    {metrics.totalDocuments}
                  </p>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="flex items-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-lg">
                <UploadIcon className="h-10 w-10 text-yellow-500 dark:text-yellow-300" />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Active Sessions
                  </h2>
                  <p className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
                    {metrics.activeSessions}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Upload Trends (Chart) */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Document Upload Trends
              </h2>
              <Line data={chartData} />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Recent Activity
              </h2>
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <p className="text-gray-700 dark:text-gray-200">{activity.description}</p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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
