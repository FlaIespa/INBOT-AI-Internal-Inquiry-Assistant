import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, code }) {
  return (
    <div className="rounded-lg p-4 overflow-auto mb-6"> {/* Changed bg-gray-800 */}
      <SyntaxHighlighter language={language} style={materialDark}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
