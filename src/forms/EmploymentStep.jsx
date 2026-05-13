import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Gem,
  Coffee,
  Heart,
  TrendingUp,
  ShieldCheck,
  Banknote,
  PieChart,
  Target,
  FileCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import employmentSchema from '../schemas/employmentSchema';

const InputWrapper = ({ label, children, error, touched, icon: Icon, description }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={12} className="text-[#888888]" />}
        <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
          {label}
        </label>
      </div>
      {description && (
        <span className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
          {description}
        </span>
      )}
    </div>
    {children}
    {touched && error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest"
      >
        {error.message}
      </motion.p>
    )}
  </div>
);

const UnderwritingMetric = ({ label, value, subtext, status = 'neutral' }) => {
  const getStatusColor = () => {
    if (status === 'success') return 'text-[#2E7D32] bg-[#E8F5E9]';
    if (status === 'warning') return 'text-[#FF8F00] bg-[#FFF8E1]';
    if (status === 'danger') return 'text-[#C62828] bg-[#FFEBEE]';
    return 'text-[#121212] bg-[#F8F9FA]';
  };

  return (
    <div className={`p-6 rounded-2xl border border-[#EEEEEE] ${getStatusColor()} transition-colors duration-500`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</p>
        <ArrowUpRight size={14} className="opacity-40" />
      </div>
      <p className="text-2xl font-serif italic">{value}</p>
      <p className="text-[9px] font-mono font-bold uppercase tracking-widest mt-2 opacity-60">
        {subtext}
      </p>
    </div>
  );
};

const EmploymentStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const [isIfscVerifying, setIsIfscVerifying] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);

  // Read employment type from Step 1/2 data
  const initialEmploymentType = formData.loanSelection.employmentType || 'salaried';

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      ...formData.employment,
      type: initialEmploymentType,
    },
    mode: 'onBlur',
  });

  const employmentType = useWatch({ control, name: 'type' });
  const monthlyIncome = useWatch({ control, name: 'monthlyIncome' }) || 0;
  const annualTurnover = useWatch({ control, name: 'annualTurnover' }) || 0;
  const annualRevenue = useWatch({ control, name: 'annualRevenue' }) || 0;
  const pensionAmount = useWatch({ control, name: 'pensionAmount' }) || 0;
  const monthlyObligations = useWatch({ control, name: 'monthlyObligations' }) || 0;
  const ifsc = useWatch({ control, name: 'ifscCode' });

  // AUTO-SAVE LOGIC
  const allValues = watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('employment', allValues);
    }, 1000);
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  // Underwriting Calculations
  const metrics = useMemo(() => {
    let income = monthlyIncome;
    if (employmentType === 'business') income = annualTurnover / 12;
    if (employmentType === 'self-employed') income = annualRevenue / 12;
    if (employmentType === 'retired') income = pensionAmount;

    const dti = income > 0 ? (monthlyObligations / income) * 100 : 0;
    const disposable = income - monthlyObligations;
    
    let eligibility = disposable * 48; // Simple 4-year multiplier
    if (dti > 50) eligibility *= 0.5;
    if (dti > 70) eligibility = 0;

    const score = Math.max(300, Math.min(900, 450 + (income / 1000) - (dti * 5)));

    return {
      income,
      dti: dti.toFixed(1),
      eligibility: Math.round(eligibility / 1000) * 1000,
      score: Math.round(score),
      risk: dti < 30 ? 'Low' : dti < 50 ? 'Moderate' : 'High',
      riskStatus: dti < 30 ? 'success' : dti < 50 ? 'warning' : 'danger'
    };
  }, [monthlyIncome, annualTurnover, annualRevenue, pensionAmount, monthlyObligations, employmentType]);

  // IFSC Mock Lookup
  useEffect(() => {
    if (ifsc?.length === 11) {
      setIsIfscVerifying(true);
      setTimeout(() => {
        setBankInfo({
          name: 'HDFC BANK LIMITED',
          branch: 'CENTRAL AVENUE, MUMBAI',
          city: 'MUMBAI',
          state: 'MAHARASHTRA'
        });
        setValue('bankName', 'HDFC BANK LIMITED');
        setIsIfscVerifying(false);
      }, 1500);
    } else {
      setBankInfo(null);
    }
  }, [ifsc, setValue]);

  const onSubmit = (data) => {
    updateFormData('employment', data);
    onNext();
  };

  const getDynamicDocs = () => {
    switch (employmentType) {
      case 'salaried': return ['3 Months Salary Slips', '6 Months Bank Statement', 'Form 16 / ITR'];
      case 'business': return ['GST Returns (1 Year)', 'Business PAN Card', 'Audit Reports'];
      case 'self-employed': return ['Practice License', 'ITR (2 Years)', 'Bank Statements'];
      case 'freelancer': return ['Client Invoices', 'Payment Gateway Statements', 'Portfolio/Platform Profile'];
      case 'retired': return ['Pension Payment Order', 'Retirement Letter', 'Bank Statements'];
      default: return [];
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-12">
        {/* Employment Type Header (Read Only) */}
        <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-[#121212] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center">
              {employmentType === 'salaried' && <Building2 size={20} sm:size={24} />}
              {employmentType === 'business' && <Gem size={20} sm:size={24} />}
              {employmentType === 'self-employed' && <TrendingUp size={20} sm:size={24} />}
              {employmentType === 'freelancer' && <Coffee size={20} sm:size={24} />}
              {employmentType === 'retired' && <Heart size={20} sm:size={24} />}
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40">Verified Profile</p>
              <h3 className="text-xl sm:text-2xl font-serif italic capitalize">{employmentType} Underwriting</h3>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0065FF]">Financial Category</p>
            <p className="text-xs font-mono opacity-60">CAT-A Approved</p>
          </div>
        </div>

        {/* Dynamic Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {employmentType === 'salaried' && (
            <>
              <InputWrapper label="Company Name" error={errors.employerName} touched={touchedFields.employerName || isSubmitted}>
                <Controller name="employerName" control={control} render={({ field }) => <input {...field} placeholder="e.g. Google India Pvt Ltd" className="input-premium" />} />
              </InputWrapper>
              <InputWrapper label="Designation" error={errors.designation} touched={touchedFields.designation || isSubmitted}>
                <Controller name="designation" control={control} render={({ field }) => <input {...field} placeholder="e.g. Senior Software Engineer" className="input-premium" />} />
              </InputWrapper>
              <InputWrapper label="Industry Type" error={errors.industryType} touched={touchedFields.industryType || isSubmitted}>
                <Controller name="industryType" control={control} render={({ field }) => (
                  <select {...field} className="input-premium">
                    <option value="">Select Industry</option>
                    <option value="it">Information Technology</option>
                    <option value="banking">Banking & Finance</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                )} />
              </InputWrapper>
              <InputWrapper label="Monthly Net Salary" error={errors.monthlyIncome} touched={touchedFields.monthlyIncome || isSubmitted}>
                <Controller name="monthlyIncome" control={control} render={({ field }) => (
                  <input
                    type="number"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="₹ 0.00"
                    className="input-premium font-mono"
                  />
                )} />
              </InputWrapper>
              <InputWrapper label="Work Experience" description="Total Years" error={errors.workExp} touched={touchedFields.workExp || isSubmitted}>
                <Controller name="workExp" control={control} render={({ field }) => <input {...field} placeholder="e.g. 5 Years" className="input-premium" />} />
              </InputWrapper>
              <InputWrapper label="Salary Credit Date" error={errors.salaryCreditDate} touched={touchedFields.salaryCreditDate || isSubmitted}>
                <Controller name="salaryCreditDate" control={control} render={({ field }) => <input {...field} type="date" className="input-premium" />} />
              </InputWrapper>
            </>
          )}

          {employmentType === 'business' && (
            <>
              <InputWrapper label="Business Name" error={errors.businessName} touched={touchedFields.businessName || isSubmitted}>
                <Controller name="businessName" control={control} render={({ field }) => <input {...field} placeholder="Legal Business Name" className="input-premium" />} />
              </InputWrapper>
              <InputWrapper label="GST Number" error={errors.gstNumber} touched={touchedFields.gstNumber || isSubmitted}>
                <Controller name="gstNumber" control={control} render={({ field }) => <input {...field} placeholder="22AAAAA0000A1Z5" className="input-premium font-mono uppercase" />} />
              </InputWrapper>
              <InputWrapper label="Annual Turnover" error={errors.annualTurnover} touched={touchedFields.annualTurnover || isSubmitted}>
                <Controller name="annualTurnover" control={control} render={({ field }) => (
                  <input
                    type="number"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="Annual Business Turnover"
                    className="input-premium"
                  />
                )} />
              </InputWrapper>
              <InputWrapper label="Years in Operation" error={errors.yearsInOperation} touched={touchedFields.yearsInOperation || isSubmitted}>
                <Controller name="yearsInOperation" control={control} render={({ field }) => <input {...field} placeholder="e.g. 10 Years" className="input-premium" />} />
              </InputWrapper>
            </>
          )}

          {employmentType === 'self-employed' && (
            <>
              <InputWrapper label="Profession Type" error={errors.professionType} touched={touchedFields.professionType || isSubmitted}>
                <Controller name="professionType" control={control} render={({ field }) => (
                  <select {...field} className="input-premium">
                    <option value="">Select Profession</option>
                    <option value="doctor">Doctor</option>
                    <option value="ca">Chartered Accountant</option>
                    <option value="architect">Architect</option>
                    <option value="consultant">Consultant</option>
                  </select>
                )} />
              </InputWrapper>
              <InputWrapper label="Annual Revenue" error={errors.annualRevenue} touched={touchedFields.annualRevenue || isSubmitted}>
                <Controller name="annualRevenue" control={control} render={({ field }) => (
                  <input
                    type="number"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="Annual Revenue"
                    className="input-premium"
                  />
                )} />
              </InputWrapper>
              <InputWrapper label="Years in Practice" error={errors.yearsInPractice} touched={touchedFields.yearsInPractice || isSubmitted}>
                <Controller name="yearsInPractice" control={control} render={({ field }) => <input {...field} placeholder="Total Practice Years" className="input-premium" />} />
              </InputWrapper>
            </>
          )}

          {employmentType === 'freelancer' && (
            <>
              <InputWrapper label="Primary Skill" error={errors.primarySkill} touched={touchedFields.primarySkill || isSubmitted}>
                <Controller name="primarySkill" control={control} render={({ field }) => <input {...field} placeholder="e.g. UI/UX Design" className="input-premium" />} />
              </InputWrapper>
              <InputWrapper label="Monthly Average Income" error={errors.monthlyIncome} touched={touchedFields.monthlyIncome || isSubmitted}>
                <Controller name="monthlyIncome" control={control} render={({ field }) => (
                  <input
                    type="number"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="Average Monthly Income"
                    className="input-premium"
                  />
                )} />
              </InputWrapper>
            </>
          )}

          {employmentType === 'retired' && (
            <>
              <InputWrapper label="Monthly Pension" error={errors.pensionAmount} touched={touchedFields.pensionAmount || isSubmitted}>
                <Controller name="pensionAmount" control={control} render={({ field }) => (
                  <input
                    type="number"
                    value={field.value === 0 ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="Monthly Pension Amount"
                    className="input-premium"
                  />
                )} />
              </InputWrapper>
              <InputWrapper label="Retirement Year" error={errors.retirementYear} touched={touchedFields.retirementYear || isSubmitted}>
                <Controller name="retirementYear" control={control} render={({ field }) => <input {...field} placeholder="Year of Retirement" className="input-premium" />} />
              </InputWrapper>
            </>
          )}
        </div>

        {/* Banking Section */}
        <section className="space-y-8 pt-8 border-t border-[#EEEEEE]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
              <ShieldCheck size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#121212]">Banking & Liability</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Institutional Disbursement Channel</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <InputWrapper label="IFSC Code" description="Lookup Simulation" error={errors.ifscCode} touched={touchedFields.ifscCode || isSubmitted}>
              <div className="relative">
                <Controller name="ifscCode" control={control} render={({ field }) => (
                  <input {...field} maxLength={11} placeholder="HDFC0001234" className="input-premium font-mono uppercase" />
                )} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isIfscVerifying ? <Loader2 size={16} className="animate-spin text-[#0065FF]" /> : ifsc?.length === 11 && <CheckCircle2 size={16} className="text-[#2E7D32]" />}
                </div>
              </div>
              <AnimatePresence>
                {bankInfo && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-[#F0F7FF] rounded-lg border border-[#0065FF]/20 flex items-start gap-3">
                    <Info size={14} className="text-[#0065FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]">{bankInfo.name}</p>
                      <p className="text-[8px] font-mono text-[#0065FF] uppercase tracking-widest">{bankInfo.branch} | {bankInfo.city}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </InputWrapper>

            <InputWrapper label="Existing Monthly EMIs" error={errors.existingEmis} touched={touchedFields.existingEmis || isSubmitted}>
              <Controller name="existingEmis" control={control} render={({ field }) => (
                <input
                  type="number"
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="Total Active EMIs"
                  className="input-premium font-mono"
                />
              )} />
            </InputWrapper>

            <InputWrapper label="Account Type" error={errors.accountType} touched={touchedFields.accountType || isSubmitted}>
              <Controller name="accountType" control={control} render={({ field }) => (
                <select {...field} className="input-premium">
                  <option value="">Select Type</option>
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                  <option value="salary">Salary Account</option>
                </select>
              )} />
            </InputWrapper>

            <InputWrapper label="Other Monthly Obligations" error={errors.monthlyObligations} touched={touchedFields.monthlyObligations || isSubmitted}>
              <Controller name="monthlyObligations" control={control} render={({ field }) => (
                <input
                  type="number"
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="Rent, Insurance, etc."
                  className="input-premium font-mono"
                />
              )} />
            </InputWrapper>
          </div>
        </section>

        {/* Hidden Submit */}
        <button type="submit" id="wizard-submit-btn" className="hidden">Submit</button>
      </form>

      {/* Underwriting Sidebar */}
      <aside className="w-full xl:w-96 sticky top-32 space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] text-white shadow-2xl relative overflow-hidden">
          {/* Animated Background Pulse */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
          
          <div className="relative space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-meta text-white/40">Risk Assessment</p>
                <h4 className="text-xl sm:text-2xl font-serif italic">Underwriting</h4>
              </div>
              <div className={`px-4 py-2 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                metrics.riskStatus === 'success' ? 'border-[#2E7D32] text-[#4CAF50]' :
                metrics.riskStatus === 'warning' ? 'border-[#FF8F00] text-[#FFB300]' :
                'border-[#C62828] text-[#FF5252]'
              }`}>
                {metrics.risk} Risk
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1">DTI Ratio</p>
                <p className="text-xl font-bold">{metrics.dti}%</p>
                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, metrics.dti)}%` }}
                    className={`h-full ${metrics.riskStatus === 'success' ? 'bg-[#4CAF50]' : metrics.riskStatus === 'warning' ? 'bg-[#FFB300]' : 'bg-[#FF5252]'}`}
                  />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1">UW Score</p>
                <p className="text-xl font-bold">{metrics.score}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Estimated Eligibility</p>
              <h5 className="text-4xl font-serif italic">₹{metrics.eligibility.toLocaleString('en-IN')}</h5>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#0065FF]">Institutional Upper Bound</p>
            </div>

            <div className="p-4 bg-[#0065FF]/10 rounded-2xl border border-[#0065FF]/20 flex gap-3">
              <Target size={16} className="text-[#0065FF] shrink-0" />
              <p className="text-[9px] font-mono leading-relaxed text-white/60 uppercase">
                Underwriting metrics are calculated based on debt-to-income ratio and historical repayment probability for {employmentType} profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Checklist */}
        <div className="p-8 rounded-[2.5rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-6">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Required Dossier</h5>
            <FileCheck size={14} className="text-[#888888]" />
          </div>
          <div className="space-y-3">
            {getDynamicDocs().map((doc, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EEEEEE] shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#121212]/20" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888]">{doc}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 flex items-center gap-2 text-[#0065FF]">
            <AlertCircle size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest">Document Uploads in Step 7</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default EmploymentStep;
