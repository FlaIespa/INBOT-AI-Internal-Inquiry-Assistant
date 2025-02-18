// src/components/TranslatedDocumentsList.js
import React from 'react';
import {
  PencilIcon,
  DocumentDownloadIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid';
import { motion } from 'framer-motion';

// Optional helper to format file size
function formatFileSize(size) {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function TranslatedDocumentsList({
  translations,       // Array of translation rows from file_translations
  onSelect,           // Called when user clicks the Edit button
  onDownloadPDF,      // Called when user clicks the Download button
  onDelete,           // Optional: Called when user clicks the Delete button
}) {
  if (!translations || translations.length === 0) {
    return <p className="text-center text-sm text-gray-500 dark:text-gray-400">No translations found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {translations.map((translationRow) => {
        // Assume our translation row includes an embedded "file" object from a join.
        const { id, translation, translated_language, created_at, file } = translationRow;
        return (
          <div
            key={id}
            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {/* Left side: Icon and file info */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file?.name || 'Unknown File'}
                </h3>
                {file?.size && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Translated to: <strong>{translated_language || 'N/A'}</strong>
                </div>
              </div>
            </div>
            {/* Right side: Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSelect(translationRow)}
                title="View / Edit Translation"
                className="p-2 rounded-full bg-yellow-500 text-white shadow-md hover:opacity-90"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDownloadPDF(translation, file?.name)}
                title="Download PDF"
                className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
              >
                <DocumentDownloadIcon className="h-5 w-5" />
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  title="Delete Translation"
                  className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:opacity-90"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default TranslatedDocumentsList;
