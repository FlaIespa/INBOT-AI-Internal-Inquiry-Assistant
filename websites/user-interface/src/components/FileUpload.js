import React from 'react';
import { CloudUploadIcon } from '@heroicons/react/solid';

function FileUpload() {
  return (
    <div className="file-upload-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <header className="flex items-center justify-center mb-4">
        <CloudUploadIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-100 ml-2">
          Upload a Document
        </h2>
      </header>

      <div className="mb-4">
        <label className="block mb-2 text-gray-600 dark:text-gray-300">Choose File</label>
        <input
          type="file"
          className="block w-full text-gray-700 dark:text-gray-200 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <button className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800">
        Upload File
      </button>
    </div>
  );
}

export default FileUpload;
