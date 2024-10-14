import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="p-10 rounded-xl shadow-md min-h-screen">
      {/* Hero Section */}
      <section className=" bg-gray-50 text-center py-16 text-gray-800 rounded-xl shadow-lg mb-10">
        <h1 className="text-6xl font-bold mb-4">Welcome to INBOT</h1>
        <p className="text-xl mb-6">Your AI-driven solution for internal knowledge management.</p>
        <Link to="/getting-started" className="text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-white">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Features</h2>
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2 text-gray-700">Document Parsing</h3>
            <p>Easily upload and parse company documents to streamline information access.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2 text-gray-700">Advanced Search</h3>
            <p>Search across your documents with fuzzy matching and keyword highlighting.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2 text-gray-700">Groq AI Integration</h3>
            <p>Leverage advanced AI models to provide context-aware responses.</p>
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-12">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-800">Resources</h2>
        <ul className="space-y-6">
          <li className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link to="/api-reference" className="text-lg hover:underline">
              API Reference
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link to="/getting-started" className="text-lg hover:underline">
              Installation Guide
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link to="/examples" className="text-lg hover:underline">
              Examples
            </Link>
          </li>
        </ul>
      </section>

    </div>
  );
}

export default Home;
