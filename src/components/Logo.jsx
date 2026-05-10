import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => (
  <motion.div 
    whileHover="hover"
    className="flex items-center gap-3 sm:gap-4 group cursor-pointer"
  >
    <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-[#121212] flex items-center justify-center relative overflow-hidden transition-all duration-700 group-hover:bg-[#121212] group-hover:rotate-45">
      <motion.div 
        variants={{
          hover: { scale: 1.2, rotate: -45 }
        }}
        className="w-2.5 h-2.5 sm:w-3 h-3 bg-[#121212] transition-colors group-hover:bg-white"
      />
    </div>
    <span className="font-serif italic text-xl sm:text-2xl tracking-tighter text-[#121212]">
      LendSwift
    </span>
  </motion.div>
);

export default Logo;
