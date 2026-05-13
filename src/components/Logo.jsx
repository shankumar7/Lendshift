import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export const LogoMark = ({ className, dotClassName, theme = 'dark' }) => (
  <div
    className={cn(
      'w-7 h-7 sm:w-8 sm:h-8 border-2 flex items-center justify-center relative overflow-hidden',
      theme === 'dark' ? 'border-[#121212]' : 'border-white',
      className
    )}
  >
    <motion.div
      variants={{
        hover: { scale: 1.2, rotate: -45 },
      }}
      className={cn(
        'w-2.5 h-2.5 sm:w-3 h-3',
        theme === 'dark' ? 'bg-[#121212]' : 'bg-white',
        dotClassName
      )}
    />
  </div>
);

const Logo = ({ withBackground = false, theme = 'dark' }) => (
  <motion.div whileHover="hover" className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
    <div
      className={cn(
        'flex items-center justify-center transition-all duration-700',
        withBackground ? 'w-16 h-16 bg-white rounded-2xl shadow-sm' : ''
      )}
    >
      <LogoMark
        theme={theme}
        className={cn(
          'transition-all duration-700 group-hover:rotate-45',
          theme === 'dark' ? 'group-hover:bg-[#121212]' : 'group-hover:bg-white'
        )}
        dotClassName={theme === 'dark' ? 'group-hover:bg-white' : 'group-hover:bg-[#121212]'}
      />
    </div>
    <span
      className={cn(
        'font-serif italic text-xl sm:text-2xl tracking-tighter transition-colors',
        theme === 'dark' ? 'text-[#121212]' : 'text-white'
      )}
    >
      LendSwift
    </span>
  </motion.div>
);

export default Logo;
