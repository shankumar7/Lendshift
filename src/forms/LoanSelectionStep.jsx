import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Home, 
  User, 
  Building2, 
  BadgeCheck, 
  CircleDollarSign,
  Info
} from 'lucide-react';
import { loanSelectionSchema } from '../schemas/loanSelectionSchema';
import useLoanStore from '../store/useLoanStore';
import EMIPanel from '../components/EMIPanel';

const LoanTypeCard = ({ type, icon: Icon, title, desc, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative p-8 rounded-[2.5rem] border transition-all duration-700 text-left flex flex-col gap-8 group ${
      selected 
        ? 'border-[#121212] bg-[#121212] text-white shadow-2xl shadow-black/10' 
        : 'border-[#EEEEEE] bg-white hover:border-[#121212]/20'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
      selected ? 'bg-white/10 text-white' : 'bg-[#F8F9FA] text-[#121212]/40 group-hover:text-[#121212]'
    }`}>
      <Icon size={20} strokeWidth={1.5} />
    </div>
    
    <div className="space-y-3">
      <h3 className={`text-3xl font-serif italic leading-none transition-colors ${selected ? 'text-white' : 'text-[#121212]'}`}>
        {title}
      </h3>
      <p className={`text-[10px] font-mono uppercase tracking-[0.15em] leading-relaxed transition-colors ${
        selected ? 'text-white/40' : 'text-[#888888]'
      }`}>
        {desc}
      </p>
    </div>

    {selected && (
      <motion.div 
        layoutId="selection-dot"
        className="absolute top-8 right-8"
      >
        <div className="w-2 h-2 rounded-full bg-[#0065FF] shadow-[0_0_15px_#0065FF]" />
      </motion.div>
    )}
  </button>
);

const LoanSelectionStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  
  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(loanSelectionSchema),
    defaultValues: formData.loanSelection,
    mode: 'onBlur'
  });

  const selectedLoanType = watch('loanType');
  const amount = watch('amount');
  const tenure = watch('tenure');

  // Purpose options based on loan type
  const purposeOptions = {
    personal: ['Medical', 'Travel', 'Education', 'Wedding', 'Other'],
    home: ['Purchase of Plot', 'Home Construction', 'Renovation', 'Refinance'],
    business: ['Working Capital', 'Expansion', 'Machinery', 'Inventory']
  };

  const onSubmit = (data) => {
    updateFormData('loanSelection', data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
      {/* 1. Loan Type Selection */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-1 h-1 rounded-full bg-[#0065FF]" />
           <p className="text-xs font-black uppercase tracking-widest">Select Capital Program</p>
        </div>
        
        <Controller
          name="loanType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LoanTypeCard
                type="personal"
                title="Personal"
                desc="Flexible liquidity for lifestyle & emergencies."
                icon={User}
                selected={field.value === 'personal'}
                onClick={() => field.onChange('personal')}
              />
              <LoanTypeCard
                type="home"
                title="Property"
                desc="Institutional backing for your estate journey."
                icon={Home}
                selected={field.value === 'home'}
                onClick={() => field.onChange('home')}
              />
              <LoanTypeCard
                type="business"
                title="Enterprise"
                desc="Accelerate growth with strategic capital."
                icon={Building2}
                selected={field.value === 'business'}
                onClick={() => field.onChange('business')}
              />
            </div>
          )}
        />
        {errors.loanType && <p className="text-xs text-red-500 font-mono italic">{errors.loanType.message}</p>}
      </div>

      {/* 2. Amount & Tenure Configuration */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
          {/* Amount Input */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <label className="text-xs font-black uppercase tracking-widest">Loan Amount</label>
               <div className="text-2xl font-serif italic text-[#121212]">
                 ₹{(amount || 0).toLocaleString('en-IN')}
               </div>
            </div>
            
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={selectedLoanType === 'home' ? 500000 : 50000}
                    max={selectedLoanType === 'home' ? 50000000 : (selectedLoanType === 'business' ? 7500000 : 2500000)}
                    step={10000}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#EEEEEE] rounded-lg appearance-none cursor-pointer accent-[#121212]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                    <span>Min ₹50K</span>
                    <span>Max ₹5Cr</span>
                  </div>
                </div>
              )}
            />
            {errors.amount && <p className="text-xs text-red-500 font-mono italic">{errors.amount.message}</p>}
          </div>

          {/* Tenure Slider */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
               <label className="text-xs font-black uppercase tracking-widest">Tenure</label>
               <div className="text-2xl font-serif italic text-[#121212]">
                 {tenure} <span className="text-xs font-sans not-italic text-[#888888]">Months</span>
               </div>
            </div>
            
            <Controller
              name="tenure"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={6}
                    max={selectedLoanType === 'home' ? 360 : (selectedLoanType === 'business' ? 120 : 60)}
                    step={6}
                    value={field.value}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#EEEEEE] rounded-lg appearance-none cursor-pointer accent-[#121212]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                    <span>6 Months</span>
                    <span>30 Years</span>
                  </div>
                </div>
              )}
            />
            {errors.tenure && <p className="text-xs text-red-500 font-mono italic">{errors.tenure.message}</p>}
          </div>
        </div>

        {/* EMI PREVIEW */}
        <EMIPanel amount={amount} tenure={tenure} loanType={selectedLoanType} />
      </div>

      {/* 3. Purpose & Income */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest">Purpose</label>
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full h-14 bg-white border border-[#EEEEEE] rounded-xl px-4 text-sm focus:border-[#0065FF] outline-none transition-all">
                <option value="">Select Purpose</option>
                {selectedLoanType && purposeOptions[selectedLoanType].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          />
          {errors.purpose && <p className="text-xs text-red-500 font-mono italic">{errors.purpose.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest">Employment</label>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full h-14 bg-white border border-[#EEEEEE] rounded-xl px-4 text-sm focus:border-[#0065FF] outline-none transition-all">
                <option value="">Select Type</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business-owner">Business Owner</option>
              </select>
            )}
          />
          {errors.employmentType && <p className="text-xs text-red-500 font-mono italic">{errors.employmentType.message}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest">Monthly Income</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-mono text-xs">₹</span>
            <Controller
              name="monthlyIncome"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder="0.00"
                  className="w-full h-14 bg-white border border-[#EEEEEE] rounded-xl pl-8 pr-4 text-sm focus:border-[#0065FF] outline-none transition-all"
                />
              )}
            />
          </div>
          {errors.monthlyIncome && <p className="text-xs text-red-500 font-mono italic">{errors.monthlyIncome.message}</p>}
        </div>
      </div>

      {/* Navigation - Controlled by parent for shell consistency but we trigger handleSubmit here */}
      <div className="hidden">
        <button type="submit" id="wizard-submit-btn">Submit</button>
      </div>
    </form>
  );
};

export default LoanSelectionStep;
