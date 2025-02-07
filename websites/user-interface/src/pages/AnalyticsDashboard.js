import React, { useState, useEffect } from 'react';
import { DocumentIcon, UploadIcon } from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';

function UserAnalyticsDashboard({ isSidebarCollapsed }) {
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    activeSessions: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const userId = user.id;

      // Fetch total documents
      const { data: totalDocs, error: totalDocsError } = await supabase
        .from('files') // Replace with your files table name
        .select('id')
        .eq('user_id', userId);

      if (totalDocsError) throw totalDocsError;

      // Fetch recent activity logs
      const { data: activityLogs, error: activityLogsError } = await supabase
        .from('activity_logs') // Replace with your activity logs table name
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);

      if (activityLogsError) throw activityLogsError;

      // Update state with fetched data
      setMetrics({
        totalDocuments: totalDocs.length,
        activeSessions: activityLogs.length, // Replace with actual session logic if needed
      });
      setRecentActivity(activityLogs);
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
            <UploadIcon className="h-6 w-6 mb-2" />
            <h3 className="text-sm font-medium opacity-80">Active Sessions</h3>
            <p className="text-xl font-bold">{metrics.activeSessions}</p>
          </div>
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
