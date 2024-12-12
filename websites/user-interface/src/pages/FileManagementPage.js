import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';
import { motion } from 'framer-motion';

function FileManagementPage() {
  const [files, setFiles] = useState([]); // State to hold the list of files
  const [snackbar, setSnackbar] = useState({
    message: '',
    visible: false,
    type: 'success', // 'success' or 'error'
  });

  // Snackbar handler
  const showSnackbar = (message, type) => {
    setSnackbar({ message, visible: true, type });
    setTimeout(() => setSnackbar({ message: '', visible: false, type: 'success' }), 3000);
  };

  // Fetch the list of files from the backend
  const fetchFiles = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    console.log('Token:', token); // Log the token to check if it's retrieved correctly
  
    if (!token) {
      console.error('Authentication token is missing.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/files', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      // Log the response status and data for debugging
      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);
  
      if (response.ok) {
        setFiles(data.files || []); // Set files if the response is successful
      } else {
        showSnackbar(`❌ Error: ${data.error || 'Failed to fetch files'}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      showSnackbar('❌ Error fetching files. Please try again.', 'error');
    }
  };
  

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUploadSuccess = () => {
    showSnackbar('🎉 File uploaded successfully!', 'success');
    fetchFiles();
  };

  const handleFileDeleteSuccess = () => {
    showSnackbar('🗑️ File deleted successfully!', 'success');
    fetchFiles();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1 rounded-3xl shadow-2xl max-w-4xl w-full"
      >
        <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6 text-center"
          >
            File Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center"
          >
            Upload, manage, and view your documents with ease.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
            className="space-y-6"
          >
            {/* File Upload Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <FileUpload onFileUpload={handleFileUploadSuccess} />
            </motion.div>

            {/* Uploaded Files Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="p-6 bg-green-50 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <UploadedFiles files={files} onFileDelete={handleFileDeleteSuccess} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Snackbar */}
      {snackbar.visible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </motion.div>
  );
}

export default FileManagementPage;
