import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center gap-3 ${className}`}>
    <div className="relative w-10 h-10 bg-[#0065FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 overflow-hidden group">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-6 h-6 text-white relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
          fill="currentColor"
        />
      </svg>
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </div>
    <span className="text-xl font-black font-display tracking-tight text-[#172B4D]">
      Lend<span className="text-[#0065FF]">Swift</span>
    </span>
  </div>
);

export default Logo;
