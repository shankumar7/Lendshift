import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Download, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-white grain-bg font-sans flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center pt-24 sm:pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#F8F9FA] rounded-full border border-[#EEEEEE]"
              >
                <div className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]">
                  APPLICATION SECURED
                </span>
              </motion.div>
              <h1 className="text-4xl sm:text-7xl font-serif italic leading-[1.1] sm:leading-tight tracking-tighter">
                Capital is on <br />
                the way.
              </h1>
              <p className="text-xl text-[#888888] leading-relaxed max-w-md">
                Your application **#LS-9402** has been successfully transmitted to our institutional
                underwriting engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 sm:p-8 bg-[#F8F9FA] rounded-[1.5rem] sm:rounded-[2rem] border border-[#EEEEEE] space-y-4">
                <ShieldCheck size={20} sm:size={24} className="text-[#121212]" />
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                    Security Layer
                  </p>
                  <p className="text-sm font-black">ISO 27001 Verified</p>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-[#F8F9FA] rounded-[1.5rem] sm:rounded-[2rem] border border-[#EEEEEE] space-y-4">
                <Globe size={20} sm:size={24} className="text-[#121212]" />
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                    Network Status
                  </p>
                  <p className="text-sm font-black">Atomic Settlement</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/" className="btn-primary flex-1 h-16 rounded-xl group">
                Back to Dashboard
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button type="button" className="btn-secondary flex-1 h-16 rounded-xl gap-2">
                <Download size={18} />
                Technical Summary
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 p-10 sm:p-20 bg-[#121212] rounded-[2rem] sm:rounded-[3rem] text-white flex flex-col items-center text-center space-y-8"
              >
                <div className="w-20 h-20 bg-[#0065FF] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic">Success.</h3>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                    Institutional Grade Approval
                  </p>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    Reference ID
                  </p>
                  <p className="text-xl font-mono tracking-tighter">LS-9402-8472-X</p>
                </div>
              </motion.div>
              <div className="absolute top-6 left-6 w-full h-full bg-[#F4F5F7] rounded-[3rem] -z-10 border border-[#EEEEEE]" />
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;
