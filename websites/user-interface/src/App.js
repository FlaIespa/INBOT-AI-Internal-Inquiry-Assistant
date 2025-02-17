// src/App.js
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SidebarTour from './components/SidebarTour';
import ChatbotTour from './components/ChatbotTour';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import FileManagementPage from './pages/FileManagementPage';
import FAQPage from './pages/FAQPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AnalyticsDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/WelcomePage';
import HistoryPage from './pages/HistoryPage';
import ConversationDetail from './pages/ConversationDetailPage';
import { DarkModeProvider, DarkModeContext } from './contexts/DarkModeContext';

function AppContent() {
  const authToken = localStorage.getItem('authToken');
  const { darkMode } = useContext(DarkModeContext);

  // Apply dark mode class to <html> to persist dark mode across reloads
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Protected Layout with dark mode support
  const ProtectedLayout = ({ children }) => (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );

  // Public Layout with dark mode support
  const PublicLayout = ({ children }) => (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicLayout><LoginPage setAuthToken={() => {}} /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><SignupPage setAuthToken={() => {}} /></PublicLayout>} />
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><ProtectedLayout><HomePage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ProtectedLayout><ChatbotPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/chatbot-tour" element={<ProtectedRoute><ProtectedLayout><ChatbotTour /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/file-management" element={<ProtectedRoute><ProtectedLayout><FileManagementPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><ProtectedLayout><FAQPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ProtectedLayout><SettingsPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><ProtectedLayout><UserProfilePage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><ProtectedLayout><NotificationsPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><ProtectedLayout><AdminDashboard /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ProtectedLayout><HistoryPage /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/conversation/:conversationId" element={<ProtectedRoute><ProtectedLayout><ConversationDetail /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/tour" element={<ProtectedRoute><ProtectedLayout><SidebarTour /></ProtectedLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
