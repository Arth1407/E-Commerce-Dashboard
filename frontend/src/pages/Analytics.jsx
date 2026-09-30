import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const API_BASE = 'http://127.0.0.1:8000';

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        const [sumRes, catRes, lowRes, expRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/analytics/summary`),
          axios.get(`${API_BASE}/analytics/by-category`),
          axios.get(`${API_BASE}/analytics/low-stock`),
          axios.get(`${API_BASE}/analytics/expiring-soon`),
        ]);

        if (!isMounted) return;

        if (sumRes.status === 'fulfilled') {
          setSummary(sumRes.value.data);
        }

        if (catRes.status === 'fulfilled' && catRes.value.data) {
          const formatted = Object.entries(catRes.value.data).map(([name, data]) => ({
            name,
            products: data.count,
            value: Math.round(data.total_value),
          }));
          setCategoryData(formatted);
        }

        if (lowRes.status === 'fulfilled') {
          setLowStock(lowRes.value.data || []);
        }

        if (expRes.status === 'fulfilled') {
          setExpiring(expRes.value.data || []);
        }
      } catch (err) {
        console.error('Analytics fetch encountered an issue:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Analytics</h2>
          <p className="text-gray-400">Overview of your store inventory and sales metrics</p>
        </div>
        {loading && (
          <span className="text-xs text-indigo-400 animate-pulse bg-indigo-950/60 border border-indigo-800 px-3 py-1 rounded-full">
            Refreshing data...
          </span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-4xl font-bold text-indigo-400 mt-2">
            {summary ? summary.total_products : '0'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-sm">Total Stock Units</p>
          <p className="text-4xl font-bold text-green-400 mt-2">
            {summary ? summary.total_stock : '0'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
          <p className="text-gray-400 text-sm">Inventory Value</p>
          <p className="text-4xl font-bold text-yellow-400 mt-2">
            ₹{summary ? summary.total_inventory_value.toLocaleString() : '0'}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Products by Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-16 text-sm">No category data recorded yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
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
            <p className="text-gray-500 text-center py-16 text-sm">No inventory value recorded yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
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
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-gray-900 rounded-xl p-6 border border-red-950">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            <span>⚠️</span> Low Stock Alerts (&lt; 10 units)
          </h3>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">All products have sufficient stock.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-gray-800/80 rounded-lg px-4 py-3 border border-red-900/30">
                  <div>
                    <p className="text-white font-medium text-sm">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.category}</p>
                  </div>
                  <span className="text-red-400 font-bold text-sm bg-red-950/70 border border-red-800 px-2.5 py-0.5 rounded-md">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Soon */}
        <div className="bg-gray-900 rounded-xl p-6 border border-yellow-950">
          <h3 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2">
            <span>📅</span> Expiring Within 30 Days
          </h3>
          {expiring.length === 0 ? (
            <p className="text-gray-500 text-sm">No products expiring in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {expiring.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-gray-800/80 rounded-lg px-4 py-3 border border-yellow-900/30">
                  <div>
                    <p className="text-white font-medium text-sm">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.category}</p>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm bg-yellow-950/70 border border-yellow-800 px-2.5 py-0.5 rounded-md">
                    {p.expiry_date}
                  </span>
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