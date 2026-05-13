import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ChevronRight, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  Scale,
  Zap
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import globalLoanSchema from '../schemas/globalLoanSchema';
import useUnderwriting from '../hooks/useUnderwriting';

const ValidationOrchestrator = () => {
  const { formData, currentStep, setStep } = useLoanStore();
  const underwriting = useUnderwriting();

  const validationIssues = useMemo(() => {
    try {
      globalLoanSchema.parse(formData);
      return [];
    } catch (err) {
      return err.errors.map(error => ({
        path: error.path,
        message: error.message,
        step: error.path[0] === 'loanSelection' ? 1 :
              error.path[0] === 'personalInfo' ? 2 :
              error.path[0] === 'kyc' ? 3 :
              error.path[0] === 'address' ? 4 :
              error.path[0] === 'employment' ? 5 :
              error.path[0] === 'coApplicant' ? 6 : 7
      }));
    }
  }, [formData]);

  if (validationIssues.length === 0 && underwriting.score > 600) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 lg:left-auto lg:right-12 lg:w-96 z-50">
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-[#121212] rounded-[2.5rem] p-8 shadow-2xl border border-white/10 overflow-hidden relative"
        >
          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
          
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0065FF]">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Application Health</h4>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Real-time Orchestration</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                underwriting.score > 700 ? 'border-[#2E7D32] text-[#4CAF50]' : 'border-white/10 text-white/60'
              }`}>
                Score: {underwriting.score}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Scale size={10} className="text-[#0065FF]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">DTI Ratio</span>
                </div>
                <p className="text-sm font-bold text-white">{underwriting.dti}%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={10} className="text-[#FFB300]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Eligibility</span>
                </div>
                <p className="text-sm font-bold text-white">{underwriting.tier}</p>
              </div>
            </div>

            {/* Critical Issues List */}
            {validationIssues.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Action Required ({validationIssues.length})</p>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                  {validationIssues.map((issue, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setStep(issue.step)}
                      className="w-full flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl group hover:bg-red-500/20 transition-all text-left"
                    >
                      <div className="flex gap-3 items-start">
                        <AlertCircle size={14} className="text-red-500 mt-0.5" />
                        <span className="text-[10px] font-bold text-red-100 leading-tight">{issue.message}</span>
                      </div>
                      <ChevronRight size={12} className="text-red-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Progress */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className={underwriting.complianceStatus === 'Full' ? 'text-[#4CAF50]' : 'text-white/20'} />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{underwriting.complianceStatus} Compliance</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-3 h-1 rounded-full ${i <= (underwriting.confidence / 20) ? 'bg-[#0065FF]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }`}</style>
    </div>
  );
};

export default ValidationOrchestrator;
