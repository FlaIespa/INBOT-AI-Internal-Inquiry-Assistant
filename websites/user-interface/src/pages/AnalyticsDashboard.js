import React, { useState, useEffect, useRef } from 'react';
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
import { jsPDF } from 'jspdf';

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
  // ------------------ State ------------------
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    totalConversations: 0,
    totalMessages: 0,
    averageConversationLength: 0,
    totalUserWordCount: 0,
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

  // Chart Refs
  const docChartRef = useRef(null);
  const convChartRef = useRef(null);
  const msgChartRef = useRef(null);
  const roleDistChartRef = useRef(null);
  const fileTypeDistChartRef = useRef(null);

  // ------------------ Fetch Data ------------------
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Check user session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');
      const userId = user.id;

      // 2) Fetch FILES
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('id, name, size, file_type, uploaded_at')
        .eq('user_id', userId);
      if (filesError) throw filesError;

      const totalDocuments = filesData.length;

      // Largest 5
      const sortedBySize = [...filesData].sort((a, b) => (b.size || 0) - (a.size || 0));
      const top5Largest = sortedBySize.slice(0, 5);

      // Recent 5
      const sortedByDate = [...filesData].sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );
      const top5Recent = sortedByDate.slice(0, 5);

      // File type distribution
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
            backgroundColor: ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'],
          },
        ],
      };

      // Documents over time
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
            backgroundColor: 'rgba(59,130,246,0.5)',
            borderColor: 'rgba(59,130,246,1)',
          },
        ],
      };

      // 3) Fetch CONVERSATIONS
      const { count: conversationCount, error: convCountError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (convCountError) throw convCountError;

      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, created_at, conversation_name')
        .eq('user_id', userId);
      if (convError) throw convError;

      const sortedConvsByDate = [...convData].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const top5Conversations = sortedConvsByDate.slice(0, 5);

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
            backgroundColor: 'rgba(16,185,129,0.5)',
            borderColor: 'rgba(16,185,129,1)',
          },
        ],
      };

      // 4) Fetch MESSAGES
      const userConversationIds = convData.map((c) => c.id);
      let totalMessages = 0;
      let msgChartDataObj = null;
      let avgConversationLength = 0;
      let userCount = 0;
      let botCount = 0;
      let totalUserWords = 0;
      const conversationMessageCount = {};
      const wordFreq = {};

      if (userConversationIds.length > 0) {
        const { data: messagesData, error: messagesError } = await supabase
          .from('conversation_messages')
          .select('id, created_at, conversation_id, role, message')
          .in('conversation_id', userConversationIds);
        if (messagesError) throw messagesError;

        totalMessages = messagesData.length;

        const msgCounts = {};
        messagesData.forEach((msg) => {
          conversationMessageCount[msg.conversation_id] =
            (conversationMessageCount[msg.conversation_id] || 0) + 1;

          if (msg.role === 'user') userCount++;
          if (msg.role === 'bot') botCount++;

          if (msg.role === 'user' && msg.message) {
            const rawWords = msg.message.trim().split(/\s+/);
            totalUserWords += rawWords.length;
            rawWords.forEach((w) => {
              const clean = w.toLowerCase().replace(/[^\w]/g, '');
              if (clean.length < 3) return;
              wordFreq[clean] = (wordFreq[clean] || 0) + 1;
            });
          }

          const day = new Date(msg.created_at).toLocaleDateString();
          msgCounts[day] = (msgCounts[day] || 0) + 1;
        });

        // Messages Over Time
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
              backgroundColor: 'rgba(255,165,0,0.5)',
              borderColor: 'rgba(255,165,0,1)',
            },
          ],
        };

        // Average Conversation Length
        const sumMessageCounts = Object.values(conversationMessageCount).reduce(
          (acc, c) => acc + c,
          0
        );
        avgConversationLength =
          conversationCount > 0 ? sumMessageCounts / conversationCount : 0;

        // Role Distribution
        const roleDistData = {
          labels: ['User Messages', 'Bot Messages'],
          datasets: [
            {
              data: [userCount, botCount],
              backgroundColor: ['#3B82F6', '#F59E0B'],
            },
          ],
        };
        setRoleDistChartData(roleDistData);
      }

      const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
      const top5Words = sortedWords.slice(0, 5);

      // 5) Update State
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

  // ------------------ Lifecycle ------------------
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ------------------ Helper Functions for PDF ------------------
  /**
   * Adds text to the PDF, creating a new page if needed.
   * @param {jsPDF} doc The jsPDF instance
   * @param {string} text The text to add
   * @param {number} x The X coordinate
   * @param {number} y The current Y coordinate
   * @param {number} lineHeight Vertical spacing after text
   * @returns {number} The updated Y position
   */
  const addTextWithPageCheck = (doc, text, x, y, lineHeight = 10) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    // If we're too close to the bottom, add a new page
    if (y + lineHeight > pageHeight - 10) {
      doc.addPage();
      y = 20; // reset top margin
    }
    doc.text(text, x, y);
    return y + lineHeight;
  };

  /**
   * Adds a chart image to the PDF, creating a new page if needed.
   * @param {jsPDF} doc The jsPDF instance
   * @param {object} chartRef The ref for the chart
   * @param {number} x The X coordinate
   * @param {number} y The current Y coordinate
   * @param {number} width Desired image width
   * @param {number} height Desired image height
   * @returns {number} The updated Y position
   */
  const addChartImageToPDF = (doc, chartRef, x, y, width, height) => {
    if (!chartRef.current) return y; // no chart
    const pageHeight = doc.internal.pageSize.getHeight();

    // If the chart won't fit on the current page, add a new page
    if (y + height + 20 > pageHeight) {
      doc.addPage();
      y = 20;
    }

    const base64Image = chartRef.current.toBase64Image();
    if (base64Image) {
      doc.addImage(base64Image, 'PNG', x, y, width, height);
      y += height + 10; // add spacing
    }
    return y;
  };

  // ------------------ Download PDF Handler ------------------
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);

    // Title
    let yPos = 20;
    doc.text('Personal Data Report', 10, yPos);

    doc.setFontSize(12);
    yPos += 10;
    yPos = addTextWithPageCheck(doc, `Total Documents: ${metrics.totalDocuments}`, 10, yPos);
    yPos = addTextWithPageCheck(doc, `Total Conversations: ${metrics.totalConversations}`, 10, yPos);
    yPos = addTextWithPageCheck(doc, `Total Messages: ${metrics.totalMessages}`, 10, yPos);
    yPos = addTextWithPageCheck(doc, `Avg Conv Length: ${metrics.averageConversationLength}`, 10, yPos);
    yPos = addTextWithPageCheck(doc, `Total User Word Count: ${metrics.totalUserWordCount}`, 10, yPos);

    // Insert Documents Over Time Chart
    doc.setFontSize(14);
    yPos += 5;
    yPos = addTextWithPageCheck(doc, 'Documents Uploaded Over Time:', 10, yPos);
    doc.setFontSize(12);
    yPos = addChartImageToPDF(doc, docChartRef, 10, yPos, 180, 80);

    // Insert Conversations Chart
    doc.setFontSize(14);
    yPos = addTextWithPageCheck(doc, 'Conversations Started Over Time:', 10, yPos);
    doc.setFontSize(12);
    yPos = addChartImageToPDF(doc, convChartRef, 10, yPos, 180, 80);

    // Insert Messages Chart
    if (msgChartData) {
      doc.setFontSize(14);
      yPos = addTextWithPageCheck(doc, 'Messages Over Time:', 10, yPos);
      doc.setFontSize(12);
      yPos = addChartImageToPDF(doc, msgChartRef, 10, yPos, 180, 80);
    }

    // Insert Role Distribution
    if (roleDistChartData) {
      doc.setFontSize(14);
      yPos = addTextWithPageCheck(doc, 'Role Distribution:', 10, yPos);
      doc.setFontSize(12);
      yPos = addChartImageToPDF(doc, roleDistChartRef, 10, yPos, 120, 80);
    }

    // Insert File Type Distribution
    if (fileTypeDistChartData) {
      doc.setFontSize(14);
      yPos = addTextWithPageCheck(doc, 'File Type Distribution:', 10, yPos);
      doc.setFontSize(12);
      yPos = addChartImageToPDF(doc, fileTypeDistChartRef, 10, yPos, 120, 80);
    }

    // Insert Top Keywords
    if (topKeywords.length > 0) {
      doc.setFontSize(14);
      yPos += 5;
      yPos = addTextWithPageCheck(doc, 'Top 5 Keywords:', 10, yPos);
      doc.setFontSize(12);
      topKeywords.forEach(([word, count]) => {
        yPos = addTextWithPageCheck(doc, `- ${word} (${count})`, 12, yPos, 8);
      });
    }

    // Save the PDF
    doc.save('personal_data_report.pdf');
  };

  // ------------------ Render ------------------
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

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              <RefreshIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-md focus:outline-none"
            >
              Download Personal Data Report (PDF)
            </button>
          </div>
        </div>

        {/* Error */}
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

        {/* Metric Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Total Messages</h3>
              <p className="text-xl font-bold">{metrics.totalMessages}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">Avg Conv Length</h3>
              <p className="text-xl font-bold">{metrics.averageConversationLength}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-600 to-red-600 text-white shadow-md">
              <ChatIcon className="h-6 w-6 mb-2" />
              <h3 className="text-sm font-medium opacity-80">User Word Count</h3>
              <p className="text-xl font-bold">{metrics.totalUserWordCount}</p>
            </div>
          </div>
        )}

        {/* Charts: Documents & Conversations */}
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
                    ref={docChartRef}
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
                    ref={convChartRef}
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

        {/* Messages Over Time & Role Distribution */}
        {!loading && msgChartData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Messages Over Time
              </h2>
              <div className="h-64">
                <Line
                  ref={msgChartRef}
                  data={msgChartData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>

            {roleDistChartData && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Role Distribution
                </h2>
                <div className="h-64 flex items-center justify-center">
                  <Pie
                    ref={roleDistChartRef}
                    data={roleDistChartData}
                    options={{ maintainAspectRatio: false, responsive: true }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Type Distribution */}
        {!loading && fileTypeDistChartData && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              File Type Distribution
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Pie
                ref={fileTypeDistChartRef}
                data={fileTypeDistChartData}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            </div>
          </div>
        )}

        {/* 4) 2×2 Grid for Largest/Recent Files & Recent Convos/Top Keywords */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Top 5 Recent Files
              </h2>
              {recentFiles.length > 0 ? (
                <ul className="space-y-2">
                  {recentFiles.map((f) => (
                    <li key={f.id} className="text-sm text-gray-700 dark:text-gray-200">
                      <strong>{f.name}</strong> - {new Date(f.uploaded_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No files found.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Conversations
              </h2>
              {recentConversations.length > 0 ? (
                <ul className="space-y-2">
                  {recentConversations.map((c) => (
                    <li key={c.id} className="text-sm text-gray-700 dark:text-gray-200">
                      <strong>{c.conversation_name || 'Untitled Conversation'}</strong>{' '}
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
