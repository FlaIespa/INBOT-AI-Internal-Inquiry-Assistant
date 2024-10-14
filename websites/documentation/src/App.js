import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GettingStarted from './pages/GettingStarted';
import APIReference from './pages/APIReference';
import Sidebar from './components/Sidebar';  // Import Sidebar component
import SlackIntegration from './components/SlackIntegration';


function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />  
        <div className="flex-1 ml-64 p-10 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api-reference" element={<APIReference />} />
            <Route path="/slack-integration" element={<SlackIntegration/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
