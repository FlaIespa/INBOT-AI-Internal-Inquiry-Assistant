import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';

function FileManagementPage() {
  const [files, setFiles] = useState([]); // State to hold the list of files

  // Fetch the list of files from the backend
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/files');
      const data = await response.json();
      console.log('Fetched files:', data); // Inspect backend response
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };
  
  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div>
        {/* Pass the fetchFiles function to FileUpload to refresh the list after uploading */}
        <FileUpload onFileUpload={fetchFiles} />
      </div>
      <div>
        {/* Pass the files and fetchFiles function to UploadedFiles */}
        <UploadedFiles files={files} onFileDelete={fetchFiles} />
      </div>
    </div>
  );
}

export default FileManagementPage;
