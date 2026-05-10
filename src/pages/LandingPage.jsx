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
  ArrowDown,
  Award
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
  <footer className="bg-[#121212] text-white py-32 px-6 sm:px-10 overflow-hidden relative">
    {/* Abstract Background Element */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0065FF]/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-[1600px] mx-auto space-y-32 relative z-10">
      <div className="grid lg:grid-cols-12 gap-24 items-start">
        {/* Brand Column */}
        <div className="lg:col-span-5 space-y-12">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center transition-all duration-700 group-hover:rotate-45">
              <div className="w-3 h-3 bg-white" />
            </div>
            <span className="font-serif italic text-3xl tracking-tighter">LendSwift</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-serif italic leading-[1.1] text-white/90">
            Building the architecture <br />
            of modern liquidity.
          </h2>
          <div className="pt-6">
            <Link to="/apply" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white hover:gap-6 transition-all border-b border-white/20 pb-2 hover:border-white">
              Start a conversation
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Capital</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {['Personal', 'Enterprise', 'Mortgage', 'Markets'].map(item => (
                <a key={item} href="#" className="hover:text-[#0065FF] transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Identity</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {['About', 'Vision', 'Careers', 'Ethics'].map(item => (
                <a key={item} href="#" className="hover:text-[#0065FF] transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-meta text-white/30 font-black tracking-[0.3em]">Network</p>
            <div className="flex flex-col gap-5 text-sm font-bold">
              {['LinkedIn', 'Twitter', 'Contact', 'Support'].map(item => (
                <a key={item} href="#" className="hover:text-[#0065FF] transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Meta */}
      <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="space-y-4 max-w-2xl">
          <p className="text-mono text-[9px] text-white/40 uppercase tracking-widest leading-relaxed">
            LendSwift Technologies Inc. © 2026 / An institutional digital financing platform. <br />
            LendSwift is a regulated entity. All lending activities are subject to local financial laws and credit verification protocols.
            Privacy and security are prioritized using 256-bit AES encryption.
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

        <section className="py-64 px-6 sm:px-10 bg-white border-t border-[#EEEEEE] relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <p className="text-meta text-[#0065FF]">Final Step / Onboarding</p>
                <h2 className="text-6xl sm:text-8xl font-serif italic leading-[0.9] tracking-tighter text-[#121212]">
                  The capital <br />
                  you deserve, <br />
                  <span className="text-[#EEEEEE] hover:text-[#121212] transition-colors cursor-default">delivered.</span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-[#888888] font-sans max-w-md leading-relaxed"
              >
                Zero friction. Institutional trust. <br />
                Start your application in under 60 seconds.
              </motion.p>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative z-10 p-12 sm:p-20 bg-[#F4F5F7] rounded-[3rem] border border-[#EEEEEE] flex flex-col items-center text-center space-y-12"
              >
                <Logo withBackground={true} />

                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic">Begin your journey.</h3>
                  <p className="text-xs font-mono text-[#888888] uppercase tracking-[0.2em]">Institutional Grade / Instant Approval</p>
                </div>
                
                <Link to="/apply" className="btn-primary w-full h-20 rounded-2xl text-xl group">
                  Apply for Capital
                  <ArrowUpRight size={24} className="ml-3 group-hover:rotate-45 transition-transform" />
                </Link>
              </motion.div>

              {/* Decorative "Paper" effect */}
              <div className="absolute top-8 left-8 w-full h-full bg-white border border-[#EEEEEE] rounded-[3rem] z-0" />
            </div>
          </div>

          {/* Background Branding */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none select-none">
            <h1 className="text-[20rem] font-serif italic leading-none">Swift</h1>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
