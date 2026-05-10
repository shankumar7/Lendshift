import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center gap-3 ${className}`}>
    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 overflow-hidden group">
      {/* Abstract Bolt SVG */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="currentColor"
        />
      </svg>
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
    </div>
    <span className="text-xl font-black font-display tracking-tighter text-white">
      Lend<span className="text-indigo-400">Swift</span>
    </span>
  </div>
);

export default Logo;
