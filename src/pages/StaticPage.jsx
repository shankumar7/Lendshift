import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const pageContent = {
  Personal: {
    details: 'Our personal liquidity suite is designed for the modern individual. Whether it is asset-backed lending or high-velocity unsecured capital, we provide the fluidity required to navigate life’s strategic shifts.',
    pillars: [
      { label: 'Fluidity', text: 'Access capital that moves with your lifestyle, not against it.' },
      { label: 'Discretion', text: 'Institutional-grade privacy protocols for all personal transactions.' },
      { label: 'Precision', text: 'Tailored rates based on your unique financial trajectory.' },
    ],
  },
  Enterprise: {
    details: 'Scale without boundaries. LendSwift Enterprise provides the heavy-duty capital infrastructure needed for Series B+ organizations and established corporate entities looking for atomic-speed working capital.',
    pillars: [
      { label: 'Scale', text: 'Limits designed for institutional growth and expansion.' },
      { label: 'Speed', text: 'Atomic settlement ensures your operations never slow down.' },
      { label: 'Strategy', text: 'Dedicated credit lines that evolve with your business model.' },
    ],
  },
  Mortgage: {
    details: 'The estate journey, reimagined. We provide institutional-grade property financing with a focus on high-velocity approval and digital-first documentation protocols.',
    pillars: [
      { label: 'Estate', text: 'Backing for residential, commercial, and mixed-use property.' },
      { label: 'Efficiency', text: 'Paperless closing protocols for the modern homeowner.' },
      { label: 'Stability', text: 'Long-term fixed rates with zero hidden institutional fees.' },
    ],
  },
  Markets: {
    details: 'Navigating secondary liquidity. LendSwift Markets connects institutional lenders with premium credit opportunities through a transparent, high-velocity digital exchange.',
    pillars: [
      { label: 'Liquidity', text: 'Instant secondary market access for credit portfolios.' },
      { label: 'Yield', text: 'Optimized returns through algorithmic risk assessment.' },
      { label: 'Exchange', text: 'Transparent bid/ask protocols for institutional capital.' },
    ],
  },
  About: {
    details: 'LendSwift was founded on the belief that capital should be as fluid as the technology that powers our world. We are architecting a new standard for institutional trust.',
    pillars: [
      { label: 'Origin', text: 'Founded in 2024 to bridge legacy and digital finance.' },
      { label: 'Team', text: 'Led by industry veterans from fintech and traditional banking.' },
      { label: 'Reach', text: 'Global infrastructure with localized compliance engines.' },
    ],
  },
  Vision: {
    details: 'We see a world where financial friction is zero. Our vision is to become the underlying operating system for global institutional liquidity.',
    pillars: [
      { label: 'Atomic', text: 'Instant settlement as the global financial baseline.' },
      { label: 'Universal', text: 'Capital access without geographic or legacy constraints.' },
      { label: 'Fair', text: 'Algorithmic transparency for every global citizen.' },
    ],
  },
  Careers: {
    details: 'Build the architecture of modern liquidity. We are looking for engineers, designers, and strategists who want to redefine how the world moves capital.',
    pillars: [
      { label: 'Growth', text: 'Unlimited trajectory within a high-velocity environment.' },
      { label: 'Impact', text: 'Directly influence the global financial infrastructure.' },
      { label: 'Culture', text: 'Radical transparency and institutional-grade excellence.' },
    ],
  },
  Ethics: {
    details: 'Trust is our primary asset. We operate with radical transparency, ensuring that every algorithmic decision is fair, unbiased, and clearly documented.',
    pillars: [
      { label: 'Privacy', text: 'Zero-knowledge protocols for sensitive financial data.' },
      { label: 'Fairness', text: 'Unbiased underwriting through open-source philosophy.' },
      { label: 'Honor', text: 'Maintaining the highest standards of regulatory compliance.' },
    ],
  },
  Institutional: {
    details: 'Infrastructure for the architects of finance. We provide API-first lending engines for banking partners, credit unions, and sovereign wealth entities.',
    pillars: [
      { label: 'API-First', text: 'Native integration into any legacy or modern core.' },
      { label: 'Security', text: 'Military-grade encryption for institutional transfers.' },
      { label: 'Partner', text: 'Dedicated support for large-scale capital deployment.' },
    ],
  },
  Support: {
    details: 'Always online, always available. Our support ecosystem is designed to provide immediate technical and strategic assistance for all LendSwift partners.',
    pillars: [
      { label: 'Priority', text: '24/7 dedicated channels for institutional clients.' },
      { label: 'Technical', text: 'Deep-dive support for API and integration needs.' },
      { label: 'Success', text: 'Proactive account management for long-term growth.' },
    ],
  },
  'Our Methods': {
    details: 'The mechanics of fluidity. We utilize proprietary e-bridge protocols and atomic settlement engines to move capital at the speed of thought.',
    pillars: [
      { label: 'E-Bridge', text: 'Direct connection to real-time verification sources.' },
      { label: 'Atomic', text: 'Smart-contract powered disbursement for zero lag.' },
      { label: 'Protocol', text: 'Rigorous risk-mitigation layers at every step.' },
    ],
  },
};

const StaticPage = ({ title, description, category }) => {
  const content = pageContent[title] || { details: description, pillars: [] };

  return (
    <div className="min-h-screen bg-white grain-bg font-sans selection:bg-[#121212] selection:text-white flex flex-col">
      <Nav />

      <main className="flex-1 pt-48 pb-32 px-6 sm:px-10">
        <div className="max-w-[1600px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888888] hover:text-[#121212] transition-colors mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-12 gap-24">
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <p className="text-meta text-[#0065FF]">{category} / 2026 Edition</p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl sm:text-8xl font-serif italic leading-none tracking-tighter"
                >
                  {title}
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-10"
              >
                <p className="text-2xl sm:text-3xl text-[#444444] leading-tight font-sans max-w-3xl">
                  {content.details}
                </p>

                <div className="pt-12 border-t border-[#EEEEEE] space-y-8">
                  <div className="grid sm:grid-cols-3 gap-12">
                    {content.pillars.map((pillar) => (
                      <div key={pillar.label} className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#121212]">
                          {pillar.label}
                        </h4>
                        <p className="text-sm text-[#888888] leading-relaxed">{pillar.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-20 space-y-12">
                  <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-serif italic">The LendSwift Standard</h3>
                      <p className="text-[#888888] leading-relaxed">
                        Every {title.toLowerCase()} interaction is governed by our primary liquidity
                        protocol. We ensure that capital is not just available, but strategically
                        aligned with your objectives.
                      </p>
                    </div>
                    <div className="bg-[#121212] p-10 rounded-[2.5rem] text-white flex flex-col justify-between group cursor-pointer hover:bg-[#0065FF] transition-all duration-700">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Operational Flow
                      </p>
                      <h4 className="text-2xl font-serif italic mt-4">
                        Download the {title} Technical Dossier.
                      </h4>
                      <div className="mt-8 flex justify-end">
                        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#0065FF] transition-all">
                          <ArrowLeft className="rotate-[135deg]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <div className="p-10 bg-[#F8F9FA] rounded-[2.5rem] border border-[#EEEEEE] space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif italic">Need assistance?</h3>
                  <p className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                    Connect with an Advisor
                  </p>
                </div>
                <Link
                  to="/apply"
                  className="btn-primary w-full h-14 rounded-xl text-xs uppercase tracking-widest font-black"
                >
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaticPage;
