import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Snackbar Component
function Snackbar({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white font-bold hover:underline"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

function LoginPage({ setAuthToken }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [snackbar, setSnackbar] = useState({ message: '', type: '', open: false });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ ...snackbar, open: false }); // Close previous Snackbar

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.token; // Extract the token from response
        localStorage.setItem('authToken', token); // Save token in localStorage
        setAuthToken(token); // Update global authToken state

        setSnackbar({
          message: '🎉 Login successful! Redirecting...',
          type: 'success',
          open: true,
        });

        setTimeout(() => navigate('/home'), 1500); // Redirect to /home after a delay
      } else {
        setSnackbar({
          message: `❌ Error: ${data.error}`,
          type: 'error',
          open: true,
        });
      }
    } catch (error) {
      setSnackbar({
        message: '❌ Network error. Please try again.',
        type: 'error',
        open: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full shadow-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              Login
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 dark:text-gray-300 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 dark:text-blue-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      )}
    </motion.div>
  );
}

export default LoginPage;
