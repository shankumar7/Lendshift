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
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { cn } from '@/utils/cn';

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-10">
        {['Personal', 'Business', 'Mortgage', 'About Us'].map(item => (
          <a key={item} href="#" className="text-sm font-bold text-[#42526E] hover:text-[#0065FF] transition-colors">{item}</a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-bold text-[#42526E] hover:text-[#0065FF]">Sign In</button>
        <Link to="/apply" className="btn-primary py-2.5 px-6 text-sm rounded-xl">
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

const StatItem = ({ label, val, icon: Icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-blue-50 text-[#0065FF] rounded-2xl flex items-center justify-center">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-2xl font-black text-[#172B4D]">{val}</p>
      <p className="text-xs font-bold text-[#8993A4] uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

const Hero = () => (
  <section className="pt-40 pb-24 px-6 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DFE1E6] rounded-full text-[#0065FF] text-xs font-bold shadow-sm"
        >
          <span className="w-2 h-2 bg-[#36B37E] rounded-full animate-pulse" />
          Join 2M+ truster borrowers in India
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-7xl font-black font-display leading-[1.1] text-[#172B4D]"
        >
          Financial Freedom, <br />
          <span className="text-[#0065FF]">Made Simple.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[#42526E] max-w-xl leading-relaxed font-medium"
        >
          LendSwift provides transparent, paperless loans with instant approval. 
          Built for modern needs, designed for complete peace of mind.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/apply" className="btn-primary h-16 px-12 text-lg rounded-2xl w-full sm:w-auto flex items-center justify-center gap-2">
            Apply for Loan
            <ArrowRight size={20} />
          </Link>
          <button className="btn-secondary h-16 px-12 text-lg rounded-2xl w-full sm:w-auto">
            Check Eligibility
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-12 pt-8"
        >
          <StatItem label="Active Users" val="2M+" icon={Users} />
          <StatItem label="Disbursed" val="₹5k Cr+" icon={TrendingUp} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="premium-card p-4 rounded-[2.5rem] bg-white relative z-10">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bb1c003f2c8d?auto=format&fit=crop&q=80&w=1200" 
            alt="Dashboard Preview" 
            className="w-full h-auto rounded-[1.8rem] shadow-sm"
          />
        </div>
        {/* Floating Trust Card */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -left-8 top-1/4 z-20 bg-white p-6 rounded-2xl shadow-xl border border-[#DFE1E6] flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-[#36B37E] rounded-full flex items-center justify-center text-white">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#8993A4] uppercase">Status</p>
            <p className="text-sm font-black text-[#172B4D]">Instant Approval!</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const ProductCard = ({ title, amount, rate, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card p-10 group hover:border-[#0065FF] hover:-translate-y-2"
  >
    <div className="w-14 h-14 bg-blue-50 text-[#0065FF] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0065FF] group-hover:text-white transition-all duration-300">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-[#172B4D] mb-4">{title}</h3>
    <div className="space-y-4">
      <div className="flex justify-between border-b border-[#F4F5F7] pb-4">
        <span className="text-sm font-bold text-[#42526E]">Max Amount</span>
        <span className="text-sm font-black text-[#172B4D]">{amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-bold text-[#42526E]">Interest Rate</span>
        <span className="text-sm font-black text-[#36B37E]">{rate}</span>
      </div>
    </div>
    <Link to="/apply" className="mt-8 w-full btn-primary h-12 text-sm rounded-xl flex items-center justify-center gap-2">
      Apply Now
      <ChevronRight size={16} />
    </Link>
  </motion.div>
);

const Feature = ({ title, desc, icon: Icon }) => (
  <div className="flex gap-6">
    <div className="w-14 h-14 shrink-0 bg-blue-50 text-[#0065FF] rounded-2xl flex items-center justify-center">
      <Icon size={28} />
    </div>
    <div>
      <h4 className="text-xl font-black text-[#172B4D] mb-2">{title}</h4>
      <p className="text-[#42526E] leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const LandingPage = () => (
  <div className="min-h-screen bg-white font-sans">
    <Nav />
    <main>
      <Hero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <ProductCard title="Personal Loan" amount="₹25 Lakhs" rate="10.5% p.a." icon={Smartphone} delay={0.1} />
        <ProductCard title="Business Loan" amount="₹75 Lakhs" rate="11.2% p.a." icon={TrendingUp} delay={0.2} />
        <ProductCard title="Home Loan" amount="₹5 Crores" rate="8.4% p.a." icon={Award} delay={0.3} />
      </section>

      <section className="py-24 px-6 bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-black font-display text-[#172B4D]">Why Choose LendSwift?</h2>
            <div className="space-y-8">
              <Feature title="Lightning Speed" desc="Decision in 60 seconds. Funds in your bank in 2 minutes." icon={Zap} />
              <Feature title="Zero Paperwork" desc="100% digital process with Aadhaar and Video KYC." icon={PieChart} />
              <Feature title="Safe & Secure" desc="Bank-grade encryption protecting your personal data." icon={Lock} />
            </div>
          </div>
          <div className="relative">
             <div className="premium-card p-10 bg-white">
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-[#42526E]">Security Score</p>
                      <span className="text-[#36B37E] font-black">EXCELLENT</span>
                   </div>
                   <div className="h-4 w-full bg-[#F4F5F7] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        className="h-full bg-[#36B37E]"
                      />
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <ShieldCheck className="text-[#0065FF]" />
                      <p className="text-xs font-bold text-[#0065FF]">Your data is 256-bit AES encrypted</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
    
    <footer className="py-20 px-6 border-t border-[#DFE1E6] bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-sm">
          <Logo />
          <p className="text-[#42526E] font-medium leading-relaxed">
            Revolutionizing digital lending in India. Fast, transparent, and built on trust.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div className="space-y-4 text-sm">
            <h5 className="font-black text-[#172B4D] uppercase tracking-widest text-xs">Product</h5>
            <div className="flex flex-col gap-3 text-[#42526E] font-bold">
              <a href="#" className="hover:text-[#0065FF]">Loans</a>
              <a href="#" className="hover:text-[#0065FF]">Eligibility</a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <h5 className="font-black text-[#172B4D] uppercase tracking-widest text-xs">Company</h5>
            <div className="flex flex-col gap-3 text-[#42526E] font-bold">
              <a href="#" className="hover:text-[#0065FF]">About</a>
              <a href="#" className="hover:text-[#0065FF]">Privacy</a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <h5 className="font-black text-[#172B4D] uppercase tracking-widest text-xs">Compliance</h5>
            <div className="flex flex-col gap-3 text-[#42526E] font-bold text-[10px]">
              <span>RBI Regulated</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-[#F4F5F7] flex justify-between items-center text-[10px] font-bold text-[#8993A4] uppercase tracking-widest">
        <span>© 2026 LendSwift Financial Services</span>
        <div className="flex gap-6">
          <Smartphone size={14} />
          <Lock size={14} />
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
