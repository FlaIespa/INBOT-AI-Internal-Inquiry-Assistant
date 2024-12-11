import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Inner Container with INBOT Branding */}
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center">
            Login
          </h1>
          <form>
            <div className="mb-6">
              <label className="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-600 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-full shadow-md text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800"
            >
              Login
            </button>
          </form>
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
