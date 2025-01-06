import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Token state

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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Protected Layout for Pages with Sidebar and Header
  const ProtectedLayout = ({ children }) => (
    <div className={`flex ${darkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="flex-grow bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
        <Route path="/signup" element={<SignupPage setAuthToken={setAuthToken} />} />
        <Route path="/" element={<WelcomePage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ChatbotPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/file-management"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <FileManagementPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <FAQPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <UserProfilePage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <NotificationsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ActivityLogsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/document-search"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <DocumentSearchPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
