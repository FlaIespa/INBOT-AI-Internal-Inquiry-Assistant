import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import CodeBlock from './CodeBlock';

function MethodCard({ name, description, parameters, returns, example }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-800" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-800" />
        )}
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {isOpen && (
        <div className="mt-4">
          <p className="mb-2">
            <strong>Parameters: </strong>
          </p>
          <ul className="list-disc list-inside mb-4">
            {parameters.map((param, index) => (
              <li key={index}>
                <code>{param.name}</code>: {param.description}
              </li>
            ))}
          </ul>
          <p className="mb-2">
            <strong>Returns: </strong>{returns}
          </p>

          <h4 className="font-semibold mt-4">Example:</h4>
          <CodeBlock language="python" code={example} />
        </div>
      )}
    </div>
  );
}

export default MethodCard;
