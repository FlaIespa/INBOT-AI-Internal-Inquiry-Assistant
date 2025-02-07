import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUploadIcon, DocumentAddIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Your configured Supabase client

// Use the REACT_APP_ variables (make sure they are defined in your .env)
const EMBEDDING_API_URL = process.env.REACT_APP_EMBEDDING_API_URL; // e.g., "https://api.openai.com/v1/embeddings"
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// --- Helper: Extract text from a PDF using pdfjs-dist ---
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF.");
  }
}

// --- Helper: Generate embedding by calling OpenAI's Embedding API ---
async function generateEmbedding(content) {
  try {
    console.log("Embedding API URL:", EMBEDDING_API_URL);
    const response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: content.slice(0, 8192)  // Limit input length for safety
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Full error response:", errorData);
      throw new Error(`OpenAI Embedding API error: ${errorData.error?.message || response.statusText}`);
    }
    const data = await response.json();
    // Expected response: { data: [ { embedding: [...] } ], model: ..., usage: ... }
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding with OpenAI:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Configure react-dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setSelectedFile(acceptedFiles[0]);
      setUploadMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }
    setIsUploading(true);
    const fileName = `${Date.now()}_${selectedFile.name}`;
    const bucketName = 'files';

    try {
      // 1. Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile);
      if (uploadError) throw uploadError;

      // 2. Retrieve the public URL for the file
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      if (publicUrlError) throw publicUrlError;
      if (!publicUrlData?.publicUrl) throw new Error('Unable to generate file URL.');

      // 3. Insert file metadata into the "files" table
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated.");
      const { data: fileData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: userData.user.id,
          name: selectedFile.name,
          size: selectedFile.size,
          url: publicUrlData.publicUrl,
        })
        .select();
      if (dbError) throw dbError;
      if (!fileData || fileData.length === 0) throw new Error('Failed to insert file record.');
      const insertedFileId = fileData[0].id;

      // 4. Extract text from the file
      let content = "";
      if (selectedFile.type === "application/pdf") {
        content = await extractTextFromPDF(selectedFile);
      } else if (selectedFile.type === "text/plain") {
        content = await selectedFile.text();
      } else {
        throw new Error("Unsupported file type for text extraction.");
      }

      // 5. Generate an embedding from the extracted text using OpenAI
      const embedding = await generateEmbedding(content);

      // 6. Update the file record with the generated embedding
      const { error: updateError } = await supabase
        .from('files')
        .update({ embedding })
        .eq('id', insertedFileId);
      if (updateError) throw updateError;

      setUploadMessage('File uploaded and embedding generated successfully!');
      setSelectedFile(null);
      if (onFileUpload) onFileUpload();
    } catch (error) {
      console.error('Upload Error:', error.message);
      setUploadMessage('Failed to upload/process the file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center gap-2 mb-4">
        <CloudUploadIcon className="h-6 w-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Upload a Document
        </h2>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-100/50 dark:bg-blue-900/30'
            : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-blue-500 dark:text-blue-400">Drop the file here...</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Supported formats: PDF, TXT
            </p>
          </>
        )}
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`w-full mt-5 py-2 rounded-md text-sm font-medium transition-all ${
          isUploading || !selectedFile
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-800'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </motion.button>

      {uploadMessage && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-3 text-sm text-center ${
            uploadMessage.includes('Failed') ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
          }`}
        >
          {uploadMessage}
        </motion.p>
      )}
    </motion.div>
  );
}

export default FileUpload;
