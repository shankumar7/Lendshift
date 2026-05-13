import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Building2, AlertCircle } from 'lucide-react';
import loanSelectionSchema from '../schemas/loanSelectionSchema';
import useLoanStore from '../store/useLoanStore';
import EMIPanel from '../components/EMIPanel';

const ErrorField = ({ error, touched }) => (
  <AnimatePresence mode="wait">
    {error && touched && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="flex items-center gap-1.5 mt-2 text-red-500"
      >
        <AlertCircle size={10} />
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest">{error.message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

const LoanTypeCard = ({ icon: Icon, title, desc, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-700 text-left flex flex-col gap-6 sm:gap-8 group ${
      selected
        ? 'border-[#121212] bg-[#121212] text-white shadow-2xl shadow-black/10'
        : 'border-[#EEEEEE] bg-white hover:border-[#121212]/20'
    }`}
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        selected
          ? 'bg-white/10 text-white'
          : 'bg-[#F8F9FA] text-[#121212]/40 group-hover:text-[#121212]'
      }`}
    >
      <Icon size={20} strokeWidth={1.5} />
    </div>

    <div className="space-y-3">
      <h3
        className={`text-2xl sm:text-3xl font-serif italic leading-none transition-colors ${selected ? 'text-white' : 'text-[#121212]'}`}
      >
        {title}
      </h3>
      <p
        className={`text-[10px] font-mono uppercase tracking-[0.15em] leading-relaxed transition-colors ${
          selected ? 'text-white/40' : 'text-[#888888]'
        }`}
      >
        {desc}
      </p>
    </div>

    {selected && (
      <motion.div layoutId="selection-dot" className="absolute top-8 right-8">
        <div className="w-2 h-2 rounded-full bg-[#0065FF] shadow-[0_0_15px_#0065FF]" />
      </motion.div>
    )}
  </button>
);

const LoanSelectionStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();

  // Defensive defaults to handle stale localStorage from previous versions
  const safeDefaults = {
    loanType: 'personal',
    amount: 500000,
    tenure: 12,
    purpose: '',
    employmentType: '',
    monthlyIncome: 50000,
    ...formData.loanSelection,
  };

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(loanSelectionSchema),
    defaultValues: safeDefaults,
    mode: 'onBlur',
  });

  // AUTO-SAVE LOGIC: Sync form values to global store on change
  const allValues = useWatch({ control });
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('loanSelection', allValues);
    }, 1000);
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  const selectedLoanType = useWatch({ control, name: 'loanType' });
  const amount = useWatch({ control, name: 'amount' });
  const tenure = useWatch({ control, name: 'tenure' });

  // Purpose options based on loan type
  const purposeOptions = {
    personal: ['Medical', 'Travel', 'Education', 'Wedding', 'Other'],
    home: ['Purchase of Plot', 'Home Construction', 'Renovation', 'Refinance'],
    business: ['Working Capital', 'Expansion', 'Machinery', 'Inventory'],
  };

  const getMaxAmount = () => {
    if (selectedLoanType === 'home') return 50000000;
    if (selectedLoanType === 'business') return 7500000;
    return 2500000;
  };

  const getMaxTenure = () => {
    if (selectedLoanType === 'home') return 360;
    if (selectedLoanType === 'business') return 120;
    return 60;
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
                title="Personal"
                desc="Flexible liquidity for lifestyle & emergencies."
                icon={User}
                selected={field.value === 'personal'}
                onClick={() => field.onChange('personal')}
              />
              <LoanTypeCard
                title="Mortgage"
                desc="Institutional backing for your estate journey."
                icon={Home}
                selected={field.value === 'home'}
                onClick={() => field.onChange('home')}
              />
              <LoanTypeCard
                title="Enterprise"
                desc="Accelerate growth with strategic capital."
                icon={Building2}
                selected={field.value === 'business'}
                onClick={() => field.onChange('business')}
              />
            </div>
          )}
        />
        <ErrorField error={errors.loanType} touched={touchedFields.loanType || isSubmitted} />
      </div>

      {/* 2. Main Configuration Grid */}
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-16">
          {/* Amount Input */}
          <div className="space-y-6">
            <label htmlFor="amount-slider" className="block space-y-6 cursor-pointer">
              <div className="flex justify-between items-end">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Loan Amount</span>
                <div className="text-xl sm:text-2xl font-serif italic text-[#121212]">
                  ₹{(amount || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <input
                      id="amount-slider"
                      type="range"
                      min={selectedLoanType === 'home' ? 500000 : 50000}
                      max={getMaxAmount()}
                      step={10000}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full h-2 bg-[#EEEEEE] rounded-lg appearance-none cursor-pointer accent-[#121212]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                      <span>Min ₹50K</span>
                      <span>Max ₹5Cr</span>
                    </div>
                  </div>
                )}
              />
            </label>
            <ErrorField error={errors.amount} touched={touchedFields.amount || isSubmitted} />
          </div>

          {/* Tenure Slider */}
          <div className="space-y-6">
            <label htmlFor="tenure-slider" className="block space-y-6 cursor-pointer">
              <div className="flex justify-between items-end">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Tenure</span>
                <div className="text-xl sm:text-2xl font-serif italic text-[#121212]">
                  {tenure}{' '}
                  <span className="text-[10px] sm:text-xs font-sans not-italic text-[#888888]">Months</span>
                </div>
              </div>

              <Controller
                name="tenure"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <input
                      id="tenure-slider"
                      type="range"
                      min={6}
                      max={getMaxTenure()}
                      step={6}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full h-2 bg-[#EEEEEE] rounded-lg appearance-none cursor-pointer accent-[#121212]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                      <span>6 Months</span>
                      <span>30 Years</span>
                    </div>
                  </div>
                )}
              />
            </label>
            <ErrorField error={errors.tenure} touched={touchedFields.tenure || isSubmitted} />
          </div>

          {/* Stacked Configuration Fields */}
          <div className="space-y-12">
            {/* Purpose */}
            <div className="space-y-3">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="loan-purpose" className="block space-y-3 cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/60">
                  Loan Purpose
                </span>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        id="loan-purpose"
                        className="w-full h-16 bg-white border border-[#EEEEEE] rounded-[1.25rem] px-6 text-sm focus:border-[#121212] outline-none transition-all appearance-none cursor-pointer hover:bg-[#FAFAFA]"
                      >
                        <option value="">Select Purpose</option>
                        {selectedLoanType &&
                          purposeOptions[selectedLoanType] &&
                          purposeOptions[selectedLoanType].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                />
              </label>
              <ErrorField error={errors.purpose} touched={touchedFields.purpose || isSubmitted} />
            </div>

            {/* Employment */}
            <div className="space-y-3">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="employment-type" className="block space-y-3 cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/60">
                  Employment Status
                </span>
                <Controller
                  name="employmentType"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        id="employment-type"
                        className="w-full h-16 bg-white border border-[#EEEEEE] rounded-[1.25rem] px-6 text-sm focus:border-[#121212] outline-none transition-all appearance-none cursor-pointer hover:bg-[#FAFAFA]"
                      >
                        <option value="">Select Type</option>
                        <option value="salaried">Salaried Professional</option>
                        <option value="self-employed">Self Employed</option>
                        <option value="business-owner">Enterprise Owner</option>
                      </select>
                    </div>
                  )}
                />
              </label>
              <ErrorField
                error={errors.employmentType}
                touched={touchedFields.employmentType || isSubmitted}
              />
            </div>

            {/* Monthly Income */}
            <div className="space-y-3">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="monthly-income" className="block space-y-3 cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/60">
                  Net Monthly Income
                </span>
                <Controller
                  name="monthlyIncome"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#121212]/20 font-serif italic text-xl">
                        ₹
                      </span>
                      <input
                        id="monthly-income"
                        type="number"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? 0 : Number(val));
                        }}
                        placeholder="0"
                        className="w-full h-20 bg-white border border-[#EEEEEE] rounded-[1.25rem] pl-12 pr-6 text-2xl font-serif italic text-[#121212] focus:border-[#121212] outline-none transition-all placeholder:text-[#EEEEEE]"
                      />
                    </div>
                  )}
                />
              </label>
              <ErrorField
                error={errors.monthlyIncome}
                touched={touchedFields.monthlyIncome || isSubmitted}
              />
            </div>
          </div>
        </div>

        {/* EMI PREVIEW */}
        <div className="sticky top-32">
          <EMIPanel amount={amount} tenure={tenure} loanType={selectedLoanType} />
        </div>
      </div>

      {/* Navigation - Controlled by parent for shell consistency but we trigger handleSubmit here */}
      <div className="hidden">
        <button type="submit" id="wizard-submit-btn">
          Submit
        </button>
      </div>
    </form>
  );
};

export default LoanSelectionStep;
