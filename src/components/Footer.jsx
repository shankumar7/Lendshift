import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Award, Zap } from 'lucide-react';
import Logo from './Logo';

const Footer = () => (
  <footer className="bg-[#121212] text-white pt-32 pb-12 px-6 sm:px-10 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0065FF]/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-[1600px] mx-auto space-y-20 relative z-10">
      <div className="grid lg:grid-cols-12 gap-24 items-start">
        <div className="lg:col-span-5 space-y-12">
          <Link to="/">
            <Logo theme="light" />
          </Link>
          <h2 className="text-5xl sm:text-6xl font-serif italic leading-[1.1] text-white/90">
            Building the architecture <br />
            of modern liquidity.
          </h2>
          <div className="pt-6">
            <Link
              to="/apply"
              className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white hover:gap-6 transition-all border-b border-white/20 pb-2 hover:border-white"
            >
              Start a conversation
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Capital</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {[
                { name: 'Personal', path: '/personal' },
                { name: 'Enterprise', path: '/enterprise' },
                { name: 'Mortgage', path: '/mortgage' },
                { name: 'Markets', path: '/markets' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-[#0065FF] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Identity</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {[
                { name: 'About', path: '/about' },
                { name: 'Vision', path: '/vision' },
                { name: 'Careers', path: '/careers' },
                { name: 'Ethics', path: '/ethics' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-[#0065FF] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Network</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {[
                { name: 'LinkedIn', path: '#' },
                { name: 'Twitter', path: '#' },
                { name: 'Contact', path: '#' },
                { name: 'Support', path: '/support' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-[#0065FF] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="space-y-4 max-w-2xl">
          <p className="text-mono text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
            LendSwift Technologies Inc. © 2026 / An institutional digital financing platform. <br />
            LendSwift is a regulated entity. All lending activities are subject to local financial
            laws and credit verification protocols. Privacy and security are prioritized using
            256-bit AES encryption.
          </p>
        </div>
        <div className="flex gap-12 text-white/20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="text-meta text-[8px]">ISO 27001</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={18} />
            <span className="text-meta text-[8px]">NBFC Reg</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={18} />
            <span className="text-meta text-[8px]">Real-time</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
