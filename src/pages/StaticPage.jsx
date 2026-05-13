import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const StaticPage = ({ title, description, category }) => {
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
                  {description}
                </p>
                
                <div className="pt-12 border-t border-[#EEEEEE] space-y-8">
                  <div className="grid sm:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#121212]">Institutional Grade</h4>
                      <p className="text-sm text-[#888888] leading-relaxed">
                        LendSwift applies rigorous verification protocols to every {title.toLowerCase()} interaction, ensuring absolute security and regulatory compliance.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#121212]">Real-time Velocity</h4>
                      <p className="text-sm text-[#888888] leading-relaxed">
                        Our atomic settlement engine ensures that {title.toLowerCase()} processes move at the speed of modern digital commerce.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <div className="p-10 bg-[#F8F9FA] rounded-[2.5rem] border border-[#EEEEEE] space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif italic">Need assistance?</h3>
                  <p className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">Connect with an Advisor</p>
                </div>
                <Link to="/apply" className="btn-primary w-full h-14 rounded-xl text-xs uppercase tracking-widest font-black">
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
