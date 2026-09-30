import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/analytics/summary')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));

    axios
      .get('http://127.0.0.1:8000/analytics/low-stock')
      .then((res) => setLowStock(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Store Overview</h2>
        <p className="text-gray-400">Welcome to your unified e-commerce management center</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Products</p>
          <p className="text-4xl font-extrabold text-indigo-400 mt-2">
            {summary ? summary.total_products : '...'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Live active catalog items</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Stock Units</p>
          <p className="text-4xl font-extrabold text-green-400 mt-2">
            {summary ? summary.total_stock : '...'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Units in inventory</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Inventory Value</p>
          <p className="text-4xl font-extrabold text-yellow-400 mt-2">
            ₹{summary ? summary.total_inventory_value.toLocaleString() : '...'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Cumulative stock value</p>
        </div>
      </div>

      {/* Quick Access to Key Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-950/60 to-gray-900 p-6 rounded-2xl border border-indigo-900/40">
          <h3 className="text-lg font-bold text-white mb-2">AI Business Assistant</h3>
          <p className="text-sm text-gray-400 mb-4">
            Ask Gemini questions about stock replenishment, discount tactics, and e-commerce growth strategies.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Launch AI Advisor →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-950/60 to-gray-900 p-6 rounded-2xl border border-purple-900/40">
          <h3 className="text-lg font-bold text-white mb-2">Social Post Automation</h3>
          <p className="text-sm text-gray-400 mb-4">
            Create high-engagement captions and hashtags for Instagram directly from your catalog.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Generate Post →
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚠️</span> Critical Inventory Alerts (&lt; 10 units)
          </h3>
          <Link to="/products" className="text-xs text-indigo-400 hover:underline">
            View all products →
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <p className="text-sm text-gray-500">All inventory levels are optimal.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/80 border border-red-900/50 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.category}</p>
                </div>
                <span className="text-red-400 font-bold text-sm bg-red-950/70 border border-red-800 px-2 py-1 rounded-md">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;