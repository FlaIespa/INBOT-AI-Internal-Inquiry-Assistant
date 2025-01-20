import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';
import { motion } from 'framer-motion';
import { SearchIcon } from '@heroicons/react/solid';

function FileManagementPage() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    message: '',
    visible: false,
    type: 'success',
  });

  const showSnackbar = (message, type) => {
    setSnackbar({ message, visible: true, type });
    setTimeout(() => setSnackbar({ message: '', visible: false, type: 'success' }), 3000);
  };

  const fetchFiles = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/files', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setFiles(data.files || []);
      } else {
        showSnackbar(`Error: ${data.error || 'Failed to fetch files'}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      showSnackbar('Error fetching files. Please try again.', 'error');
    }
  };

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

  const getTotalSize = (files) => {
    const totalBytes = files.reduce((acc, file) => acc + (file.size || 0), 0);
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getUniqueFileTypes = (files) => {
    return [...new Set(files.map((file) => file.name.split('.').pop()))];
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-4"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            File <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Organize and manage your files effortlessly.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">Total Files</h3>
            <p className="text-xl font-bold">{files.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">Total Size</h3>
            <p className="text-xl font-bold">{getTotalSize(files)}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">File Types</h3>
            <p className="text-xl font-bold">{getUniqueFileTypes(files).length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* File Upload and List */}
        <div className="space-y-4">
          <FileUpload onFileUpload={handleFileUploadSuccess} />
          <UploadedFiles files={filteredFiles} onFileDelete={handleFileDeleteSuccess} />
        </div>
      </motion.div>

      {/* Snackbar */}
      {snackbar.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 px-3 py-2 rounded-md shadow-md text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </motion.div>
      )}
    </div>
  );
}

export default FileManagementPage;
