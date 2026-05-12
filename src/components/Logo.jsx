import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export const LogoMark = ({ className, dotClassName }) => (
  <div
    className={cn(
      'w-7 h-7 sm:w-8 sm:h-8 border-2 border-[#121212] flex items-center justify-center relative overflow-hidden',
      className
    )}
  >
    <motion.div
      variants={{
        hover: { scale: 1.2, rotate: -45 },
      }}
      className={cn('w-2.5 h-2.5 sm:w-3 h-3 bg-[#121212]', dotClassName)}
    />
  </div>
);

const Logo = ({ withBackground = false }) => (
  <motion.div whileHover="hover" className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
    <div
      className={cn(
        'flex items-center justify-center transition-all duration-700',
        withBackground ? 'w-16 h-16 bg-white rounded-2xl shadow-sm' : ''
      )}
    >
      <LogoMark
        className={cn('transition-all duration-700 group-hover:bg-[#121212] group-hover:rotate-45')}
        dotClassName="group-hover:bg-white"
      />
    </div>
    <span className="font-serif italic text-xl sm:text-2xl tracking-tighter text-[#121212]">
      LendSwift
    </span>
  </motion.div>
);

export default Logo;
