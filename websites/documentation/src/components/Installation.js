import React from 'react';
import CodeBlock from './CodeBlock'; // Updated CodeBlock with syntax highlighting

function Installation() {
  return (
    <div className="mb-12">
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold mb-8 text-gray-800">Installation</h2>

      {/* Installing with pip */}
      <div className="bg-gray-50 shadow-md p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Installing with pip</h3>
        <p className="mb-4 text-gray-700">To install the INBOT AI Library, run the following command in your terminal:</p>
        <div className=" rounded-md p-4 mb-4">
          <CodeBlock language="bash" code={`pip install INBOT_AI_Library`} />
        </div>
      </div>

      {/* Virtual Environment Setup */}
      <div className="bg-gray-50 shadow-md p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Using a Virtual Environment</h3>
        <p className="mb-4 text-gray-700">We recommend using a virtual environment to manage your project's dependencies. Follow these steps:</p>

        <ol className="space-y-8 text-gray-700">
          <li className="border-l-4 border-gray-300 pl-4">
            <span className="block mb-2 font-semibold">1. Create and activate a virtual environment:</span>
            <div className="rounded-md p-4 mb-2">
              <CodeBlock language="bash" code={`python -m venv venv\nsource venv/bin/activate`} />
            </div>
            <p className="text-sm text-gray-500">For Windows, use <code className="bg-gray-200 rounded-md px-1 py-0.5">venv\\Scripts\\activate</code> to activate the environment.</p>
          </li>

          <li className="border-l-4 border-gray-300 pl-4">
            <span className="block mb-2 font-semibold">2. Install the INBOT AI Library:</span>
            <div className="rounded-md p-4 mb-2">
              <CodeBlock language="bash" code={`pip install INBOT_AI_Library`} />
            </div>
          </li>

          <li className="border-l-4 border-gray-300 pl-4">
            <span className="block mb-2 font-semibold">3. Verify the installation:</span>
            <div className="rounded-md p-4 mb-2">
              <CodeBlock language="bash" code={`pip freeze`} />
            </div>
            <p className="text-sm text-gray-500">This command will display a list of installed packages, including <code className="bg-gray-200 rounded-md px-1 py-0.5">INBOT_AI_Library</code>.</p>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Installation;
