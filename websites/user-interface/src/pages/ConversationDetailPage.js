import React from 'react';
import ConversationDetail from '../components/ConversationDetail';
import { motion } from 'framer-motion';

function ConversationDetailPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-56 flex items-start justify-center"
      >
        {/* ConversationDetail Container */}
        <div className="w-full max-w-6xl">
          <ConversationDetail />
        </div>
      </motion.div>
    </div>
  );
}

export default ConversationDetailPage;
