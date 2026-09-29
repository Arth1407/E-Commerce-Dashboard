import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/analytics/summary').then(res => setSummary(res.data));
    axios.get('http://127.0.0.1:8000/analytics/by-category').then(res => {
      const formatted = Object.entries(res.data).map(([name, data]) => ({
        name,
        products: data.count,
        value: Math.round(data.total_value),
      }));
      setCategoryData(formatted);
    });
    axios.get('http://127.0.0.1:8000/analytics/low-stock').then(res => setLowStock(res.data));
    axios.get('http://127.0.0.1:8000/analytics/expiring-soon').then(res => setExpiring(res.data));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
      <p className="text-gray-400 mb-8">Overview of your store performance</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-4xl font-bold text-indigo-400 mt-2">
            {summary ? summary.total_products : '...'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Stock Units</p>
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

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Products by Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="products" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Inventory Value by Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-red-900">
          <h3 className="text-red-400 font-semibold mb-4">⚠️ Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="text-gray-500">All products have sufficient stock</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.category}</p>
                  </div>
                  <span className="text-red-400 font-bold">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Soon */}
        <div className="bg-gray-900 rounded-xl p-6 border border-yellow-900">
          <h3 className="text-yellow-400 font-semibold mb-4">📅 Expiring Within 30 Days</h3>
          {expiring.length === 0 ? (
            <p className="text-gray-500">No products expiring soon</p>
          ) : (
            <div className="space-y-3">
              {expiring.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.category}</p>
                  </div>
                  <span className="text-yellow-400 font-bold">{p.expiry_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;