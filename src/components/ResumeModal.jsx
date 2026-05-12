import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Clock } from 'lucide-react';

const ResumeModal = ({ isOpen, onResume, onReset, lastSavedTime }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#121212]/40 backdrop-blur-sm"
            onClick={onReset}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl border border-[#EEEEEE] overflow-hidden"
          >
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center border border-[#EEEEEE]">
                  <Clock className="text-[#0065FF]" size={24} />
                </div>
                <h2 className="text-4xl font-serif italic tracking-tight">Resume Application?</h2>
                <p className="text-[#888888] leading-relaxed">
                  We found an incomplete application from{' '}
                  <strong>{new Date(lastSavedTime).toLocaleString()}</strong>. Would you like to
                  continue where you left off?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center justify-center gap-3 py-5 px-6 rounded-2xl border border-[#EEEEEE] hover:bg-[#FAFAFA] transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <RotateCcw size={16} />
                  Start Fresh
                </button>
                <button
                  type="button"
                  onClick={onResume}
                  className="flex items-center justify-center gap-3 py-5 px-6 rounded-2xl bg-[#121212] text-white hover:bg-black transition-all font-bold text-xs uppercase tracking-widest"
                >
                  <Play size={16} />
                  Resume Now
                </button>
              </div>
            </div>

            {/* Decorative background mark */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
              <h1 className="text-[10rem] font-serif italic">Swift</h1>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
