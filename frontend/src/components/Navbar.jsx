import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Navbar() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/')
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">System Status:</span>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            online
              ? 'bg-green-950 text-green-400 border border-green-800'
              : 'bg-red-950 text-red-400 border border-red-800'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'}`}></span>
          {online ? 'API Online (Port 8000)' : 'API Disconnected'}
        </span>
      </div>
      <div className="text-xs text-gray-400">
        <span className="text-indigo-400 font-semibold">DSN2098</span> Project Exhibition-I | VIT Bhopal
      </div>
    </header>
  );
}

export default Navbar;