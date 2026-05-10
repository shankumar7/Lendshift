import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Award, 
  Clock, 
  Smartphone,
  ArrowRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
          <span className="text-white font-black text-2xl">L</span>
        </div>
        <span className="text-2xl font-black font-display tracking-tight dark:text-white">LendSwift</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        <a href="#products" className="text-sm font-bold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Products</a>
        <a href="#features" className="text-sm font-bold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Features</a>
        <a href="#why-us" className="text-sm font-bold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Why LendSwift</a>
        <a href="#emi-calc" className="text-sm font-bold text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">EMI Calculator</a>
      </div>

      <Link to="/apply" className="btn-primary h-12 px-8 rounded-full shadow-xl shadow-primary-600/20 flex items-center gap-2 group">
        Apply Now
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-20 px-6 overflow-hidden relative">
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl -mr-80 -mt-80"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary-100 dark:border-primary-900/50"
        >
          <Zap size={14} fill="currentColor" />
          Instant Approval in 2 Minutes
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black font-display leading-[1.1] dark:text-white"
        >
          Loans That Move <br />
          <span className="text-primary-600 italic">As Fast As You Do.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
        >
          Join 2M+ Indians who trust LendSwift for their financial needs. 100% digital process, zero paperwork, and funds in your bank in minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
        >
          <Link to="/apply" className="btn-primary h-14 px-10 rounded-2xl text-lg shadow-2xl shadow-primary-600/30 w-full sm:w-auto flex items-center justify-center gap-2">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="btn-secondary h-14 px-10 rounded-2xl text-lg w-full sm:w-auto border-2">
            Check Eligibility
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center lg:justify-start gap-8 pt-4"
        >
          <div>
            <p className="text-2xl font-black dark:text-white">4.8/5</p>
            <div className="flex gap-1 text-amber-400">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <p className="text-2xl font-black dark:text-white">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Digital</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex-1 relative"
      >
        <div className="relative z-10 p-4">
          <img src="/src/assets/hero.png" alt="Hero" className="w-full h-auto rounded-[3rem] shadow-2xl shadow-primary-600/20" />
        </div>
        {/* Floating Card */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -left-12 top-1/4 z-20 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <CheckCircle2 />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Loan Status</p>
              <p className="text-sm font-black dark:text-white">Disbursed!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const LoanProducts = () => {
  const products = [
    {
      title: 'Personal Loan',
      maxAmount: '₹25 Lakhs',
      rate: '10.5% p.a.',
      tenure: 'Up to 60 Months',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Business Loan',
      maxAmount: '₹75 Lakhs',
      rate: '12.0% p.a.',
      tenure: 'Up to 84 Months',
      icon: Zap,
      color: 'bg-primary-600'
    },
    {
      title: 'Home Loan',
      maxAmount: '₹5 Crores',
      rate: '8.4% p.a.',
      tenure: 'Up to 30 Years',
      icon: Award,
      color: 'bg-accent-600'
    }
  ];

  return (
    <section id="products" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black font-display dark:text-white">Choose Your Loan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Flexible options tailored for your personal and professional growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", product.color)}>
                <product.icon size={28} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black dark:text-white">{product.title}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Max Amount</span>
                    <span className="font-black dark:text-white">{product.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Interest Rate</span>
                    <span className="font-black dark:text-white">{product.rate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Tenure</span>
                    <span className="font-black dark:text-white">{product.tenure}</span>
                  </div>
                </div>
              </div>
              <Link to="/apply" className="w-full btn-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2 group">
                Apply Now
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <span className="text-xl font-black font-display tracking-tight dark:text-white">LendSwift</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          India's leading digital lending platform. Empowering millions with instant credit and transparent terms.
        </p>
      </div>

      <div>
        <h4 className="font-black mb-6 dark:text-white uppercase text-xs tracking-widest">Products</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li><Link to="/apply" className="hover:text-primary-600 transition-colors">Personal Loans</Link></li>
          <li><Link to="/apply" className="hover:text-primary-600 transition-colors">Business Loans</Link></li>
          <li><Link to="/apply" className="hover:text-primary-600 transition-colors">Home Loans</Link></li>
          <li><Link to="/apply" className="hover:text-primary-600 transition-colors">Credit Lines</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-black mb-6 dark:text-white uppercase text-xs tracking-widest">Company</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-primary-600 transition-colors">Compliance</a></li>
          <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-black mb-6 dark:text-white uppercase text-xs tracking-widest">Contact</h4>
        <ul className="space-y-4 text-sm text-slate-500">
          <li>support@lendswift.com</li>
          <li>1800-123-4567</li>
          <li>Bengaluru, India</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-xs text-slate-500 italic">© 2026 LendSwift Financial Services. All rights reserved.</p>
      <div className="flex gap-6 text-slate-400">
        <Smartphone size={18} />
        <ShieldCheck size={18} />
        <Percent size={18} />
      </div>
    </div>
  </footer>
);

import { cn } from '@/utils/cn';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-primary-100 selection:text-primary-700">
      <Navbar />
      <main>
        <Hero />
        <LoanProducts />
        {/* Additional sections like Features, Why Choose Us, Timeline, Testimonials can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
