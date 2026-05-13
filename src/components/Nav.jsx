import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const links = [
    { name: 'Markets', path: '/markets' },
    { name: 'Enterprise', path: '/enterprise' },
    { name: 'Institutional', path: '/institutional' },
    { name: 'Vision', path: '/vision' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-300 border-b border-[#EEEEEE]/40">
        <motion.div
          className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-[#121212] origin-left z-50"
          style={{ scaleX }}
        />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="scale-90 origin-left">
              <Logo />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#121212]/40 hover:text-[#121212] transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-5">
              <Link to="/apply" className="group flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                  Apply
                </span>
                <ArrowUpRight
                  size={14}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-[#FAFAFA] rounded-lg transition-colors"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        className="fixed inset-0 z-40 bg-white pt-32 px-8"
      >
        <div className="space-y-8">
          {links.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0 }}
              animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-4xl font-serif italic tracking-tighter"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <div className="pt-8 border-t border-[#EEEEEE]">
            <Link to="/apply" className="btn-primary w-full h-14 rounded-xl text-lg">
              Get Started
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Nav;
