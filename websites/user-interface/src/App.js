import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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

// Create dark mode context
export const DarkModeContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('dark-mode', !darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  // Protected Layout with dark mode support
  const ProtectedLayout = ({ children }) => (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-grow transition-colors duration-200
        bg-gray-50 dark:bg-gray-900 
        text-gray-900 dark:text-gray-100">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );

  // Public Layout with dark mode support
  const PublicLayout = ({ children }) => (
    <div className="min-h-screen transition-colors duration-200
      bg-gray-50 dark:bg-gray-900 
      text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className={darkMode ? 'dark' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <LoginPage setAuthToken={setAuthToken} />
                </PublicLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicLayout>
                  <SignupPage setAuthToken={setAuthToken} />
                </PublicLayout>
              }
            />
            <Route
              path="/"
              element={
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              }
            />

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
        </div>
      </Router>
    </DarkModeContext.Provider>
  );
}

export default App;