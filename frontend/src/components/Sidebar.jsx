import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/products', icon: '📦', label: 'Products' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/chat', icon: '🤖', label: 'AI Chat' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-indigo-400">🛒 E-Commerce</h1>
        <p className="text-xs text-gray-500 mt-1">AI Management Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">DSN2098 Project Exhibition-I</p>
        <p className="text-xs text-gray-600">VIT Bhopal University</p>
      </div>
    </div>
  );
}

export default Sidebar;