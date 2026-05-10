import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          
          {/* Confetti simulation with motion elements can be added here */}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black font-display dark:text-white">Application Submitted!</h1>
          <p className="text-slate-500 leading-relaxed">
            Congratulations! Your loan application **#LS-9402** has been successfully received. Our team will review your documents and get back to you within 24 hours.
          </p>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Application ID</span>
            <span className="text-sm font-black dark:text-white">LS-94028472</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Approval</span>
            <span className="text-sm font-black text-emerald-600 italic">Within 24 Hours</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 btn-secondary h-14 rounded-2xl flex items-center justify-center gap-2 font-bold border-2">
            <Download size={18} />
            Download Summary
          </button>
          <Link to="/" className="flex-1 btn-primary h-14 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-primary-600/20">
            Back to Home
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="pt-8 flex justify-center gap-6 text-slate-400">
          <button className="hover:text-primary-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Share2 size={16} />
            Share Status
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
