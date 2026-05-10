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
  Star,
  Users,
  Layout,
  Fingerprint
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

const Navbar = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
    <div className="glass px-8 py-4 rounded-[2rem] flex items-center justify-between">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
          <span className="text-white font-black text-xl">L</span>
        </div>
        <span className="text-xl font-black font-display tracking-tight dark:text-white">LendSwift</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Products', 'Solutions', 'Resources', 'Support'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">{item}</a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-bold text-indigo-600 dark:text-indigo-400">Login</button>
        <Link to="/apply" className="btn-primary py-2.5 px-6 text-sm rounded-xl">
          Get Started
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  </nav>
);

const MorphIcon = ({ icon: Icon, color }) => (
  <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_10px_20px_rgba(0,0,0,0.05)]", color)}>
    <Icon size={28} className="text-white" />
  </div>
);

const Hero = () => (
  <section className="relative pt-48 pb-32 px-6 overflow-hidden">
    {/* Abstract Blob Background */}
    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[50%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none"></div>

    <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
      >
        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fastest disbursement in 2026</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-black font-display leading-[0.9] tracking-tighter dark:text-white"
      >
        Credit that <br />
        <span className="bg-gradient-to-r from-indigo-600 via-indigo-400 to-rose-500 bg-clip-text text-transparent">Empowers.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium"
      >
        LendSwift bridges the gap between your ambitions and reality. 
        100% digital, zero paperwork, and built for the modern Indian economy.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-6"
      >
        <Link to="/apply" className="btn-primary h-16 px-12 rounded-2xl text-lg group">
          Apply for Loan
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <button className="btn-secondary h-16 px-12 rounded-2xl text-lg">
          Check Score
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
      >
        {[
          { label: 'Users', val: '2M+', icon: Users },
          { label: 'Disbursed', val: '₹5k Cr+', icon: TrendingUp },
          { label: 'Approval', val: '98%', icon: ShieldCheck },
          { label: 'Rating', val: '4.9/5', icon: Star },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <stat.icon size={20} className="text-slate-400" />
            <p className="text-lg font-black dark:text-white">{stat.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const ProductCard = ({ title, amount, rate, icon, color }) => (
  <motion.div 
    whileHover={{ y: -12 }}
    className="clay-card p-10 flex flex-col gap-10 group"
  >
    <div className="flex justify-between items-start">
      <MorphIcon icon={icon} color={color} />
      <div className="w-12 h-12 rounded-full border-2 border-slate-50 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <ChevronRight size={24} />
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-black dark:text-white">{title}</h3>
      <p className="text-slate-500 font-medium">Starting from {rate}</p>
    </div>
    <div className="neu-inset p-6 rounded-2xl space-y-4">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Limit</p>
        <p className="text-xl font-black dark:text-white">{amount}</p>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '70%' }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  </motion.div>
);

const Products = () => (
  <section id="products" className="py-32 px-6">
    <div className="max-w-7xl mx-auto space-y-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4 max-w-xl">
          <h2 className="text-5xl font-black font-display leading-tight dark:text-white">Smart Financing for <br />Every Lifecycle.</h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">Whether it's a new home, a business pivot, or personal growth, we have a specialized instrument for you.</p>
        </div>
        <Link to="/apply" className="text-indigo-600 font-black flex items-center gap-2 hover:gap-4 transition-all">
          View All Products
          <ArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ProductCard 
          title="Personal" 
          amount="₹25 Lakhs" 
          rate="10.49%" 
          icon={Layout} 
          color="bg-indigo-600" 
        />
        <ProductCard 
          title="Business" 
          amount="₹75 Lakhs" 
          rate="11.99%" 
          icon={TrendingUp} 
          color="bg-[#1A1A1A] dark:bg-white dark:!text-black" 
        />
        <ProductCard 
          title="Mortgage" 
          amount="₹5 Crores" 
          rate="8.35%" 
          icon={Award} 
          color="bg-rose-500" 
        />
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-32 px-6 bg-[#F8F9FF] dark:bg-[#08080C]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div className="space-y-12">
        <h2 className="text-5xl font-black font-display leading-tight dark:text-white">Built for speed, <br />Secured by Design.</h2>
        <div className="space-y-8">
          {[
            { 
              title: 'Instant e-KYC', 
              desc: 'Paperless onboarding using Aadhaar & Video KYC.',
              icon: Fingerprint,
              color: 'text-indigo-600'
            },
            { 
              title: 'Smart Underwriting', 
              desc: 'AI-driven credit assessment for fair approval odds.',
              icon: Zap,
              color: 'text-rose-500'
            },
            { 
              title: 'Bank-Grade Security', 
              desc: 'Your data is encrypted with AES-256 protocols.',
              icon: ShieldCheck,
              color: 'text-emerald-500'
            }
          ].map((f, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <f.icon className={f.color} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black dark:text-white">{f.title}</h4>
                <p className="text-slate-500 font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="clay-card p-4 aspect-square max-w-md mx-auto relative z-10 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800" alt="App Preview" className="w-full h-full object-cover rounded-[1.5rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
            <p className="text-white text-2xl font-black">Digital-First <br />Experience.</p>
          </div>
        </div>
        {/* Floating Morph Elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 glass rounded-3xl animate-float flex items-center justify-center">
          <Smartphone size={48} className="text-indigo-600" />
        </div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 glass rounded-full blur-2xl bg-indigo-600/20"></div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 px-6 bg-white dark:bg-[#050508] border-t border-slate-100 dark:border-white/5">
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-black dark:text-white">LendSwift</span>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            Revolutionizing digital credit for the next billion users. Built with trust in Bengaluru.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div className="space-y-4">
            <h5 className="font-black text-xs uppercase tracking-widest dark:text-white">Products</h5>
            <div className="flex flex-col gap-3 text-slate-500 font-bold text-sm">
              <a href="#">Personal</a>
              <a href="#">Business</a>
              <a href="#">Mortgage</a>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-black text-xs uppercase tracking-widest dark:text-white">Company</h5>
            <div className="flex flex-col gap-3 text-slate-500 font-bold text-sm">
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Careers</a>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-black text-xs uppercase tracking-widest dark:text-white">Social</h5>
            <div className="flex flex-col gap-3 text-slate-500 font-bold text-sm">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-slate-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 LendSwift Financial. Member of NBFC Federation.</p>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center grayscale opacity-50"><ShieldCheck size={16} /></div>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center grayscale opacity-50"><Zap size={16} /></div>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050508] font-sans">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
