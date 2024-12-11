import React, { useState, useEffect } from 'react';
import { ChatAlt2Icon, TrashIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

function UploadedFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/files');
        const data = await response.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="uploaded-files-container bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-8"
    >
      <header className="flex items-center justify-center mb-4">
        <ChatAlt2Icon className="h-10 w-10 text-gray-600 dark:text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 ml-2">
          Uploaded Files
        </h2>
      </header>

      <ul>
        {files.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <li key={file.name} className="flex justify-between items-center mb-3">
              <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
              <button
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600"
                onClick={() => console.log('Delete not implemented yet!')}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
}

export default UploadedFiles;
