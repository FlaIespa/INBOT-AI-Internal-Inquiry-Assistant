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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);

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
    return [...new Set(files.map(file => file.name.split('.').pop()))];
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-56 flex-1 min-h-screen bg-gray-100 dark:bg-gray-900 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          File Management
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Files</h3>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{files.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Size</h3>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{getTotalSize(files)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Types</h3>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {getUniqueFileTypes(files).length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="space-y-4">
          <FileUpload onFileUpload={handleFileUploadSuccess} />
          <UploadedFiles files={filteredFiles} onFileDelete={handleFileDeleteSuccess} />
        </div>
      </div>

      {snackbar.visible && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
          snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

export default FileManagementPage;