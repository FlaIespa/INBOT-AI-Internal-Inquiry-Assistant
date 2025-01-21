import React from 'react';
import { DocumentTextIcon, TrashIcon, DocumentDownloadIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Import Supabase client

function UploadedFiles({ files, onFileDelete }) {
  const handleDelete = async (filename) => {
    try {
      // Step 1: Remove the file from Supabase storage bucket
      const { error: storageError } = await supabase.storage
        .from('files') // Ensure 'files' is your actual bucket name
        .remove([filename]); // Remove file using the filename
  
      if (storageError) {
        console.error('Error deleting file from storage:', storageError.message);
        return;
      }
  
      console.log(`File "${filename}" successfully deleted from storage.`);
  
      // Step 2: Remove the file metadata from the database
      const { error: dbError } = await supabase
        .from('files') // Ensure this matches your table name
        .delete()
        .eq('name', filename);
  
      if (dbError) {
        console.error('Error deleting file metadata from database:', dbError.message);
        return;
      }
  
      console.log(`File "${filename}" successfully deleted from database.`);
  
      // Notify parent component to refresh the files list
      if (onFileDelete) {
        onFileDelete();
      }
    } catch (error) {
      console.error('Unexpected error during file deletion:', error.message);
    }
  };
  
  const handleDownload = async (filename) => {
    try {
      // Generate a signed URL for the file
      const { data, error } = await supabase.storage
        .from('files') // Replace 'files' with your bucket name
        .createSignedUrl(filename, 60 * 10); // URL valid for 10 minutes

      if (error) {
        console.error('Error generating signed URL:', error.message);
        return;
      }

      if (data?.signedUrl) {
        // Trigger the download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filename; // Use the filename for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM
      } else {
        console.error('No signed URL generated.');
      }
    } catch (error) {
      console.error('Error during file download:', error.message);
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
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Uploaded Files
        </h2>
      </div>

      {/* File List or Empty State */}
      {files.length === 0 ? (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-100 dark:bg-gray-700
          hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          <DocumentTextIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No files uploaded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.name}
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
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
                    onClick={() => handleDownload(file.name)}
                    title="Download"
                  >
                    <DocumentDownloadIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:opacity-90"
                    onClick={() => handleDelete(file.name)}
                    title="Delete"
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
