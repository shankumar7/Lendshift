import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight,
  Menu,
  X,
  ArrowDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { cn } from '@/utils/cn';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EEEEEE]">
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#121212] origin-left"
          style={{ scaleX }}
        />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {['Capital', 'Markets', 'Company', 'Inside'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888888] hover:text-[#121212] transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/apply" className="hidden sm:block text-xs font-black border-b-2 border-[#121212] pb-0.5 hover:opacity-70 transition-opacity">
              Start Application
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-[#FAFAFA] rounded-full transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        className="fixed inset-0 z-40 bg-white pt-32 px-10"
      >
        <div className="space-y-10">
          {['Capital', 'Markets', 'Company', 'Inside'].map((item, i) => (
            <motion.a 
              key={item}
              initial={{ x: -20, opacity: 0 }}
              animate={isOpen ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: i * 0.1 }}
              href="#" 
              className="block text-5xl font-serif italic hover:text-[#0065FF] transition-colors"
            >
              {item}
            </motion.a>
          ))}
          <div className="pt-10 border-t border-[#EEEEEE]">
            <Link to="/apply" className="btn-primary w-full h-16 rounded-2xl text-lg">
              Apply Now
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Hero = () => (
  <section className="pt-48 pb-20 sm:pb-32 px-6 sm:px-10 grain-bg">
    <div className="max-w-[1600px] mx-auto">
      <div className="space-y-12 mb-24">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-meta"
        >
          2026 Edition / Institutional Fluidity
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-editorial"
        >
          Capital that <br className="hidden sm:block" /> 
          breathes <span className="text-[#0065FF] underline decoration-[0.05em] underline-offset-[0.1em]">with</span> you.
        </motion.h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 items-end">
        <div className="lg:col-span-7 space-y-10">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-[#444444] leading-tight font-sans max-w-2xl"
          >
            LendSwift redefines the intersection of institutional stability and digital agility. 
            High-velocity financing for the creators of the next decade.
          </motion.p>
          <div className="flex flex-wrap gap-6 pt-4">
             <ArrowDown size={32} className="animate-bounce text-[#EEEEEE]" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-5 flex flex-col sm:flex-row gap-6 lg:justify-end"
        >
          <Link to="/apply" className="btn-primary group h-14 sm:h-16 px-10 sm:px-14">
            Apply Now
            <ArrowUpRight size={18} className="ml-2 group-hover:rotate-45 transition-transform" />
          </Link>
          <button className="btn-secondary h-14 sm:h-16 px-10 sm:px-14">
            Our Methods
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const ProductLine = ({ title, desc, rate, amount, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    viewport={{ once: true }}
    className="minimal-card flex flex-col justify-between group h-full min-h-[400px]"
  >
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-4xl font-serif italic">{title}</h3>
        <div className="w-10 h-10 border border-[#EEEEEE] rounded-full flex items-center justify-center group-hover:bg-[#121212] group-hover:text-white transition-all">
          <ArrowUpRight size={16} />
        </div>
      </div>
      <p className="text-sm sm:text-base text-[#888888] font-sans leading-relaxed max-w-[280px]">{desc}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-8 border-t border-[#EEEEEE] pt-10">
      <div className="space-y-1">
        <p className="text-meta">Max Limit</p>
        <p className="text-xl font-mono tracking-tighter">{amount}</p>
      </div>
      <div className="space-y-1">
        <p className="text-meta">Fixed Rate</p>
        <p className="text-xl font-mono tracking-tighter">{rate}</p>
      </div>
    </div>
  </motion.div>
);

const FeaturesSection = () => (
  <section className="py-32 sm:py-48 px-6 sm:px-10 border-t border-[#EEEEEE]">
    <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-24">
      <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8">
        <p className="text-meta">Core Philosophy</p>
        <h2 className="text-5xl sm:text-6xl font-serif italic leading-[1.1]">The mechanics of trust.</h2>
        <p className="text-slate-500 font-sans leading-relaxed max-w-sm">
          A three-pillar approach to digital financing, built on absolute transparency and real-time velocity.
        </p>
      </div>
      
      <div className="lg:col-span-8 space-y-32 sm:space-y-48">
        {[
          { 
            num: "01", 
            title: "Real-time Verification", 
            desc: "Using proprietary e-bridge protocols, we verify identity and assets in under 60 seconds. Paperless, friction-less, human-centric.",
            icon: ShieldCheck
          },
          { 
            num: "02", 
            title: "Dynamic Underwriting", 
            desc: "Our algorithms evaluate potential, not just history. We look at the trajectory of your growth to determine liquidity limits.",
            icon: TrendingUp
          },
          { 
            num: "03", 
            title: "Atomic Disbursement", 
            desc: "Once approved, capital moves instantly. Atomic settlement ensures that your ambition is never bottlenecked by legacy banking cycles.",
            icon: Zap
          }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="grid sm:grid-cols-12 gap-10 items-start group"
          >
            <p className="sm:col-span-2 font-serif italic text-6xl sm:text-8xl text-[#EEEEEE] group-hover:text-[#121212] transition-colors duration-700">{f.num}</p>
            <div className="sm:col-span-10 pt-4 space-y-6">
              <h4 className="text-2xl font-black uppercase tracking-tight">{f.title}</h4>
              <p className="text-lg text-[#888888] leading-relaxed max-w-xl">{f.desc}</p>
              <div className="w-12 h-12 bg-[#FAFAFA] rounded-2xl flex items-center justify-center text-[#121212]">
                <f.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 sm:py-32 px-6 sm:px-10 border-t border-[#EEEEEE] bg-[#FAFAFA]">
    <div className="max-w-[1600px] mx-auto space-y-32">
      <div className="flex flex-col lg:flex-row justify-between gap-24">
        <div className="space-y-12 max-w-sm">
          <Logo />
          <p className="text-sm text-[#888888] leading-relaxed font-sans">
            LendSwift Technologies Inc. / 2026<br />
            An institutional-grade digital financing platform. 
            Member of the Global Fintech Alliance.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
          <div className="space-y-6">
            <p className="text-meta">Capital</p>
            <div className="flex flex-col gap-4 text-sm font-bold text-[#121212]">
              <a href="#" className="hover:opacity-50 transition-opacity">Personal</a>
              <a href="#" className="hover:opacity-50 transition-opacity">Enterprise</a>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-meta">Corporate</p>
            <div className="flex flex-col gap-4 text-sm font-bold text-[#121212]">
              <a href="#" className="hover:opacity-50 transition-opacity">About</a>
              <a href="#" className="hover:opacity-50 transition-opacity">Privacy</a>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-meta">Network</p>
            <div className="flex flex-col gap-4 text-sm font-bold text-[#121212]">
              <a href="#" className="hover:opacity-50 transition-opacity">LinkedIn</a>
              <a href="#" className="hover:opacity-50 transition-opacity">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-[#EEEEEE] flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-meta text-[9px]">LendSwift is a regulated financial platform. All loans are subject to credit approval and verification.</p>
        <div className="flex gap-10 opacity-30">
          <ShieldCheck size={18} />
          <Award size={18} />
          <Zap size={18} />
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white grain-bg font-sans selection:bg-[#121212] selection:text-white">
      <Nav />
      <main className="relative">
        <Hero />
        
        <section className="border-t border-[#EEEEEE]">
          <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 lg:grid-cols-3">
            <ProductLine 
              title="Personal" 
              desc="Liquidity solutions for individual growth and asset management."
              amount="₹25L"
              rate="10.4% p.a."
              index={0}
            />
            <ProductLine 
              title="Enterprise" 
              desc="Deep-tier working capital for high-growth organizations."
              amount="₹75L"
              rate="11.2% p.a."
              index={1}
            />
            <ProductLine 
              title="Mortgage" 
              desc="Institutional-grade property and fixed-asset financing."
              amount="₹5Cr"
              rate="8.3% p.a."
              index={2}
            />
          </div>
        </section>

        <FeaturesSection />

        <section className="py-48 px-6 sm:px-10 bg-[#121212] text-white overflow-hidden relative">
          <div className="max-w-[1600px] mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif italic leading-none">Ready to <br /> accelerate?</h2>
            <div className="pt-6">
               <Link to="/apply" className="inline-flex items-center justify-center py-5 px-16 bg-white text-[#121212] rounded-full font-black text-lg hover:scale-110 transition-transform">
                 Apply Now
               </Link>
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
