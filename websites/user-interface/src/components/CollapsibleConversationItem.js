import React, { useState } from 'react';

const CollapsibleConversationItem = ({ conversation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Show only a snippet (first 100 characters) if not open
  const snippet =
    conversation.message.length > 100
      ? conversation.message.substring(0, 100) + '...'
      : conversation.message;

  return (
    <div 
      onClick={toggleOpen} 
      className="cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {new Date(conversation.created_at).toLocaleString()}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
          {conversation.role}
        </p>
      </div>
      <div className="mt-2 text-gray-800 dark:text-gray-200 text-sm">
        {isOpen ? conversation.message : snippet}
      </div>
    </div>
  );
};

export default CollapsibleConversationItem;
