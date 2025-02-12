// src/components/UploadedFiles.js
import React, { useState } from 'react';
import {
  DocumentTextIcon,
  TrashIcon,
  DocumentDownloadIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
} from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

function UploadedFiles({ files, onFileDelete, onFileRename, onFolderChange, folders, onDownload, onDelete }) {
  // Helper function to format file sizes into human-friendly units.
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --- File name editing state and functions ---
  const [editingFileId, setEditingFileId] = useState(null);
  const [editedName, setEditedName] = useState('');

  const startEditing = (file) => {
    setEditingFileId(file.id);
    setEditedName(file.name);
  };

  const cancelEditing = () => {
    setEditingFileId(null);
    setEditedName('');
  };

  const handleRename = async (fileId) => {
    if (!editedName.trim()) {
      cancelEditing();
      return;
    }
    try {
      const { error } = await supabase
        .from('files')
        .update({ name: editedName.trim() })
        .eq('id', fileId);
      if (error) {
        console.error('Error updating file name:', error.message);
        return;
      }
      if (onFileRename) {
        onFileRename(fileId, editedName.trim());
      }
      setEditingFileId(null);
      setEditedName('');
    } catch (error) {
      console.error('Error updating file name:', error.message);
    }
  };

  // --- File deletion and download functions (unchanged) ---
  const handleDelete = async (fileId, filename) => {
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
        .eq('id', fileId);
      if (dbError) {
        console.error('Error deleting file metadata:', dbError.message);
        return;
      }
      if (onFileDelete) onFileDelete(fileId);
    } catch (error) {
      console.error('Unexpected error during file deletion:', error.message);
    }
  };

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

  // --- Folder (i.e. label) editing state and functions ---
  const [editingFolderFileId, setEditingFolderFileId] = useState(null);
  const [editedFolder, setEditedFolder] = useState('');

  const startEditingFolder = (file) => {
    setEditingFolderFileId(file.id);
    // When no folder is set, we show "Uncategorized"
    setEditedFolder(file.label || 'Uncategorized');
  };

  const cancelEditingFolder = () => {
    setEditingFolderFileId(null);
    setEditedFolder('');
  };

  const handleFolderChange = async (fileId) => {
    try {
      // If "Uncategorized" is selected, save as null in the database.
      const newFolderValue = editedFolder === 'Uncategorized' ? null : editedFolder;
      const { error } = await supabase
        .from('files')
        .update({ label: newFolderValue })
        .eq('id', fileId);
      if (error) {
        console.error('Error updating folder:', error.message);
        return;
      }
      if (onFolderChange) {
        // Pass the value as shown in the UI ("Uncategorized" if null)
        onFolderChange(fileId, editedFolder);
      }
      setEditingFolderFileId(null);
      setEditedFolder('');
    } catch (error) {
      console.error('Error updating folder:', error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Uploaded Files</h2>
      </div>

      {files.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
          <DocumentTextIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-300">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {/* File Details */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    {/* File Name (with inline edit) */}
                    {editingFileId === file.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(file.id);
                          }
                        }}
                        onBlur={() => handleRename(file.id)}
                        className="text-sm font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 focus:outline-none"
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </h3>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                    {/* Folder (or label) display and inline edit */}
                    {editingFolderFileId === file.id ? (
                      <select
                        value={editedFolder}
                        onChange={(e) => setEditedFolder(e.target.value)}
                        onBlur={() => handleFolderChange(file.id)}
                        className="text-xs font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 focus:outline-none"
                      >
                        <option value="Uncategorized">Uncategorized</option>
                        {folders.map((folderName) => (
                          <option key={folderName} value={folderName}>
                            {folderName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        Folder: {file.label || 'Uncategorized'}
                        <button
                          onClick={() => startEditingFolder(file)}
                          title="Change Folder"
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {editingFileId === file.id ? (
                    <>
                      <button
                        onClick={() => handleRename(file.id)}
                        title="Save"
                        className="p-2 rounded-full bg-green-500 text-white shadow-md hover:opacity-90"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        title="Cancel"
                        className="p-2 rounded-full bg-red-500 text-white shadow-md hover:opacity-90"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(file)}
                      title="Edit Name"
                      className="p-2 rounded-full bg-yellow-500 text-white shadow-md hover:opacity-90"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(file.name)}
                    title="Download"
                    className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
                  >
                    <DocumentDownloadIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id, file.name)}
                    title="Delete"
                    className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:opacity-90"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default UploadedFiles;
