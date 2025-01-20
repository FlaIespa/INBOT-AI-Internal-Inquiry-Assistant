import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 dark:text-gray-300 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 dark:text-blue-400 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>

      {snackbar.visible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </motion.div>
  );
}

export default SignupPage;
