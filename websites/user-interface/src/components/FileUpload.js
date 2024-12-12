import React, { useState } from 'react';
import { CloudUploadIcon, DocumentTextIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const [fileType, setFileType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const fileExtension = file.type.split('/')[1];
      setFileType(fileExtension);

      // Text Preview
      if (file.type.startsWith('text')) {
        const reader = new FileReader();
        reader.onload = (event) => setFilePreview(event.target.result.slice(0, 500)); // Limit preview
        reader.readAsText(file);
      }
      // Image Preview
      else if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (event) => setFilePreview(event.target.result); // Image data URL
        reader.readAsDataURL(file);
      }
      // PDF Preview
      else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (event) => setFilePreview(event.target.result); // PDF data URL
        reader.readAsDataURL(file);
      } else {
        setFilePreview('unsupported');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadMessage(data.message);
        setSelectedFile(null);
        setFilePreview('');

        if (onFileUpload) {
          onFileUpload(); // Refresh file list
        }
      } else {
        setUploadMessage(`Error: ${data.error}`);
      }
    } catch (error) {
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
          className="block w-full text-gray-700 dark:text-gray-200 p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* File Preview */}
      {filePreview && filePreview !== 'unsupported' && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-gray-800 dark:text-white text-lg font-semibold mb-2 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
            File Preview
          </h3>

          {/* Text Preview */}
          {fileType.startsWith('text') && (
            <pre className="text-sm text-gray-600 dark:text-gray-300 max-h-40 overflow-auto">
              {filePreview}
            </pre>
          )}

          {/* Image Preview */}
          {fileType.startsWith('image') && (
            <a
              href={filePreview}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={filePreview}
                alt="Uploaded Preview"
                className="max-h-40 w-full object-cover rounded-md"
              />
            </a>
          )}

          {/* PDF Preview */}
          {fileType === 'pdf' && (
            <div className="pdf-preview h-40 overflow-auto">
              <Worker>
                <Viewer fileUrl={filePreview} />
              </Worker>
            </div>
          )}
        </div>
      )}

      {/* Unsupported File Type */}
      {filePreview === 'unsupported' && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-600 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-white">
            Preview is not available for this file type. You can still upload it.
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
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
