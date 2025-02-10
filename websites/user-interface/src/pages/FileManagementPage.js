import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Import Supabase client

function FileManagementPage() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    message: '',
    visible: false,
    type: 'success',
  });

  const showSnackbar = (message, type) => {
    setSnackbar({ message, visible: true, type });
    setTimeout(() => setSnackbar({ message: '', visible: false, type: 'success' }), 3000);
  };

  const fetchFiles = async () => {
    try {
      // Get the logged-in user's session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user session:', userError.message);
        return;
      }

      if (!user) {
        console.error('User is not logged in.');
        return;
      }

      // Fetch files associated with the logged-in user
      const { data, error } = await supabase
        .from('files') // Replace 'files' with your table name
        .select('*')
        .eq('user_id', user.id); // Use the user's ID to filter files

      if (error) {
        console.error('Error fetching files:', error.message);
        return;
      }

      setFiles(data || []); // Update the state with fetched files
    } catch (error) {
      console.error('Unexpected error fetching files:', error.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUploadSuccess = () => {
    showSnackbar('🎉 File uploaded successfully!', 'success');
    fetchFiles();
  };

  const handleFileDeleteSuccess = () => {
    showSnackbar('🗑️ File deleted successfully!', 'success');
    fetchFiles();
  };

  const getTotalSize = (files) => {
    const totalBytes = files.reduce((acc, file) => acc + (file.size || 0), 0);
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getUniqueFileTypes = (files) => {
    const fileTypes = [...new Set(files.map((file) => file.name.split('.').pop()))];
    return {
      count: fileTypes.length,
      types: fileTypes,
    };
  };

  // Filter files based on the search term
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file types information
  const fileTypesInfo = getUniqueFileTypes(files);

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-4"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            File <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Organize and manage your files effortlessly.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">Total Files</h3>
            <p className="text-xl font-bold">{files.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">Total Size</h3>
            <p className="text-xl font-bold">{getTotalSize(files)}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
            <h3 className="text-xs font-medium opacity-80">File Types</h3>
            <p className="text-xl font-bold">{fileTypesInfo.count}</p>
            <p className="text-sm opacity-90 mt-1">
              {fileTypesInfo.types.join(', ') || 'No files uploaded'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* File Upload and List */}
        <div className="space-y-4">
          <FileUpload onFileUpload={handleFileUploadSuccess} />
          <UploadedFiles files={filteredFiles} onFileDelete={handleFileDeleteSuccess} />
        </div>
      </motion.div>

      {/* Snackbar */}
      {snackbar.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 px-3 py-2 rounded-md shadow-md text-white ${
            snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbar.message}
        </motion.div>
      )}
    </div>
  );
}

export default FileManagementPage;
