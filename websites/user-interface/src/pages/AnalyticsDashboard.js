import React, { useState, useEffect } from 'react';
import {
  DocumentIcon,
  ChatIcon,
  RefreshIcon,
} from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function UserAnalyticsDashboard({ isSidebarCollapsed }) {
  // Main metrics
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    totalConversations: 0,
    totalMessages: 0,
    averageConversationLength: 0, // new
    totalUserWordCount: 0,       // new
  });

  // Chart data states
  const [docChartData, setDocChartData] = useState(null);
  const [convChartData, setConvChartData] = useState(null);
  const [msgChartData, setMsgChartData] = useState(null);
  const [roleDistChartData, setRoleDistChartData] = useState(null);
  const [fileTypeDistChartData, setFileTypeDistChartData] = useState(null);

  // Lists for displaying data
  const [largestFiles, setLargestFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);

  // Loading / error states
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Fetch and compute all analytics
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Get current user session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      const userId = user.id;

      // ----------------------------------------------------------------
      // 2) Fetch FILES data
      //    - total documents
      //    - largest 5, recent 5
      //    - file type distribution
      //    - doc chart data (uploads over time)
      // ----------------------------------------------------------------
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('id, name, size, file_type, uploaded_at')
        .eq('user_id', userId);
      if (filesError) throw filesError;

      const totalDocuments = filesData.length;

      // Largest 5 files
      const sortedBySize = [...filesData].sort((a, b) => (b.size || 0) - (a.size || 0));
      const top5Largest = sortedBySize.slice(0, 5);

      // Recent 5 files
      const sortedByDate = [...filesData].sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );
      const top5Recent = sortedByDate.slice(0, 5);

      // File type distribution (pie chart)
      const typeCounts = {};
      filesData.forEach((file) => {
        if (file.file_type) {
          const ft = file.file_type.toLowerCase();
          typeCounts[ft] = (typeCounts[ft] || 0) + 1;
        }
      });
      const fileTypeLabels = Object.keys(typeCounts);
      const fileTypeDataPoints = fileTypeLabels.map((t) => typeCounts[t]);
      const fileTypeDistData = {
        labels: fileTypeLabels,
        datasets: [
          {
            data: fileTypeDataPoints,
            backgroundColor: [
              '#6366F1', // Indigo
              '#F59E0B', // Amber
              '#10B981', // Emerald
              '#EF4444', // Red
              '#3B82F6', // Blue
              // add more colors if needed
            ],
          },
        ],
      };

      // Documents over time (line chart)
      const docCounts = {};
      filesData.forEach((doc) => {
        const day = new Date(doc.uploaded_at).toLocaleDateString();
        docCounts[day] = (docCounts[day] || 0) + 1;
      });
      const docLabels = Object.keys(docCounts).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const docDataPoints = docLabels.map((label) => docCounts[label]);
      const docChartDataObj = {
        labels: docLabels,
        datasets: [
          {
            label: 'Documents Uploaded',
            data: docDataPoints,
            fill: false,
            backgroundColor: 'rgba(59,130,246,0.5)', // blue
            borderColor: 'rgba(59,130,246,1)',
          },
        ],
      };

      // ----------------------------------------------------------------
      // 3) Fetch CONVERSATIONS data
      //    - total conversations
      //    - recent 5 conversations
      //    - conv chart data (convs over time)
      // ----------------------------------------------------------------
      // Count total conversations
      const { count: conversationCount, error: convCountError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (convCountError) throw convCountError;

      // Retrieve conversation rows (including name)
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, created_at, conversation_name')
        .eq('user_id', userId);
      if (convError) throw convError;

      // Sort for the 5 most recent
      const sortedConvsByDate = [...convData].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const top5Conversations = sortedConvsByDate.slice(0, 5);

      // Group convs by day for line chart
      const convCounts = {};
      convData.forEach((conv) => {
        const day = new Date(conv.created_at).toLocaleDateString();
        convCounts[day] = (convCounts[day] || 0) + 1;
      });
      const convLabels = Object.keys(convCounts).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const convDataPoints = convLabels.map((label) => convCounts[label]);
      const convChartDataObj = {
        labels: convLabels,
        datasets: [
          {
            label: 'Conversations Started',
            data: convDataPoints,
            fill: false,
            backgroundColor: 'rgba(16,185,129,0.5)', // green
            borderColor: 'rgba(16,185,129,1)',
          },
        ],
      };

      // ----------------------------------------------------------------
      // 4) Fetch MESSAGES data
      //    - total messages
      //    - messages over time (line chart)
      //    - average conversation length (# messages / # convs)
      //    - distribution of roles (pie chart: user vs bot)
      //    - word frequency (top 5 keywords)
      // ----------------------------------------------------------------
      const userConversationIds = convData.map((c) => c.id);
      let totalMessages = 0;
      let msgChartDataObj = null;
      let avgConversationLength = 0;
      let userCount = 0;
      let botCount = 0;
      let totalUserWords = 0;
      const conversationMessageCount = {}; // for average length

      // For top keywords
      const wordFreq = {};

      if (userConversationIds.length > 0) {
        // Retrieve messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('conversation_messages')
          .select('id, created_at, conversation_id, role, message')
          .in('conversation_id', userConversationIds);
        if (messagesError) throw messagesError;

        totalMessages = messagesData.length;

        // 4a) Group messages by day => line chart
        const msgCounts = {};
        messagesData.forEach((msg) => {
          // For average conversation length
          conversationMessageCount[msg.conversation_id] =
            (conversationMessageCount[msg.conversation_id] || 0) + 1;

          // For distribution of roles
          if (msg.role === 'user') userCount++;
          if (msg.role === 'bot') botCount++;

          // For word frequency (only user messages)
          if (msg.role === 'user' && msg.message) {
            // Count total user words
            const rawWords = msg.message.trim().split(/\s+/);
            totalUserWords += rawWords.length;

            // For top keywords (ignore short words, strip punctuation)
            rawWords.forEach((w) => {
              const clean = w
                .toLowerCase()
                .replace(/[^\w]/g, ''); // remove punctuation
              if (clean.length < 3) return; // skip short words
              wordFreq[clean] = (wordFreq[clean] || 0) + 1;
            });
          }

          // For messages over time
          const day = new Date(msg.created_at).toLocaleDateString();
          msgCounts[day] = (msgCounts[day] || 0) + 1;
        });

        // Build the line chart
        const msgLabels = Object.keys(msgCounts).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        const msgDataPoints = msgLabels.map((label) => msgCounts[label]);
        msgChartDataObj = {
          labels: msgLabels,
          datasets: [
            {
              label: 'Messages Over Time',
              data: msgDataPoints,
              fill: false,
              backgroundColor: 'rgba(255,165,0,0.5)', // orange
              borderColor: 'rgba(255,165,0,1)',
            },
          ],
        };

        // 4b) Average conversation length
        //    sum of all message counts / totalConversations
        const sumMessageCounts = Object.values(conversationMessageCount).reduce(
          (acc, c) => acc + c,
          0
        );
        avgConversationLength =
          conversationCount > 0 ? sumMessageCounts / conversationCount : 0;

        // 4c) Role distribution => user vs. bot
        const roleDistData = {
          labels: ['User Messages', 'Bot Messages'],
          datasets: [
            {
              data: [userCount, botCount],
              backgroundColor: ['#3B82F6', '#F59E0B'], // blue / amber
            },
          ],
        };

        setRoleDistChartData(roleDistData);
      }

      // 4d) Word frequency => top 5
      const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
      const top5Words = sortedWords.slice(0, 5);

      // ----------------------------------------------------------------
      // 5) Update state
      // ----------------------------------------------------------------
      setMetrics({
        totalDocuments,
        totalConversations: conversationCount || 0,
        totalMessages,
        averageConversationLength: Number(avgConversationLength.toFixed(2)),
        totalUserWordCount: totalUserWords,
      });

      setDocChartData(docChartDataObj);
      setConvChartData(convChartDataObj);
      setMsgChartData(msgChartDataObj);
      setFileTypeDistChartData(fileTypeDistData);

      setLargestFiles(top5Largest);
      setRecentFiles(top5Recent);
      setRecentConversations(top5Conversations);
      setTopKeywords(top5Words);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        {/* Header */}
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

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            Error: {error}
          </div>
        )}

        {/* Loading */}
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

        {/* Metric Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 1) Total Documents */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
              <DocumentIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Total Documents</h3>
              <p className="text-xl font-bold">{metrics.totalDocuments}</p>
            </div>

            {/* 2) Total Conversations */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Conversations</h3>
              <p className="text-xl font-bold">{metrics.totalConversations}</p>
            </div>

            {/* 3) Total Messages */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Total Messages</h3>
              <p className="text-xl font-bold">{metrics.totalMessages}</p>
            </div>

            {/* 4) Average Conversation Length */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Avg Conv Length</h3>
              <p className="text-xl font-bold">
                {metrics.averageConversationLength}
              </p>
            </div>

            {/* 5) Total User Word Count */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-600 to-red-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">User Word Count</h3>
              <p className="text-xl font-bold">{metrics.totalUserWordCount}</p>
            </div>
          </div>
        )}

        {/* 1) Documents / Conversations Charts */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documents Over Time */}
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

            {/* Conversations Over Time */}
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

        {/* 2) Messages Over Time Chart + Role Distribution */}
        {!loading && msgChartData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Messages Over Time */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Messages Over Time
              </h2>
              <div className="h-64">
                <Line
                  data={msgChartData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>

            {/* Role Distribution (user vs bot) */}
            {roleDistChartData && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Role Distribution
                </h2>
                <div className="h-64 flex items-center justify-center">
                  <Pie
                    data={roleDistChartData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3) File Type Distribution (Pie) */}
        {!loading && fileTypeDistChartData && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              File Type Distribution
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={fileTypeDistChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>
        )}

        {/* 4) Lists: Largest Files, Recent Files, Recent Conversations, Top Keywords */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Largest Files */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Top 5 Largest Files
              </h2>
              {largestFiles.length > 0 ? (
                <ul className="space-y-2">
                  {largestFiles.map((f) => (
                    <li key={f.id} className="text-sm text-gray-700 dark:text-gray-200">
                      <strong>{f.name}</strong> - {(f.size / 1024).toFixed(2)} KB
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No files found.
                </p>
              )}
            </div>

            {/* Recent Files */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Top 5 Recent Files
              </h2>
              {recentFiles.length > 0 ? (
                <ul className="space-y-2">
                  {recentFiles.map((f) => (
                    <li key={f.id} className="text-sm text-gray-700 dark:text-gray-200">
                      <strong>{f.name}</strong> -{' '}
                      {new Date(f.uploaded_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No files found.
                </p>
              )}
            </div>

            {/* Recent Conversations */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Conversations
              </h2>
              {recentConversations.length > 0 ? (
                <ul className="space-y-2">
                  {recentConversations.map((c) => (
                    <li key={c.id} className="text-sm text-gray-700 dark:text-gray-200">
                      <strong>
                        {c.conversation_name || 'Untitled Conversation'}
                      </strong>{' '}
                      - {new Date(c.created_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations found.
                </p>
              )}
            </div>

            {/* Top Keywords */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Top 5 Keywords (User Messages)
              </h2>
              {topKeywords.length > 0 ? (
                <ul className="space-y-2">
                  {topKeywords.map(([word, count]) => (
                    <li key={word} className="text-sm text-gray-700 dark:text-gray-200">
                      {word} <span className="text-xs text-gray-500">({count})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No keywords found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAnalyticsDashboard;
