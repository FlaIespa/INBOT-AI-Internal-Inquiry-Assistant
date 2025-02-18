// src/components/TranslatedDocumentsList.js
import React from 'react';
import { PencilIcon, TrashIcon, DocumentDownloadIcon, DocumentTextIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

// Define PDF styles for react-pdf
const pdfStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: 'Roboto',
    lineHeight: 1.15,
  },
  text: {
    whiteSpace: 'pre-wrap',
  },
});

// TranslationPDF component for each translation card
const TranslationPDF = ({ translation }) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={pdfStyles.text}>{translation}</Text>
    </Page>
  </Document>
);

// Optional helper to format file size
function formatFileSize(size) {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function TranslatedDocumentsList({ translations, onSelect, onDelete }) {
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
        const { id, translation, translated_language, file } = translationRow;
        return (
          <div
            key={id}
            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {/* Left side: File info */}
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
              <PDFDownloadLink
                document={<TranslationPDF translation={translation} />}
                fileName={`translated_${file?.name || 'document'}.pdf`}
                className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
              >
                {({ loading }) => (loading ? '...' : <DocumentDownloadIcon className="h-5 w-5" />)}
              </PDFDownloadLink>
              <button
                onClick={() => onDelete(id)}
                title="Delete Translation"
                className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:opacity-90"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default TranslatedDocumentsList;
