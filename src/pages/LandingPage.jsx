import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, TrendingUp, ArrowUpRight, ArrowDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import useLoanStore from '@/store/useLoanStore';

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const Hero = () => (
  <section className="pt-48 pb-20 sm:pb-32 px-6 sm:px-10 grain-bg">
    <div className="max-w-[1600px] mx-auto">
      <div className="space-y-12 mb-24">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-meta">
          2026 Edition / Institutional Fluidity
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-editorial text-3xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.1] sm:leading-tight"
        >
          Capital that <br className="hidden sm:block" />
          breathes{' '}
          <span className="text-[#0065FF] underline decoration-[0.05em] underline-offset-[0.1em]">
            with
          </span>{' '}
          you.
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
          <Link
            to="/apply"
            className="btn-primary group h-14 sm:h-16 px-10 sm:px-12 text-xs sm:text-sm"
          >
            Apply Now
            <ArrowUpRight size={16} className="ml-2 group-hover:rotate-45 transition-transform" />
          </Link>
          <Link
            to="/methods"
            className="btn-secondary flex items-center justify-center h-14 sm:h-16 px-10 sm:px-12 text-xs sm:text-sm"
          >
            Our Methods
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

const ProductLine = ({ title, desc, rate, amount, index }) => {
  const navigate = useNavigate();
  const updateFormData = useLoanStore((state) => state.updateFormData);

  const handleApply = () => {
    // Map UI title to store loan type key
    const typeMap = {
      Personal: 'personal',
      Enterprise: 'business',
      Mortgage: 'home',
    };

    updateFormData('loanSelection', { loanType: typeMap[title] || 'personal' });
    navigate('/apply/step/1');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      onClick={handleApply}
      className="minimal-card flex flex-col justify-between group h-full min-h-[400px] cursor-pointer hover:bg-[#FAFAFA] transition-all"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-4xl font-serif italic">{title}</h3>
          <div className="w-10 h-10 border border-[#EEEEEE] rounded-full flex items-center justify-center group-hover:bg-[#121212] group-hover:text-white transition-all">
            <ArrowUpRight size={16} />
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#888888] font-sans leading-relaxed max-w-[280px]">
          {desc}
        </p>
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
};

const FeaturesSection = () => (
  <section className="py-32 sm:py-48 px-6 sm:px-10 border-t border-[#EEEEEE]">
    <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-24">
      <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8">
        <p className="text-meta">Core Philosophy</p>
        <h2 className="text-5xl sm:text-6xl font-serif italic leading-[1.1]">
          The mechanics of trust.
        </h2>
        <p className="text-slate-500 font-sans leading-relaxed max-w-sm">
          A three-pillar approach to digital financing, built on absolute transparency and real-time
          velocity.
        </p>
      </div>

      <div className="lg:col-span-8 space-y-16 sm:space-y-48">
        {[
          {
            num: '01',
            title: 'Real-time Verification',
            desc: 'Using proprietary e-bridge protocols, we verify identity and assets in under 60 seconds. Paperless, friction-less, human-centric.',
            icon: ShieldCheck,
          },
          {
            num: '02',
            title: 'Dynamic Underwriting',
            desc: 'Our algorithms evaluate potential, not just history. We look at the trajectory of your growth to determine liquidity limits.',
            icon: TrendingUp,
          },
          {
            num: '03',
            title: 'Atomic Disbursement',
            desc: 'Once approved, capital moves instantly. Atomic settlement ensures that your ambition is never bottlenecked by legacy banking cycles.',
            icon: Zap,
          },
        ].map((f) => (
          <motion.div
            key={f.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-100px' }}
            className="grid sm:grid-cols-12 gap-10 items-start group"
          >
            <p className="sm:col-span-2 font-serif italic text-6xl sm:text-8xl text-[#EEEEEE] group-hover:text-[#121212] transition-colors duration-700">
              {f.num}
            </p>
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

        <section className="py-24 sm:py-64 px-6 sm:px-10 bg-white border-t border-[#EEEEEE] relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <p className="text-meta text-[#0065FF]">Final Step / Onboarding</p>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif italic leading-[0.9] tracking-tighter text-[#121212]">
                  The capital <br />
                  you deserve, <br />
                  <span className="text-[#EEEEEE] hover:text-[#121212] transition-colors cursor-default">
                    delivered.
                  </span>
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
                className="relative z-10 p-8 sm:p-20 bg-[#F4F5F7] rounded-[2rem] sm:rounded-[3rem] border border-[#EEEEEE] flex flex-col items-center text-center space-y-8 sm:space-y-12"
              >
                <Logo withBackground />

                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic">Begin your journey.</h3>
                  <p className="text-xs font-mono text-[#888888] uppercase tracking-[0.2em]">
                    Institutional Grade / Instant Approval
                  </p>
                </div>

                <Link
                  to="/apply"
                  className="btn-primary w-full h-14 sm:h-16 rounded-xl text-sm sm:text-base group"
                >
                  Apply for Capital
                  <ArrowUpRight
                    size={18}
                    className="ml-3 group-hover:rotate-45 transition-transform"
                  />
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
