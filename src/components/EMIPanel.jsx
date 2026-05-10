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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#121212] text-white rounded-[3rem] p-12 flex flex-col gap-12 relative overflow-hidden shadow-2xl"
    >
      {/* Dynamic Background Light */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0065FF] opacity-[0.07] blur-[100px] pointer-events-none" />
      
      {/* Top Header Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Estimated Installment</p>
          <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF] shadow-[0_0_10px_#0065FF]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-tight">{annualRate}%</span>
              <span className="text-[8px] font-mono text-white/40 uppercase">APR Rate</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-6xl sm:text-7xl font-serif italic tracking-tighter">
            <AnimatedNumber value={calculation.emi} />
          </h3>
          <span className="text-lg font-serif italic text-white/20">/ mo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-10 py-10 border-y border-white/5">
        <div className="space-y-2">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
            <TrendingUp size={12} className="text-white/20" />
            Interest Cost
          </p>
          <p className="text-2xl font-medium tracking-tight">
            <AnimatedNumber value={calculation.totalInterest} />
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
            <Calendar size={12} className="text-white/20" />
            Total Tenure
          </p>
          <p className="text-2xl font-medium tracking-tight">
            {tenure} <span className="text-sm text-white/20 font-serif italic">Months</span>
          </p>
        </div>
      </div>

      {/* Summary Footer Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
             <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Repayment</p>
             <p className="text-2xl font-bold tracking-tighter"><AnimatedNumber value={calculation.totalRepayment} /></p>
           </div>
           <div className="text-right space-y-1">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Principal Ratio</p>
              <p className="text-xs font-bold text-white/60">{Math.round((amount / calculation.totalRepayment) * 100)}%</p>
           </div>
        </div>
        
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(amount / calculation.totalRepayment) * 100}%` }}
             className="h-full bg-white/40 rounded-full"
           />
        </div>

        <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
          <Info size={14} className="text-white/20 mt-0.5 shrink-0" />
          <p className="text-[10px] text-white/40 font-mono leading-relaxed italic">
            Calculations are indicative based on standard institutional rates. Final APR and EMI subject to credit assessment and underwriting.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EMIPanel;
