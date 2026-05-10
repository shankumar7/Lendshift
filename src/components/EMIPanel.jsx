import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

const AnimatedNumber = ({ value, prefix = "₹" }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    let end = value;
    if (start === end) return;

    let duration = 500;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString('en-IN')}
    </span>
  );
};

const EMIPanel = ({ amount, tenure, loanType }) => {
  // Mock interest rates
  const rateMap = {
    personal: 10.5,
    home: 8.5,
    business: 12.0
  };

  const annualRate = rateMap[loanType] || 10.5;
  const monthlyRate = annualRate / 12 / 100;

  const calculation = useMemo(() => {
    const p = amount || 0;
    const r = monthlyRate;
    const n = tenure || 1;
    
    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) || 0;
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - p;

    return { emi, totalInterest, totalRepayment };
  }, [amount, monthlyRate, tenure]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#121212] text-white rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden shadow-2xl"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Estimated Installment</p>
          <h3 className="text-4xl sm:text-5xl font-serif italic tracking-tighter">
            <AnimatedNumber value={calculation.emi} />
            <span className="text-sm font-sans font-normal text-white/30 ml-2 not-italic">/ mo</span>
          </h3>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/60">{annualRate}% APR</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp size={10} />
            Interest Cost
          </p>
          <p className="text-lg font-medium"><AnimatedNumber value={calculation.totalInterest} /></p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={10} />
            Total Tenure
          </p>
          <p className="text-lg font-medium">{tenure} <span className="text-xs text-white/40">Months</span></p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
           <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Repayment</p>
           <p className="text-sm font-bold"><AnimatedNumber value={calculation.totalRepayment} /></p>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(amount / calculation.totalRepayment) * 100}%` }}
             className="h-full bg-white/20"
           />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-white/30 font-mono italic">
        <Info size={12} />
        <span>Calculations are indicative based on standard institutional rates.</span>
      </div>
    </motion.div>
  );
};

export default EMIPanel;
