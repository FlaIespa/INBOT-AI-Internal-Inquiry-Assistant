import React from 'react';
import { ChatAlt2Icon, TrashIcon } from '@heroicons/react/solid'; // Importing icons

function UploadedFiles() {
  const files = [
    { name: 'Company_Policies.pdf', id: 1 },
    { name: 'Employee_Handbook.docx', id: 2 },
  ];

  return (
    <div className="uploaded-files-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <header className="flex items-center justify-center mb-4">
        <ChatAlt2Icon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-100 ml-2">Uploaded Files</h2>
      </header>

      <ul>
        {files.map((file) => (
          <li key={file.id} className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
            <div className="flex space-x-2">
              <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-600">
                <ChatAlt2Icon className="h-5 w-5" />
              </button>
              <button className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadedFiles;
