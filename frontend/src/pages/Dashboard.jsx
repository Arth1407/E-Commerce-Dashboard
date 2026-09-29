import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/analytics/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">Welcome to your AI-powered store overview</p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-4xl font-bold text-indigo-400 mt-2">
            {summary ? summary.total_products : '...'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Stock</p>
          <p className="text-4xl font-bold text-green-400 mt-2">
            {summary ? summary.total_stock : '...'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Inventory Value</p>
          <p className="text-4xl font-bold text-yellow-400 mt-2">
            ₹{summary ? summary.total_inventory_value.toLocaleString() : '...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;