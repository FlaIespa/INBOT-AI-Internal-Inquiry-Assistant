import React, { useState, useEffect } from 'react';
import { DocumentIcon, ChatIcon, RefreshIcon } from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function UserAnalyticsDashboard({ isSidebarCollapsed }) {
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    totalConversations: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [docChartData, setDocChartData] = useState(null);
  const [convChartData, setConvChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      const userId = user.id;

      // --- Documents Data ---
      const { data: docsData, error: docsError } = await supabase
        .from('files')
        .select('id, uploaded_at')
        .eq('user_id', userId);
      if (docsError) throw docsError;
      const totalDocuments = docsData.length;

      // Process document data for charting (group by day)
      const docCounts = {};
      docsData.forEach(doc => {
        const day = new Date(doc.uploaded_at).toLocaleDateString();
        docCounts[day] = (docCounts[day] || 0) + 1;
      });
      const docLabels = Object.keys(docCounts).sort((a, b) => new Date(a) - new Date(b));
      const docDataPoints = docLabels.map(label => docCounts[label]);
      const docChartDataObj = {
        labels: docLabels,
        datasets: [{
          label: 'Documents Uploaded',
          data: docDataPoints,
          fill: false,
          backgroundColor: 'rgba(59,130,246,0.5)', // blue
          borderColor: 'rgba(59,130,246,1)',
        }],
      };

      // --- Conversations Data ---
      const { count: conversationCount, error: convCountError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (convCountError) throw convCountError;

      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, created_at')
        .eq('user_id', userId);
      if (convError) throw convError;
      // Process conversation data for charting (group by day)
      const convCounts = {};
      convData.forEach(conv => {
        const day = new Date(conv.created_at).toLocaleDateString();
        convCounts[day] = (convCounts[day] || 0) + 1;
      });
      const convLabels = Object.keys(convCounts).sort((a, b) => new Date(a) - new Date(b));
      const convDataPoints = convLabels.map(label => convCounts[label]);
      const convChartDataObj = {
        labels: convLabels,
        datasets: [{
          label: 'Conversations Started',
          data: convDataPoints,
          fill: false,
          backgroundColor: 'rgba(16,185,129,0.5)', // green
          borderColor: 'rgba(16,185,129,1)',
        }],
      };

      // --- Recent Activity ---
      const { data: activityLogs, error: activityLogsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);
      if (activityLogsError) throw activityLogsError;

      // Update state with the fetched data
      setMetrics({
        totalDocuments,
        totalConversations: conversationCount || 0,
      });
      setRecentActivity(activityLogs);
      setDocChartData(docChartDataObj);
      setConvChartData(convChartDataObj);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler for the refresh button
  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-56'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Centered Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Analytics{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Gain insights into your activity and document management.
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            className="mt-4 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md focus:outline-none"
            disabled={loading}
          >
            <RefreshIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            Error: {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}

        {/* Metrics Section */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
              <DocumentIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Total Documents</h3>
              <p className="text-xl font-bold">{metrics.totalDocuments}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Conversations</h3>
              <p className="text-xl font-bold">{metrics.totalConversations}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
              <DocumentIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Recent Activity Count</h3>
              <p className="text-xl font-bold">{recentActivity.length}</p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documents Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Documents Uploaded Over Time
              </h2>
              {docChartData ? (
                <div className="h-64">
                  <Line
                    data={docChartData}
                    options={{ maintainAspectRatio: false, responsive: true }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No document data available.
                </p>
              )}
            </div>

            {/* Conversations Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Conversations Started Over Time
              </h2>
              {convChartData ? (
                <div className="h-64">
                  <Line
                    data={convChartData}
                    options={{ maintainAspectRatio: false, responsive: true }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversation data available.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {!loading && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Recent Activity
            </h2>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map(activity => (
                  <li
                    key={activity.id}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity to display.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAnalyticsDashboard;
