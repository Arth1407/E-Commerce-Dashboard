import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-950 text-white">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chat" element={<AIChat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;