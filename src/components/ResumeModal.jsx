import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Sparkles, X, ArrowRight } from 'lucide-react';
import useLoanStore from '../store/useLoanStore';

const ResumeModal = () => {
  const {
    isResumeModalOpen,
    setResumeModal,
    resetApplication,
    setInitialized,
    lastSaved,
    currentStep,
  } = useLoanStore();
  const modalRef = useRef();
  const resumeBtnRef = useRef();

  useEffect(() => {
    if (isResumeModalOpen) {
      resumeBtnRef.current?.focus();
    }
  }, [isResumeModalOpen]);

  const handleStartFresh = () => {
    resetApplication();
    setInitialized(true);
    setResumeModal(false);
  };

  const handleResume = () => {
    setInitialized(true);
    setResumeModal(false);
  };

  if (!isResumeModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white/80 backdrop-blur-xl"
      role="presentation"
    >
      <div
        className="fixed inset-0"
        onClick={() => setResumeModal(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setResumeModal(false);
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal background"
      />
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setResumeModal(false);
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="max-w-lg w-full bg-[#121212] rounded-[3rem] p-10 shadow-2xl border border-white/10 relative overflow-hidden text-white"
      >
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />

        <div className="relative space-y-8">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0065FF]">
              <History size={28} />
            </div>
            <button
              type="button"
              onClick={() => setResumeModal(false)}
              className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <h2 id="resume-title" className="text-3xl font-serif italic tracking-tight">
              Resume Application?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              We found an incomplete session from{' '}
              <span className="text-white font-mono">{new Date(lastSaved).toLocaleString()}</span>.
              You were at <span className="text-[#0065FF] font-bold">Step {currentStep}</span>.
              Would you like to continue or start fresh?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button
              type="button"
              ref={resumeBtnRef}
              onClick={handleResume}
              className="group h-16 rounded-2xl bg-white text-[#121212] text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-8 hover:scale-[1.02] transition-all"
            >
              <span>Continue Application</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              type="button"
              onClick={handleStartFresh}
              className="h-16 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
            >
              <Sparkles size={16} />
              <span>Start New Application</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeModal;
