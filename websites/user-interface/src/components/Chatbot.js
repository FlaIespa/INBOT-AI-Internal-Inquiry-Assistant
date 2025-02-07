import React, { useState, useEffect, useCallback } from 'react';
import { PaperAirplaneIcon, ChatAlt2Icon, DocumentTextIcon } from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';

// --- Helper: Extract text from a PDF using pdfjs-dist ---
async function extractTextFromPDFFromURL(url) {
  try {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
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

// --- Helper: Fetch document content from URL ---
async function fetchDocumentContent(fileRecord) {
  const { url, name } = fileRecord;
  if (name.toLowerCase().endsWith('.pdf')) {
    return await extractTextFromPDFFromURL(url);
  } else if (name.toLowerCase().endsWith('.txt')) {
    const res = await fetch(url);
    return await res.text();
  } else {
    throw new Error("Unsupported file type for content extraction.");
  }
}

// --- Helper: Aggregate content from all files ---
async function aggregateAllFilesContent(files) {
  let aggregated = "";
  for (const file of files) {
    try {
      const content = await fetchDocumentContent(file);
      aggregated += content + "\n";
    } catch (error) {
      console.error("Error fetching content for", file.name, error);
    }
  }
  return aggregated;
}

// --- Helper: Ask OpenAI with a prompt including the document content ---
async function askQuestion(documentContent, question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "system", content: `Document Content: ${documentContent}` },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || response.statusText);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error from OpenAI:", error);
    throw error;
  }
}

function Chatbot() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // On mount: Check session and fetch user files.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        fetchUserFiles(session.user.id);
      } else {
        console.error("No active session found");
      }
    }).catch(error => console.error("Session check failed:", error.message));
  }, []);

  const fetchUserFiles = (currentUserId) => {
    if (!currentUserId) return;
    supabase
      .from("files")
      .select("*")
      .eq("user_id", currentUserId)
      .order("uploaded_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching files:", error.message);
          return;
        }
        setFiles(data || []);
      })
      .catch(error => {
        console.error("Unexpected error:", error.message);
        setFiles([]);
      });
  };

  // When a file is selected, load its content.
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setMessages([]);
    setInput("");
    setIsLoading(true);
    try {
      const content = await fetchDocumentContent(file);
      setDocumentContent(content);
      setMessages([{ type: "bot", text: "Document loaded successfully. You can now ask questions about it." }]);
    } catch (error) {
      console.error("Error loading document:", error.message);
      setMessages([{ type: "bot", text: "Error loading the selected document. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Option to aggregate all files
  const handleAskAllFiles = async () => {
    setSelectedFile(null);
    setMessages([]);
    setInput("");
    setIsLoading(true);
    try {
      const aggregatedContent = await aggregateAllFilesContent(files);
      setDocumentContent(aggregatedContent);
      setMessages([{ type: "bot", text: "All documents loaded. You can now ask questions about them." }]);
    } catch (error) {
      console.error("Error loading documents:", error.message);
      setMessages([{ type: "bot", text: "Error loading documents. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !documentContent) return;
    const userQuestion = input.trim();
    setMessages(prev => [...prev, { type: "user", text: userQuestion }]);
    setInput("");
    setIsLoading(true);
    try {
      const answer = await askQuestion(documentContent, userQuestion);
      setMessages(prev => [...prev, { type: "bot", text: answer }]);
    } catch (error) {
      console.error("Error getting answer:", error.message);
      setMessages(prev => [...prev, { type: "bot", text: "Error getting answer. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[800px] bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl m-6">
      {/* Header */}
      <header className="flex items-center justify-center py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl">
        <ChatAlt2Icon className="h-6 w-6" />
        <h1 className="text-lg font-bold ml-2">INBOT Chatbot</h1>
      </header>

      {/* File Selection / All Files Option */}
      {!documentContent && (
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Select a document or choose "All Files" to ask questions about all uploads:
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => handleFileSelect(file)}
                disabled={isLoading}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 dark:text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={handleAskAllFiles}
              disabled={isLoading || files.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Ask about All Files
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {documentContent && (
        <>
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${msg.type === 'bot' ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100' : 'bg-blue-500 dark:bg-blue-600 text-white'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-md">
                  <p className="text-sm">Processing...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 resize-none h-24"
                placeholder="Ask a question about the document..."
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbot;