import React, { useState } from 'react';
import { SearchIcon, DocumentIcon, DownloadIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';

function DocumentSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [documents] = useState([
    {
      id: 1,
      name: 'Company_Policies.pdf',
      type: 'PDF',
      tags: ['HR', 'Policies'],
      uploaded: '2024-09-15',
    },
    {
      id: 2,
      name: 'Employee_Handbook.docx',
      type: 'DOCX',
      tags: ['HR', 'Onboarding'],
      uploaded: '2024-08-20',
    },
    {
      id: 3,
      name: 'Annual_Report_2024.pdf',
      type: 'PDF',
      tags: ['Finance', 'Reports'],
      uploaded: '2024-10-01',
    },
  ]);

  // Filter documents by search term and tags
  const filteredDocuments = documents.filter(
    (doc) =>
      (filterTag === 'all' || doc.tags.includes(filterTag)) &&
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

        {/* Filter by Tags */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-4 py-2 rounded-lg ${
              filterTag === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTag('HR')}
            className={`px-4 py-2 rounded-lg ${
              filterTag === 'HR'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            HR
          </button>
          <button
            onClick={() => setFilterTag('Finance')}
            className={`px-4 py-2 rounded-lg ${
              filterTag === 'Finance'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => setFilterTag('Reports')}
            className={`px-4 py-2 rounded-lg ${
              filterTag === 'Reports'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Reports
          </button>
        </div>

        {/* Document Results */}
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  {/* Document Icon */}
                  <DocumentIcon className="h-8 w-8 text-blue-500" />
                  {/* Document Info */}
                  <div>
                    <p className="text-gray-700 dark:text-gray-200 font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded on: {doc.uploaded} | Type: {doc.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tags: {doc.tags.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    <EyeIcon className="h-6 w-6" />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <DownloadIcon className="h-6 w-6" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentSearchPage;
