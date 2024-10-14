import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/getting-started">Getting Started</Link>
        </li>
        <li>
          <Link to="/api-reference">API Reference</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
