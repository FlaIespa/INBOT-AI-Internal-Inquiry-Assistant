import React from 'react';
import { DocumentTextIcon, TrashIcon, DocumentDownloadIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

function UploadedFiles({ files, onFileDelete }) {
  const handleDelete = async (filename) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/files/${filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok && onFileDelete) {
        onFileDelete();
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Uploaded Files
        </h2>
      </div>

      {/* File List or Empty State */}
      {files.length === 0 ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-700
          hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          <DocumentTextIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No files uploaded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {/* File Details */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
                    onClick={() => window.open(`http://127.0.0.1:5000/api/files/${file.name}`, '_blank')}
                    title="Download"
                  >
                    <DocumentDownloadIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:opacity-90"
                    onClick={() => handleDelete(file.name)}
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default UploadedFiles;
