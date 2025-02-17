import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, ChatAlt2Icon, DocumentTextIcon } from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

// Helper: Parse URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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
  const { url, name, file_type } = fileRecord;
  // Determine the extension using file_type if available, or fallback to the file name.
  let extension = file_type ? file_type.toLowerCase() : name.split('.').pop().toLowerCase();

  if (extension === 'pdf') {
    return await extractTextFromPDFFromURL(url);
  } else if (extension === 'txt') {
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

// --- Helper: Ask OpenAI with a prompt including document content ---
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

// --- Helper: Start a new conversation with a name ---
async function startNewConversation(userId, conversationName) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, conversation_name: conversationName })
      .select();
    if (error) throw error;
    if (data && data.length > 0) return data[0].id;
    throw new Error("Failed to create a new conversation.");
  } catch (error) {
    console.error("Error starting new conversation:", error.message);
    throw error;
  }
}

// --- Helper: Load conversation messages ---
async function loadConversation(convId) {
  try {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading conversation:", error.message);
    return [];
  }
}

// --- Helper: Save a message to the conversation_messages table ---
async function saveMessage(conversationId, role, message) {
  try {
    const { error } = await supabase
      .from('conversation_messages')
      .insert({ conversation_id: conversationId, role, message });
    if (error) {
      console.error("Error saving message:", error.message);
    }
  } catch (error) {
    console.error("Error saving message:", error.message);
  }
}

// --- Helper: Update conversation name ---
async function updateConversationName(conversationId, newName) {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ conversation_name: newName })
      .eq('id', conversationId);
    if (error) {
      console.error("Error updating conversation name:", error.message);
    }
  } catch (error) {
    console.error("Error updating conversation name:", error.message);
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
  const [conversationId, setConversationId] = useState(null);
  const [conversationNameInput, setConversationNameInput] = useState("INBOT Chatbot");

  const query = useQuery();

  // On mount: Check session, fetch files, and load conversation if provided.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        fetchUserFiles(session.user.id);
        const convId = query.get("conversationId");
        if (convId) {
          setConversationId(convId);
          loadConversation(convId).then((msgs) => setMessages(msgs));
        }
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

  // When a file is selected, load its content and start a new conversation if needed.
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setMessages([]);
    setInput("");
    setIsLoading(true);
    try {
      const content = await fetchDocumentContent(file);
      setDocumentContent(content);
      // If no conversation is active, start one using the conversation name input.
      let convIdToUse = conversationId;
      if (!convIdToUse) {
        const convName = conversationNameInput.trim() || `Conversation on ${new Date().toLocaleString()}`;
        convIdToUse = await startNewConversation(userId, convName);
        setConversationId(convIdToUse);
      }
      const botMsg = "Document loaded successfully. You can now ask questions about it.";
      setMessages([{ role: "bot", message: botMsg }]);
      await saveMessage(convIdToUse, "bot", botMsg);
    } catch (error) {
      console.error("Error loading document:", error.message);
      const errMsg = "Error loading the selected document. Please try again.";
      setMessages([{ role: "bot", message: errMsg }]);
      if (conversationId) {
        await saveMessage(conversationId, "bot", errMsg);
      }
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
      let convIdToUse = conversationId;
      if (!convIdToUse) {
        const convName = conversationNameInput.trim() || `Conversation on ${new Date().toLocaleString()}`;
        convIdToUse = await startNewConversation(userId, convName);
        setConversationId(convIdToUse);
      }
      const botMsg = "All documents loaded. You can now ask questions about them.";
      setMessages([{ role: "bot", message: botMsg }]);
      await saveMessage(convIdToUse, "bot", botMsg);
    } catch (error) {
      console.error("Error loading documents:", error.message);
      const errMsg = "Error loading documents. Please try again.";
      setMessages([{ role: "bot", message: errMsg }]);
      if (conversationId) {
        await saveMessage(conversationId, "bot", errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !documentContent) return;
    const userQuestion = input.trim();
    // Append the user message and save it.
    setMessages(prev => [...prev, { role: "user", message: userQuestion }]);
    if (conversationId) {
      await saveMessage(conversationId, "user", userQuestion);
    }
    setInput("");
    setIsLoading(true);
    try {
      const answer = await askQuestion(documentContent, userQuestion);
      setMessages(prev => [...prev, { role: "bot", message: answer }]);
      if (conversationId) {
        await saveMessage(conversationId, "bot", answer);
      }
    } catch (error) {
      console.error("Error getting answer:", error.message);
      const errMsg = "Error getting answer. Please try again.";
      setMessages(prev => [...prev, { role: "bot", message: errMsg }]);
      if (conversationId) {
        await saveMessage(conversationId, "bot", errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to update conversation name on blur
  const handleConversationNameBlur = async () => {
    if (conversationId && conversationNameInput.trim()) {
      await updateConversationName(conversationId, conversationNameInput.trim());
    }
  };

  // Handler for manually starting the chatbot tour (only in conversation state)
  const startChatbotTour = () => {
    introJs()
      .setOptions({
        steps: [
          {
            element: '.chatbot-header',
            intro: 'This is the conversation header where you can view or edit the conversation title.',
          },
          {
            element: '.chatbot-messages',
            intro: 'This area shows the conversation history between you and INBOT.',
          },
          {
            element: '.chatbot-input',
            intro: 'Type your question here. Press Enter or click the send button to submit.',
          },
          {
            element: '.chatbot-send-btn',
            intro: 'Click this button to send your question.',
          },
        ],
        showProgress: true,
        exitOnOverlayClick: false,
      })
      .start();
  };

  return (
    <div className="flex flex-col h-[800px] bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl m-6">
      {/* Header with editable conversation name and tour button */}
      <header className="flex flex-col items-center justify-center py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl chatbot-header">
        <div className="flex items-center space-x-4">
          <ChatAlt2Icon className="h-6 w-6" />
          <input
            type="text"
            value={conversationNameInput}
            onChange={(e) => setConversationNameInput(e.target.value)}
            onBlur={handleConversationNameBlur}
            className="text-lg font-bold text-center bg-transparent border-b border-white focus:outline-none"
            placeholder="Name your conversation"
          />
          {/* Show Chatbot Tour if a document is loaded, otherwise show File Selection Tour */}
          {documentContent ? (
            <button 
              onClick={startChatbotTour}
              className="px-4 py-2 bg-white text-indigo-600 rounded-full shadow hover:bg-gray-100 transition"
            >
              Chatbot Tour
            </button>
          ) : (
            <button 
              onClick={() => {
                introJs()
                  .setOptions({
                    steps: [
                      {
                        element: '.file-selection-container',
                        intro: 'This is where you can select a document to load. Click on a document to get started.',
                      },
                      {
                        intro: 'After selecting a document, the conversation area will appear below.',
                      }
                    ],
                    showProgress: true,
                    exitOnOverlayClick: true,
                  })
                  .start();
              }}
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-lg transition-all hover:bg-gray-100"
            >
              Take File Selection Tour
            </button>
          )}
        </div>
      </header>

      {/* File Selection / All Files Option */}
      {!documentContent && (
        <div className="flex-1 overflow-y-auto p-6 file-selection-container">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Select a document or choose "All Files" to ask questions about all uploads:
          </h2>
          <div className="grid gap-4 grid-cols-1">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => handleFileSelect(file)}
                disabled={isLoading}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Circle with gradient background */}
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0 ml-3">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Ask about All Files
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {documentContent && (
        <>
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-6 chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${msg.role === 'bot' ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100' : 'bg-blue-500 dark:bg-blue-600 text-white'}`}>
                  <p className="text-sm">{msg.message}</p>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading}
                rows={4}
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 chatbot-input"
                placeholder="Ask a question about the document..."
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed self-end chatbot-send-btn"
              >
                <PaperAirplaneIcon className="h-5 w-5 transform rotate-45 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbot;
