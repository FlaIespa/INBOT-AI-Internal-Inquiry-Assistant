import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import FileManagementPage from './pages/FileManagementPage';
import FAQPage from './pages/FAQPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import DocumentSearchPage from './pages/DocumentSearchPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // State to track dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load dark mode preference from localStorage (if available)
  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={`flex ${darkMode ? 'dark' : ''}`}>
        <Sidebar />
        <div className="flex-grow bg-gray-100 dark:bg-gray-900 min-h-screen">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/file-management" element={<FileManagementPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
              <Route path="/document-search" element={<DocumentSearchPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
