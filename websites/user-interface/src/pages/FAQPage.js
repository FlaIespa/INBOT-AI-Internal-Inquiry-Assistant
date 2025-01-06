import React from 'react';

function FAQPage() {
  const faqs = [
    {
      question: "How do I upload a document?",
      answer: "Navigate to the File Management section and use the Upload Document feature. Select your file, and it will be securely uploaded to the system."
    },
    {
      question: "What file formats are supported?",
      answer: "INBOT currently supports PDF, DOCX, JPG, PNG, and JPEG files. More formats may be added in the future based on user feedback."
    },
    {
      question: "How do I preview an uploaded document?",
      answer: "In the File Management or Document Search section, click on the eye icon next to a file to view a preview of the document."
    },
    {
      question: "How do I delete a document after uploading?",
      answer: "Go to the File Management or Document Search section. Locate the file you wish to delete and click the trash icon to remove it permanently."
    },
    {
      question: "Can I download my uploaded files?",
      answer: "Yes, you can download any uploaded file by clicking the download icon in the File Management or Document Search section."
    },
    {
      question: "How do I ask the chatbot a question?",
      answer: "Go to the Chatbot section, type your query in the input box, and press Enter. The chatbot will respond using the available documents."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use encryption to secure your data. Additionally, uploaded documents are stored securely, and you have full control over managing your files."
    },
    {
      question: "What happens if I delete a file?",
      answer: "When you delete a file, it is removed from both the database and the storage system. This ensures the file is no longer accessible or searchable."
    },
    {
      question: "How can I see all the files I’ve uploaded?",
      answer: "You can view a list of all uploaded files in the File Management section. The list updates automatically to reflect your latest uploads or deletions."
    },
    {
      question: "What if the chatbot cannot answer my question?",
      answer: "If the chatbot cannot find relevant information in your uploaded documents, it will provide a fallback response indicating it could not find a match."
    }
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{faq.question}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
