import React, { useState } from 'react';
import { CloudUploadIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUploadMessage('Error: Authentication token is missing. Please log in.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile); // Ensure this key matches the backend
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log('Server Response:', response, data);
  
      if (response.ok) {
        setUploadMessage(data.message || 'File uploaded successfully!');
        setSelectedFile(null);
        if (onFileUpload) {
          onFileUpload(); // Refresh file list
        }
      } else {
        setUploadMessage(`Error (${response.status}): ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadMessage('Failed to upload the file. Please try again.');
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="file-upload-container bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <header className="flex items-center justify-center mb-4">
        <CloudUploadIcon className="h-10 w-10 text-gray-600 dark:text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 ml-2">
          Upload a Document
        </h2>
      </header>

      <div className="mb-4">
        <label className="block mb-2 text-gray-600 dark:text-gray-300">Choose File</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.pdf,.jpg,.jpeg,.png"
          aria-label="Choose a file to upload"
          className="block w-full text-gray-700 dark:text-gray-200 p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <button
        onClick={handleUpload}
        aria-label="Upload the selected file"
        className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800"
      >
        Upload File
      </button>

      {uploadMessage && (
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{uploadMessage}</p>
      )}
    </motion.div>
  );
}

export default FileUpload;
