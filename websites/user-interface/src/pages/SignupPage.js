import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import robotAnimation from '../assets/robot_animation.json';
import WelcomeHeader from '../components/WelcomeHeader'; // Import the header component


function SignupPage({ setAuthToken }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [snackbar, setSnackbar] = useState({
    message: '',
    visible: false,
    type: 'success', // 'success' or 'error'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token; // Get token from backend
        localStorage.setItem('authToken', token); // Save token to localStorage
        setAuthToken(token); // Update authToken state

        // Redirect to home page
        showSnackbar('🎉 Signup successful! Redirecting to home...', 'success');
        setTimeout(() => navigate('/home'), 2000); // Redirect with slight delay
      } else {
        showSnackbar(`❌ Error: ${data.error}`, 'error'); // Handle errors
      }
    } catch (error) {
      showSnackbar('❌ Network error. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, type) => {
    setSnackbar({ message, visible: true, type });
    setTimeout(() => setSnackbar({ message: '', visible: false, type: 'success' }), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <WelcomeHeader />

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
            <Lottie animationData={robotAnimation} loop className="w-56 h-56 mb-6" />
            <h1
              className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              Welcome
            </h1>
            <p className="text-lg mt-4 text-gray-700">
              Join us today and start simplifying your workflows with AI.
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
                  Sign Up
                </h2>
                <p className="text-sm text-gray-600">
                  Create your account below to get started.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
                >
                  Sign Up
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-blue-500 hover:text-blue-600"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Snackbar */}
      {snackbar.visible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

export default SignupPage;
