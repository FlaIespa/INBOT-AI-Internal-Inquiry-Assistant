import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUploadIcon, DocumentAddIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setSelectedFile(acceptedFiles[0]);
      setUploadMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
  });

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

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage('File uploaded successfully!');
        setSelectedFile(null);
        if (onFileUpload) {
          onFileUpload();
        }
      } else {
        setUploadMessage(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadMessage('Failed to upload the file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2 mb-4">
        <CloudUploadIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Upload a Document
        </h2>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-100/50 dark:bg-blue-900/30'
            : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <DocumentAddIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-sm text-blue-500 dark:text-blue-400">Drop the file here...</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Supported formats: PDF, TXT, JPG, PNG
            </p>
          </>
        )}
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`w-full mt-5 py-2 rounded-md text-sm font-medium transition-all ${
          isUploading || !selectedFile
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-800'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </motion.button>

      {uploadMessage && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-3 text-sm text-center ${
            uploadMessage.includes('Error')
              ? 'text-red-500 dark:text-red-400'
              : 'text-green-500 dark:text-green-400'
          }`}
        >
          {uploadMessage}
        </motion.p>
      )}
    </motion.div>
  );
}

export default FileUpload;
