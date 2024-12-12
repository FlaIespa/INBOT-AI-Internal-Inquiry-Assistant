import React, { useState, useEffect } from 'react';
import { SearchIcon, DocumentIcon, DownloadIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

function DocumentSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  // Fetch documents from backend
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/files');
      const data = await response.json();
      if (response.ok) {
        const formattedDocuments = data.files.map((file, index) => ({
          id: index + 1,
          name: file.name,
          type: file.name.split('.').pop().toUpperCase(),
          uploaded: new Date().toISOString().split('T')[0],
        }));
        setDocuments(formattedDocuments);
      } else {
        console.error('Error fetching documents:', data.error);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    console.log(`Attempting to delete file: ${filename}`); // Debug log
    const confirmed = window.confirm(`Are you sure you want to delete "${filename}"?`);
    if (!confirmed) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/files/${filename}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log(`File '${filename}' deleted successfully.`);
        fetchDocuments(); // Refresh list
      } else {
        console.error('Error deleting document:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Document Search</h1>

        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Search for documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-300" />
          </div>
        </div>

        {/* Document Results */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading documents...</p>
          ) : filteredDocuments.length > 0 ? (
            <AnimatePresence>
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <DocumentIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-200 font-semibold">{doc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded on: {doc.uploaded} | Type: {doc.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => setPreviewFile(`http://127.0.0.1:5000/uploads/${doc.name}`)}
                    >
                      <EyeIcon className="h-6 w-6" />
                    </button>
                    <a
                      href={`http://127.0.0.1:5000/uploads/${doc.name}`}
                      download={doc.name}
                      className="text-green-500 hover:text-green-700"
                    >
                      <DownloadIcon className="h-6 w-6" />
                    </a>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(doc.name)}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No documents found.</p>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setPreviewFile(null)}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
            <button
              className="text-red-500 float-right"
              onClick={() => setPreviewFile(null)}
            >
              Close
            </button>
            <iframe
              src={previewFile}
              title="File Preview"
              className="w-full h-96 border rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentSearchPage;
