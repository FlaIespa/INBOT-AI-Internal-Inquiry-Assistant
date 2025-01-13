import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUploadIcon, DocumentAddIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
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
      'image/*': ['.jpg', '.jpeg', '.png']
    }
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CloudUploadIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
          Upload Document
        </h2>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
          }`}
      >
        <input {...getInputProps()} />
        <DocumentAddIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        {isDragActive ? (
          <p className="text-sm text-blue-500 dark:text-blue-400">Drop the file here ...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Supported files: PDF, TXT, JPG, PNG
            </p>
          </div>
        )}
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`w-full mt-4 py-2 px-4 rounded-md text-sm font-medium transition-colors
          ${isUploading || !selectedFile
            ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-700'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
          }`}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </motion.button>

      {uploadMessage && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-sm text-center ${
            uploadMessage.includes('Error')
              ? 'text-red-500 dark:text-red-400'
              : 'text-green-500 dark:text-green-400'
          }`}
        >
          {uploadMessage}
        </motion.p>
      )}
    </div>
  );
}

export default FileUpload;