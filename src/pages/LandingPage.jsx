import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  Smartphone,
  CheckCircle2,
  Lock,
  PieChart,
  MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { cn } from '@/utils/cn';

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-10">
        {['Products', 'Solutions', 'How It Works', 'Company'].map(item => (
          <a key={item} href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{item}</a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white">Log In</button>
        <Link to="/apply" className="btn-primary py-2.5 px-6 text-sm rounded-xl">
          Apply Now
        </Link>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ title, desc, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-glass p-8 rounded-[2rem] group hover:border-indigo-500/50 transition-colors"
  >
    <div className="rim-highlight" />
    <div className="clay-icon mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon size={28} className="text-white" />
    </div>
    <h4 className="text-xl font-bold mb-3">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Hero = () => (
  <section className="relative pt-48 pb-32 px-6">
    {/* Global Glows */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-glow" />
    <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
      <div className="space-y-10 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest"
        >
          <Zap size={14} />
          Your Ambitions, Accelerated
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black font-display leading-[0.9] text-gradient"
        >
          Finance for <br /> the Next <br /> 
          <span className="italic text-indigo-500">Generation.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
        >
          LendSwift delivers flexible, lightning-fast financing for modern businesses and individuals. Experience seamless lending with premium technology.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
        >
          <Link to="/apply" className="btn-primary h-16 px-12 text-lg rounded-2xl group">
            Explore Loans
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="btn-secondary h-16 px-12 text-lg rounded-2xl flex items-center gap-3">
            <Smartphone size={20} />
            Get the App
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative"
      >
        {/* Rocket/Graph Illustration Mockup */}
        <div className="premium-glass p-8 rounded-[3rem] aspect-square relative flex items-center justify-center overflow-hidden">
          <div className="rim-highlight" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
          
          {/* Floating Abstract Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative z-10 space-y-8 text-center"
          >
            <div className="w-32 h-32 bg-indigo-500 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-600/50 mx-auto">
              <TrendingUp size={64} className="text-white -rotate-12" />
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-white">$120,450.00</p>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Total Disbursed Today</p>
            </div>
          </motion.div>

          {/* Mini Cards */}
          <motion.div 
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-12 right-12 glass p-4 rounded-2xl border border-white/10 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-xs font-bold">Approved!</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

const LoanProducts = () => (
  <section className="py-32 px-6">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black font-display text-gradient">Our Loan Ecosystem</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Precision-engineered financial instruments for your growth journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: 'Personal Capital', amount: '$50,000', icon: Smartphone, color: 'from-blue-500 to-indigo-600' },
          { title: 'Business Growth', amount: '$250,000', icon: TrendingUp, color: 'from-indigo-600 to-purple-600' },
          { title: 'Project Financing', amount: '$1M+', icon: Award, color: 'from-purple-600 to-pink-600' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="premium-glass p-10 rounded-[2.5rem] group"
          >
            <div className="rim-highlight" />
            <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br mb-8 flex items-center justify-center text-white", item.color)}>
              <item.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Max Limit</p>
                <p className="text-2xl font-black text-white">{item.amount}</p>
              </div>
              <Link to="/apply" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 px-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="space-y-6">
        <Logo />
        <p className="text-sm text-slate-500 leading-relaxed">
          The future of digital lending. Fast, secure, and built for you.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white">Product</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li><a href="#" className="hover:text-indigo-400">Personal Loans</a></li>
          <li><a href="#" className="hover:text-indigo-400">Business Loans</a></li>
          <li><a href="#" className="hover:text-indigo-400">Credit Lines</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white">Trust</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li><a href="#" className="hover:text-indigo-400">Security</a></li>
          <li><a href="#" className="hover:text-indigo-400">Privacy</a></li>
          <li><a href="#" className="hover:text-indigo-400">Terms</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white">Connect</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li>Twitter</li>
          <li>LinkedIn</li>
          <li>Support</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">
      © 2026 LendSwift Technologies Inc. All rights reserved.
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#06060E] text-white">
      <Nav />
      <main>
        <Hero />
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 -mt-20 relative z-20">
          <FeatureCard 
            title="Lightning Fast" 
            desc="Decision in 60 seconds. Funds in 2 minutes." 
            icon={Zap} 
            delay={0.1}
          />
          <FeatureCard 
            title="Tailored Solutions" 
            desc="Customized terms built for your specific needs." 
            icon={PieChart} 
            delay={0.2}
          />
          <FeatureCard 
            title="Ironclad Security" 
            desc="256-bit encryption for every transaction." 
            icon={Lock} 
            delay={0.3}
          />
        </section>
        <LoanProducts />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
