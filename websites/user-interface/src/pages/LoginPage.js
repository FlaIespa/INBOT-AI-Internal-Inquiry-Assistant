import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage('🎉 Login successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1500); // Redirect to /home after a delay
      } else {
        setStatusMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatusMessage('❌ Network error. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-600 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-full shadow-md text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              Login
            </button>
          </form>

          {statusMessage && (
            <p className="text-center text-sm mt-4 font-semibold">
              {statusMessage}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 dark:text-blue-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;
