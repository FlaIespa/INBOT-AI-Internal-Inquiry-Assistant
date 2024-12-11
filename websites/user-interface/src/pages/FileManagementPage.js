import React from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';

function FileManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div>
        <FileUpload />
      </div>
      <div>
        <UploadedFiles />
      </div>
    </div>
  );
}

export default FileManagementPage;
