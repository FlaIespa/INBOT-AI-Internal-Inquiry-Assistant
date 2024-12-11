import React, { useState, useEffect } from 'react';
import { ChatAlt2Icon, TrashIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

function UploadedFiles({ files, onFileDelete }) {
  const [highlightedFile, setHighlightedFile] = useState(null);

  // Highlight the newly added file whenever the list updates
  useEffect(() => {
    if (files.length > 0) {
      const latestFile = files[files.length - 1];
      setHighlightedFile(latestFile.name);

      // Clear the highlight after a short delay
      const timer = setTimeout(() => {
        setHighlightedFile(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [files]);

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/files/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Trigger parent function to refresh the file list
        if (onFileDelete) {
          onFileDelete();
        }
      } else {
        console.error('Failed to delete file:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while deleting the file:', error);
    }
  };

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
          <AnimatePresence>
            {files.map((file) => (
              <motion.li
                key={file.name}
                initial={highlightedFile === file.name ? { scale: 1.1, opacity: 0.8 } : { opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center mb-3"
              >
                <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                <button
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600"
                  onClick={() => handleDelete(file.name)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        )}
      </ul>
    </motion.div>
  );
}

export default UploadedFiles;
