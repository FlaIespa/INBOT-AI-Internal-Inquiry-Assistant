import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaperAirplaneIcon, ChatAlt2Icon } from '@heroicons/react/solid';
import { supabase } from '../supabaseClient';

// Helper: Load conversation record (to get conversation name and document content)
async function loadConversationRecord(convId) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', convId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error loading conversation record:", error.message);
    return null;
  }
}

// Helper: Load conversation messages
async function loadConversationMessages(convId) {
  try {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading conversation messages:", error.message);
    return [];
  }
}

// Helper: Ask OpenAI with a prompt including the document content
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

// Helper: Save a message to the conversation_messages table
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

function ConversationDetail() {
  const { conversationId } = useParams();
  const [conversationRecord, setConversationRecord] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load the conversation record and messages on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const convRecord = await loadConversationRecord(conversationId);
      if (convRecord) {
        setConversationRecord(convRecord);
        // Assume the conversation record stores document context in "document_content"
        setDocumentContent(convRecord.document_content || "");
      }
      const msgs = await loadConversationMessages(conversationId);
      setMessages(msgs);
      setIsLoading(false);
    }
    loadData();
  }, [conversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userQuestion = input.trim();
    // Append the user message locally and save it to the database
    setMessages(prev => [...prev, { role: "user", message: userQuestion }]);
    await saveMessage(conversationId, "user", userQuestion);
    setInput("");
    setIsLoading(true);
    try {
      const answer = await askQuestion(documentContent, userQuestion);
      setMessages(prev => [...prev, { role: "bot", message: answer }]);
      await saveMessage(conversationId, "bot", answer);
    } catch (error) {
      console.error("Error getting answer:", error.message);
      const errMsg = "Error getting answer. Please try again.";
      setMessages(prev => [...prev, { role: "bot", message: errMsg }]);
      await saveMessage(conversationId, "bot", errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Updated container: Same as the original Chatbot component
    <div className="flex flex-col h-[800px] bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl m-6">
      {/* Header */}
      <header className="flex items-center justify-center py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <ChatAlt2Icon className="h-6 w-6" />
        <h1 className="text-lg font-bold ml-2">
          {conversationRecord ? conversationRecord.conversation_name : "Conversation Detail"}
        </h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-700 p-6">
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

      {/* Input */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            rows={4}
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            placeholder="Ask a question about this conversation..."
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
    </div>
  );
}

export default ConversationDetail;
