// src/pages/TranslationPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import TranslatedDocumentsList from '../components/TranslatedDocumentsList';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Example list of target languages
const LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Portuguese',
  'Arabic',
  'Russian',
];

// Register a custom font (Roboto)
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2',
});

// Define PDF styles for react-pdf
const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontSize: 12,
    fontFamily: 'Roboto',
    lineHeight: 1.15,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
});

// TranslationPDF component for generating the PDF document
const TranslationPDF = ({ translation }) => (
  <Document>
    <Page style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header} fixed>
        <Text style={pdfStyles.title}>Translated Document</Text>
      </View>
      {/* Content */}
      <View style={pdfStyles.content}>
        {translation.split('\n\n').map((para, index) => (
          <Text key={index} style={pdfStyles.paragraph}>
            {para}
          </Text>
        ))}
      </View>
      {/* Footer with page number */}
      <View style={pdfStyles.footer} fixed>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </View>
    </Page>
  </Document>
);

// Helper to fetch text from a PDF or TXT file in Supabase
async function fetchDocumentContent(fileRecord) {
  const { url, file_type } = fileRecord;
  if (file_type === 'pdf') {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist/build/pdf');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n';
    }
    return text;
  } else if (file_type === 'txt') {
    const res = await fetch(url);
    return await res.text();
  } else {
    throw new Error('Unsupported file type for translation.');
  }
}

// Helper to call OpenAI and translate text for one chunk
async function translateText(text, targetLanguage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a translation assistant. Translate the following text into ${targetLanguage}.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || response.statusText);
    }
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error.message);
    throw error;
  }
}

// Helper to translate the whole document by chunking if needed
async function translateWholeText(text, targetLanguage) {
  const maxChunkLength = 3000;
  let translatedResult = "";
  for (let i = 0; i < text.length; i += maxChunkLength) {
    const chunk = text.substring(i, i + maxChunkLength);
    const translatedChunk = await translateText(chunk, targetLanguage);
    translatedResult += translatedChunk + "\n\n";
  }
  return translatedResult;
}

function TranslationPage() {
  const [files, setFiles] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translation, setTranslation] = useState('');
  const [editedTranslation, setEditedTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [translationMessage, setTranslationMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Refresh the list of uploaded files for the user
  const refreshFiles = async (uid) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', uid)
      .order('uploaded_at', { ascending: false });
    if (error) {
      console.error('Error fetching files:', error.message);
    } else {
      setFiles(data || []);
    }
  };

  // Refresh the translations list (joined with file info)
  const refreshTranslations = async (uid) => {
    const { data, error } = await supabase
      .from('file_translations')
      .select(`
         *,
         file:files ( name, size, user_id )
      `)
      .eq('file.user_id', uid)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching translations:', error.message);
    } else {
      setTranslations(data || []);
    }
  };

  // Fetch user files and translations on mount
  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);
      await refreshFiles(session.user.id);
      await refreshTranslations(session.user.id);
    }
    fetchData();
  }, []);

  // Snackbar logic
  const showSnackbar = (message, type) => {
    setTranslationMessage(`${type.toUpperCase()}: ${message}`);
    setTimeout(() => setTranslationMessage(''), 3000);
  };

  // Handle translation: Calculate full translation but do NOT save it yet
  const handleTranslate = async () => {
    if (!selectedFile || !targetLanguage) {
      showSnackbar('Please select a file and a target language.', 'error');
      return;
    }
    setIsTranslating(true);
    setTranslation('');
    setEditedTranslation('');
    setIsEditing(false);
    try {
      const content = await fetchDocumentContent(selectedFile);
      const translatedText = await translateWholeText(content, targetLanguage);
      setTranslation(translatedText);
      setEditedTranslation(translatedText);
      showSnackbar('Translation completed! Click "Save Translation" to store it.', 'success');
    } catch (error) {
      console.error('Error during translation:', error.message);
      showSnackbar('Error translating the document.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  // Save (or update) the translation in the file_translations table
  const handleSaveTranslation = async () => {
    if (!selectedFile || !targetLanguage || !translation) {
      showSnackbar('No translation to save.', 'error');
      return;
    }
    try {
      const { error } = await supabase
        .from('file_translations')
        .upsert(
          {
            file_id: selectedFile.id,
            translation: editedTranslation,
            translated_language: targetLanguage,
          },
          { onConflict: ['file_id', 'translated_language'] }
        );
      if (error) throw error;
      showSnackbar('Translation saved successfully!', 'success');
      setTranslation(editedTranslation);
      setIsEditing(false);
      await refreshTranslations(userId);
    } catch (error) {
      console.error('Error saving translation:', error.message);
      showSnackbar('Error saving the translation.', 'error');
    }
  };

  // Delete a translation from the file_translations table
  const handleDeleteTranslation = async (translationId) => {
    try {
      const { error } = await supabase
        .from('file_translations')
        .delete()
        .eq('id', translationId);
      if (error) throw error;
      showSnackbar('Translation deleted successfully!', 'success');
      await refreshTranslations(userId);
    } catch (error) {
      console.error('Error deleting translation:', error.message);
      showSnackbar('Error deleting translation.', 'error');
    }
  };

  // When a translated file is selected from the list, load its data for viewing/editing.
  const handleSelectTranslatedFile = (translationRow) => {
    setSelectedFile({ id: translationRow.file_id });
    setTranslation(translationRow.translation || '');
    setEditedTranslation(translationRow.translation || '');
    setTargetLanguage(translationRow.translated_language || '');
    setIsEditing(false);
  };

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Translation <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Page</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Translate your documents into another language, then click "Save Translation" to store and view them.
          </p>
        </div>

        {/* File and Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select a File */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select a File:</label>
            <select
              value={selectedFile ? selectedFile.id : ''}
              onChange={(e) => {
                const fileId = e.target.value;
                const file = files.find((f) => f.id.toString() === fileId);
                setSelectedFile(file || null);
                setTranslation('');
                setEditedTranslation('');
                setIsEditing(false);
              }}
              className="block w-full p-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- Select a File --</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>{file.name}</option>
              ))}
            </select>
          </div>

          {/* Select a Language */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Language:</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="block w-full p-2 rounded-md border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- Select a Language --</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={!selectedFile || !targetLanguage || isTranslating}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium shadow transition-all duration-200 ${
            isTranslating || !selectedFile || !targetLanguage
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isTranslating ? 'Translating...' : 'Translate Document'}
        </button>

        {/* Display the Translated Text */}
        {translation && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow mt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Translated Document:</h3>
            {isEditing ? (
              <textarea
                value={editedTranslation}
                onChange={(e) => setEditedTranslation(e.target.value)}
                rows={6}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <pre className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white whitespace-pre-wrap max-h-64 overflow-auto">
                {translation}
              </pre>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveTranslation}
                    className="py-2 px-4 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                  >
                    Save Translation
                  </button>
                  <button
                    onClick={() => {
                      setEditedTranslation(translation);
                      setIsEditing(false);
                    }}
                    className="py-2 px-4 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="py-2 px-4 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Edit Translation
                  </button>
                  <button
                    onClick={handleSaveTranslation}
                    className="py-2 px-4 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                  >
                    Save Translation
                  </button>
                  <PDFDownloadLink
                    document={<TranslationPDF translation={translation} />}
                    fileName={`translated_${selectedFile?.name || 'document'}.pdf`}
                    className="py-2 px-4 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {({ loading }) =>
                      loading ? 'Preparing document...' : 'Download PDF'
                    }
                  </PDFDownloadLink>
                </>
              )}
            </div>
          </div>
        )}

        {/* Translated Documents List (Cards) */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Documents Already Translated</h2>
          <TranslatedDocumentsList
            translations={translations}
            onSelect={handleSelectTranslatedFile}
            onDelete={handleDeleteTranslation}
          />
        </div>
      </motion.div>

      {/* Snackbar-like notification */}
      <AnimatePresence>
        {translationMessage && (
          <motion.div
            key="snackbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-4 right-4 px-3 py-2 rounded-md shadow-md text-white z-50 ${
              translationMessage.includes('ERROR') ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {translationMessage.replace(/^ERROR: |^SUCCESS: /, '')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TranslationPage;
