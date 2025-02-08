import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const HistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch conversation history for the current user
  const fetchConversations = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      // Query the conversations table
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Navigate to the ConversationDetail route with the selected conversation ID
  const handleConversationClick = (convId) => {
    navigate(`/conversation/${convId}`);
  };

  // Optional: Clear conversation history for the user
  const clearHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      setConversations([]);
    } catch (error) {
      console.error("Error clearing history:", error.message);
    }
  };

  return (
    <div className="ml-56 min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Chatbot <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Click on a conversation to view the full conversation.
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400 text-center">Loading history...</p>
          ) : conversations.length > 0 ? (
            <ul className="space-y-4">
              {conversations.map((conv) => (
                <li
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {conv.conversation_name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(conv.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No conversation history found.
            </p>
          )}
        </div>

        {/* Clear History Button */}
        {conversations.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Clear History
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage;
