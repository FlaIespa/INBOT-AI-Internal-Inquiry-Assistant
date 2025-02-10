import React, { useState, useEffect } from 'react';
import { DocumentIcon, ChatIcon } from '@heroicons/react/solid';
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
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get the current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      const userId = user.id;

      // Fetch files (documents) data for charting
      const { data: docsData, error: docsError } = await supabase
        .from('files')
        .select('id, uploaded_at')
        .eq('user_id', userId);
      if (docsError) throw docsError;
      const totalDocuments = docsData.length;

      // Process chart data: Group documents by day
      const counts = {};
      docsData.forEach(doc => {
        const day = new Date(doc.uploaded_at).toLocaleDateString();
        counts[day] = (counts[day] || 0) + 1;
      });
      const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
      const dataPoints = labels.map(label => counts[label]);
      const chartDataObj = {
        labels,
        datasets: [{
          label: 'Documents Uploaded',
          data: dataPoints,
          fill: false,
          backgroundColor: 'rgba(59,130,246,0.5)',  // blue
          borderColor: 'rgba(59,130,246,1)',
        }],
      };

      // Fetch conversation count
      const { count: conversationCount, error: convError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (convError) throw convError;

      // Fetch recent activity logs
      const { data: activityLogs, error: activityLogsError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);
      if (activityLogsError) throw activityLogsError;

      setMetrics({
        totalDocuments,
        totalConversations: conversationCount || 0,
      });
      setRecentActivity(activityLogs);
      setChartData(chartDataObj);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Analytics <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Gain insights into your activity and document management.
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
            <ChatIcon className="h-6 w-6 mb-2" />
            <h3 className="text-sm font-medium opacity-80">Conversations</h3>
            <p className="text-xl font-bold">{metrics.totalConversations}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Documents Uploaded Over Time
          </h2>
          {chartData ? (
            <div className="h-64">
              <Line data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data to display.</p>
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
