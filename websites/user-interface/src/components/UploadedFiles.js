import React, { useState, useEffect } from 'react';
import { 
  DocumentIcon, TrashIcon, 
  PhotographIcon, DocumentTextIcon, 
  DocumentDownloadIcon, ExternalLinkIcon
} from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

function UploadedFiles({ files, onFileDelete }) {
  const [highlightedFile, setHighlightedFile] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const latestFile = files[files.length - 1];
      setHighlightedFile(latestFile.name);

      const timer = setTimeout(() => {
        setHighlightedFile(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [files]);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <PhotographIcon className="h-4 w-4 text-blue-500" />;
      case 'pdf':
        return <DocumentTextIcon className="h-4 w-4 text-red-500" />;
      case 'txt':
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <DocumentIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (filename) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/files/${filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Uploaded Files
          </h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </header>

      <div className="divide-y dark:divide-gray-700">
        {files.length === 0 ? (
          <div className="py-8 text-center">
            <DocumentIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No files uploaded yet.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={highlightedFile === file.name ? { scale: 1.02, opacity: 0.8 } : { opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md -mx-2 px-2"
              >
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0">
                    {getFileIcon(file.name)}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {formatDate(file.uploaded_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-blue-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(`http://127.0.0.1:5000/api/files/${file.name}`, '_blank')}
                      title="Download file"
                    >
                      <DocumentDownloadIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(file.name)}
                      title="Delete file"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

export default UploadedFiles;