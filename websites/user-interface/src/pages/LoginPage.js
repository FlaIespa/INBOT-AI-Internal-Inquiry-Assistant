import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import robotAnimation from '../assets/robot_animation.json'; // Import the robot animation
import { Lock, Mail, Loader2 } from 'lucide-react';
import WelcomeHeader from '../components/WelcomeHeader'; // Import the header component

// Snackbar Component
function Snackbar({ message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white ${
        type === 'success'
          ? 'bg-gradient-to-r from-green-500 to-green-600'
          : 'bg-gradient-to-r from-red-500 to-red-600'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{message}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✖
        </motion.button>
      </div>
    </motion.div>
  );
}

function LoginPage({ setAuthToken }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ message: '', type: '', open: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSnackbar({ ...snackbar, open: false });

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token);
        setSnackbar({
          message: '✨ Welcome back! Redirecting to your dashboard...',
          type: 'success',
          open: true,
        });
        setTimeout(() => navigate('/home'), 1500);
      } else {
        setSnackbar({
          message: `${data.error}`,
          type: 'error',
          open: true,
        });
      }
    } catch (error) {
      setSnackbar({
        message: '❌ Connection error. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    {/* Header */}
    <WelcomeHeader />

    {/* Main Content */}
    {/* Add the rest of the content here */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto space-y-10 md:space-y-0 md:space-x-12 px-4">
        {/* Left Column - Animation */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 flex justify-center items-center"
        >
          <div className="flex flex-col items-center text-center max-w-md">
            <Lottie animationData={robotAnimation} loop className="w-56 h-56 mb-8" />
            <h1
              className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              Welcome Back
            </h1>
            <p className="text-lg mt-4 text-gray-700">
              Rediscover the power of AI to enhance your productivity and simplify your workflows.
            </p>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 flex justify-center items-center"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 border"
              style={{
                borderWidth: '3px',
                borderRadius: '24px',
                borderImage: 'linear-gradient(to right, #36c3ff, #9155fd) 1',
              }}
            >
              <motion.div className="text-center mb-6">
                <h2
                  className="text-4xl font-extrabold mb-2"
                  style={{
                    background: 'linear-gradient(to right, #36c3ff, #9155fd)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Login
                </h2>
                <p className="text-sm text-gray-600">
                  Securely access your account below.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-500 hover:text-blue-600"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      )}
    </div>
  );
}

export default LoginPage;
