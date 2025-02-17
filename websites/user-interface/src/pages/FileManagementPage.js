// src/pages/FileManagementPage.js
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import UploadedFiles from '../components/UploadedFiles';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
  DocumentTextIcon,
  DocumentDownloadIcon,
  TrashIcon,
} from '@heroicons/react/solid';

function FileManagementPage() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('uploaded_at_desc');
  const [snackbar, setSnackbar] = useState({
    message: '',
    visible: false,
    type: 'success',
  });

  // Folder management state
  const [folders, setFolders] = useState([]); // e.g. ["Documents", "Images"]
  const [newFolder, setNewFolder] = useState('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('All');

  // Show a temporary snackbar message
  const showSnackbar = (message, type) => {
    setSnackbar({ message, visible: true, type });
    setTimeout(() => setSnackbar({ message: '', visible: false, type: 'success' }), 3000);
  };

  // Fetch files for the logged-in user from Supabase
  const fetchFiles = async () => {
    try {
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
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching files:', error.message);
        return;
      }
      setFiles(data || []);
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

  // Callback for renaming a file—updates the local state immediately
  const handleFileRename = (fileId, newName) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, name: newName } : file
      )
    );
  };

  // Sorting function: returns a sorted copy of files based on the chosen option.
  const sortFiles = (files, option) => {
    const sorted = [...files];
    switch (option) {
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'uploaded_at_asc':
        sorted.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
        break;
      case 'uploaded_at_desc':
      default:
        sorted.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
        break;
    }
    return sorted;
  };

  const sortedFiles = sortFiles(files, sortOption);

  // Filter files based on search term and folder filter.
  const filteredFiles = sortedFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Use "Uncategorized" when no folder is assigned
    const fileFolder = file.label || 'Uncategorized';
    const matchesFolder =
      selectedFolderFilter === 'All' ||
      fileFolder.toLowerCase() === selectedFolderFilter.toLowerCase();
    return matchesSearch && matchesFolder;
  });

  // Utility: Format file size in human-friendly units
  const getTotalSize = (files) => {
    const totalBytes = files.reduce((acc, file) => acc + (file.size || 0), 0);
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Updated: Get unique file types from the stored file_type column
  const getUniqueFileTypes = (files) => {
    const fileTypes = [...new Set(files.map((file) => file.file_type).filter(Boolean))];
    return {
      count: fileTypes.length,
      types: fileTypes,
    };
  };

  const fileTypesInfo = getUniqueFileTypes(files);

  // Define handleDownload function (same as before)
  const handleDownload = async (filename) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(filename, 60 * 10);
      if (error) {
        console.error('Error generating signed URL:', error.message);
        return;
      }
      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('No signed URL generated.');
      }
    } catch (error) {
      console.error('Error during file download:', error.message);
    }
  };

  // Define handleDelete function (same as before)
  const handleDelete = async (filename) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([filename]);
      if (storageError) {
        console.error('Error deleting file from storage:', storageError.message);
        return;
      }
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('name', filename);
      if (dbError) {
        console.error('Error deleting file metadata from database:', dbError.message);
        return;
      }
      showSnackbar('File deleted successfully!', 'success');
      fetchFiles();
    } catch (error) {
      console.error('Unexpected error during file deletion:', error.message);
    }
  };

  // --- Folder Management Functions ---
  const handleAddFolder = () => {
    const folderName = newFolder.trim();
    if (folderName && !folders.includes(folderName)) {
      setFolders([...folders, folderName]);
      setNewFolder('');
    }
  };

  // Compute the complete list of folders from user-created ones plus those already assigned
  const computedFolders = Array.from(
    new Set([
      ...folders,
      ...files.map((file) => file.label).filter((label) => label)
    ])
  );

  // Callback for when a file’s folder is changed via the UploadedFiles component.
  const handleFolderChange = (fileId, newFolderValue) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId
          ? { ...file, label: newFolderValue === 'Uncategorized' ? null : newFolderValue }
          : file
      )
    );
  };

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-6"
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

        {/* Sort and Search Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600 dark:text-gray-300">Sort By:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="uploaded_at_desc">Newest First</option>
              <option value="uploaded_at_asc">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border rounded-full text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Folder Filter and Creation Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Folders</h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={() => setSelectedFolderFilter('All')}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ease-in-out ${
                selectedFolderFilter === 'All'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              All
            </button>
            {computedFolders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolderFilter(folder)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ease-in-out ${
                  selectedFolderFilter === folder
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="New folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="flex-1 p-3 border rounded-md text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddFolder}
              className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium shadow-lg transition-all duration-200 hover:opacity-90"
            >
              Add Folder
            </button>
          </div>
        </div>

        {/* File Statistics */}
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

        {/* File Upload and List */}
        <div className="space-y-4">
          <FileUpload onFileUpload={handleFileUploadSuccess} />
          <UploadedFiles
            files={filteredFiles}
            onFileDelete={handleFileDeleteSuccess}
            onFileRename={handleFileRename}
            onFolderChange={handleFolderChange}
            folders={computedFolders}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
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
