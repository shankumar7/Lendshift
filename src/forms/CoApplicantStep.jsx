import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import {
  Users,
  ShieldCheck,
  Fingerprint,
  Smartphone,
  Mail,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Trash2,
  PenTool,
  Lock,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import coApplicantSchema from '../schemas/coApplicantSchema';

const InputWrapper = ({ label, children, error, touched, icon: Icon }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={12} className="text-[#888888]" />}
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
        {label}
      </label>
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

const VerificationBadge = ({ status, label }) => {
  const styles = {
    idle: 'bg-[#F8F9FA] text-[#888888] border-[#EEEEEE]',
    loading: 'bg-[#F0F7FF] text-[#0065FF] border-[#0065FF]/20',
    success: 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20',
  };

  return (
    <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${styles[status]}`}>
      {status === 'loading' && <Loader2 size={10} className="animate-spin" />}
      {status === 'success' && <CheckCircle2 size={10} />}
      {label}
    </div>
  );
};

const CoApplicantStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const sigCanvas = useRef();
  
  const [verifications, setVerifications] = useState({
    mobile: formData.coApplicant.isMobileVerified ? 'success' : 'idle',
    pan: formData.coApplicant.isPanVerified ? 'success' : 'idle',
    aadhaar: formData.coApplicant.isAadhaarVerified ? 'success' : 'idle',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Gating Logic
  const loanType = formData.loanSelection.loanType;
  const loanAmount = formData.loanSelection.amount;
  const isRequired = useMemo(() => {
    if (loanType === 'home') return true;
    if (loanType === 'personal' && loanAmount > 500000) return true;
    if (loanType === 'business' && loanAmount > 2000000) return true;
    return false;
  }, [loanType, loanAmount]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(coApplicantSchema),
    defaultValues: {
      ...formData.coApplicant,
      hasCoApplicant: isRequired || formData.coApplicant.hasCoApplicant,
    },
    mode: 'onBlur',
  });

  const hasCoApplicant = watch('hasCoApplicant');
  const coIncome = watch('monthlyIncome') || 0;
  const coEmis = watch('existingEmis') || 0;
  const pan = watch('pan');
  const aadhaar = watch('aadhaar');

  // Auto-save
  const allValues = watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('coApplicant', allValues);
    }, 1000);
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  // Underwriting Calculations
  const metrics = useMemo(() => {
    const primaryIncome = formData.employment.monthlyIncome || 0;
    const primaryEmis = formData.employment.existingEmis || 0;
    
    const combinedIncome = primaryIncome + coIncome;
    const combinedEmis = primaryEmis + coEmis;
    const jointDti = combinedIncome > 0 ? (combinedEmis / combinedIncome) * 100 : 0;
    
    const individualDti = primaryIncome > 0 ? (primaryEmis / primaryIncome) * 100 : 0;
    const boost = individualDti - jointDti;
    
    const confidence = Math.min(98, 70 + (boost > 0 ? boost : 0) - (jointDti > 40 ? (jointDti - 40) * 2 : 0));

    return {
      combinedIncome,
      jointDti: jointDti.toFixed(1),
      boost: boost.toFixed(1),
      confidence: Math.round(confidence),
      status: jointDti < 35 ? 'Strong' : jointDti < 50 ? 'Stable' : 'Diluted'
    };
  }, [coIncome, coEmis, formData.employment]);

  // Verification Simulations
  const simulateVerification = (type) => {
    setVerifications(prev => ({ ...prev, [type]: 'loading' }));
    setTimeout(() => {
      setVerifications(prev => ({ ...prev, [type]: 'success' }));
      if (type === 'mobile') setValue('isMobileVerified', true);
      if (type === 'pan') setValue('isPanVerified', true);
      if (type === 'aadhaar') setValue('isAadhaarVerified', true);
    }, 2000);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpTimer(30);
    simulateVerification('mobile');
  };

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setValue('signature', null);
  };

  const saveSignature = () => {
    if (!sigCanvas.current.isEmpty()) {
      setValue('signature', sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const onSubmit = (data) => {
    updateFormData('coApplicant', data);
    onNext();
  };

  if (!hasCoApplicant && !isRequired) {
    return (
      <div className="min-h-[400px] p-12 bg-[#F8F9FA] rounded-[3rem] border border-[#EEEEEE] flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-[#888888]">
          <Users size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif italic">No Co-Applicant Required</h3>
          <p className="text-sm text-[#888888] max-w-md mx-auto">
            Based on your loan type and amount, a co-borrower is not mandatory. However, adding one can significantly boost your eligibility and approval odds.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue('hasCoApplicant', true)}
            className="px-8 h-14 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Add Co-Applicant
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 h-14 rounded-2xl bg-white border border-[#EEEEEE] text-[10px] font-black uppercase tracking-widest hover:bg-[#FAFAFA] transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-12">
        {/* Profile Header */}
        <div className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-[#F8F9FA] border border-[#EEEEEE] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#121212] text-white flex items-center justify-center">
              <Users size={20} sm:size={24} />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-[#888888]">Joint Liability</p>
              <h3 className="text-xl sm:text-2xl font-serif italic">Co-Borrower Details</h3>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end pt-4 sm:pt-0 border-t sm:border-t-0 border-[#EEEEEE]">
            <VerificationBadge status={verifications.pan} label="PAN" />
            <VerificationBadge status={verifications.aadhaar} label="KYC" />
          </div>
        </div>

        {/* Section 1: Relationship */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Relationship to Applicant</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {['Spouse', 'Parent', 'Sibling', 'Partner', 'Guarantor', 'Other'].map((rel) => (
              <label key={rel} className="relative cursor-pointer group">
                <Controller
                  name="relation"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="radio"
                      className="peer sr-only"
                      checked={field.value === rel}
                      onChange={() => field.onChange(rel)}
                    />
                  )}
                />
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#EEEEEE] bg-white transition-all group-hover:border-[#0065FF]/30 peer-checked:border-[#121212] peer-checked:bg-[#121212] peer-checked:text-white">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center">{rel}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.relation && (
            <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.relation.message}</p>
          )}
        </section>

        {/* Section 2: Personal Details */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Secondary Identity</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <InputWrapper label="Full Name" error={errors.fullName} touched={touchedFields.fullName || isSubmitted}>
              <Controller name="fullName" control={control} render={({ field }) => <input {...field} placeholder="As per PAN card" className="input-premium" />} />
            </InputWrapper>
            <InputWrapper label="Date of Birth" error={errors.dob} touched={touchedFields.dob || isSubmitted}>
              <Controller name="dob" control={control} render={({ field }) => <input {...field} type="date" className="input-premium" />} />
            </InputWrapper>
            <InputWrapper label="Mobile Number" error={errors.mobile} touched={touchedFields.mobile || isSubmitted} icon={Smartphone}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Controller name="mobile" control={control} render={({ field }) => <input {...field} placeholder="9876543210" maxLength={10} className="input-premium flex-1 font-mono" />} />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0 || !watch('mobile')}
                  className="px-6 h-14 sm:h-auto rounded-xl sm:rounded-2xl bg-[#121212] text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-20"
                >
                  {otpTimer > 0 ? `${otpTimer}s` : 'Verify'}
                </button>
              </div>
            </InputWrapper>
            <InputWrapper label="Email Address" error={errors.email} touched={touchedFields.email || isSubmitted} icon={Mail}>
              <Controller name="email" control={control} render={({ field }) => <input {...field} placeholder="co-borrower@example.com" className="input-premium font-mono" />} />
            </InputWrapper>
            <InputWrapper label="PAN Number" error={errors.pan} touched={touchedFields.pan || isSubmitted} icon={Fingerprint}>
              <div className="flex gap-3">
                <Controller name="pan" control={control} render={({ field }) => <input {...field} placeholder="ABCDE1234F" maxLength={10} className="input-premium flex-1 font-mono uppercase" />} />
                <button
                  type="button"
                  onClick={() => simulateVerification('pan')}
                  disabled={pan?.length !== 10}
                  className="px-6 rounded-2xl bg-[#F8F9FA] border border-[#EEEEEE] text-[9px] font-black uppercase tracking-widest"
                >
                  Validate
                </button>
              </div>
            </InputWrapper>
            <InputWrapper label="Aadhaar Number" error={errors.aadhaar} touched={touchedFields.aadhaar || isSubmitted} icon={Lock}>
              <div className="flex gap-3">
                <Controller name="aadhaar" control={control} render={({ field }) => <input {...field} placeholder="1234 5678 9012" maxLength={12} className="input-premium flex-1 font-mono" />} />
                <button
                  type="button"
                  onClick={() => simulateVerification('aadhaar')}
                  disabled={aadhaar?.length !== 12}
                  className="px-6 rounded-2xl bg-[#F8F9FA] border border-[#EEEEEE] text-[9px] font-black uppercase tracking-widest"
                >
                  KYC
                </button>
              </div>
            </InputWrapper>
          </div>
        </section>

        {/* Section 3: Financial Background */}
        <section className="space-y-8 pt-8 border-t border-[#EEEEEE]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Secondary Financials</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <InputWrapper label="Employment Type" error={errors.employmentType} touched={touchedFields.employmentType || isSubmitted} icon={Briefcase}>
              <Controller name="employmentType" control={control} render={({ field }) => (
                <select {...field} className="input-premium">
                  <option value="">Select Type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="business">Business Owner</option>
                  <option value="retired">Retired</option>
                </select>
              )} />
            </InputWrapper>
            <InputWrapper label="Monthly Net Income" error={errors.monthlyIncome} touched={touchedFields.monthlyIncome || isSubmitted} icon={TrendingUp}>
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
            <InputWrapper label="Monthly Obligations" description="Existing EMIs" error={errors.existingEmis} touched={touchedFields.existingEmis || isSubmitted}>
              <Controller name="existingEmis" control={control} render={({ field }) => (
                <input
                  type="number"
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="₹ 0.00"
                  className="input-premium font-mono"
                />
              )} />
            </InputWrapper>
          </div>
        </section>

        {/* Section 4: Signature */}
        <section className="space-y-8 pt-8 border-t border-[#EEEEEE]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Joint Liability Signature</h4>
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="bg-[#F8F9FA] rounded-[2rem] border-2 border-dashed border-[#EEEEEE] overflow-hidden relative group">
            <SignatureCanvas
              ref={sigCanvas}
              onEnd={saveSignature}
              penColor="#121212"
              canvasProps={{
                className: "w-full h-48 cursor-crosshair",
              }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
              <div className="flex flex-col items-center gap-2">
                <PenTool size={20} />
                <p className="text-[9px] font-black uppercase tracking-widest">Sign inside the box</p>
              </div>
            </div>
          </div>
          {errors.signature && (
            <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.signature.message}</p>
          )}
        </section>

        {/* Section 5: Consent */}
        <section className="p-8 rounded-[2rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-6">
          <label className="flex gap-4 cursor-pointer">
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-5 h-5 mt-1 rounded border-[#EEEEEE] text-[#121212] focus:ring-[#121212]"
                />
              )}
            />
            <div className="space-y-2">
              <p className="text-xs font-bold leading-relaxed text-[#121212]">
                I hereby declare that the co-applicant details provided are true and I authorize LendSwift to perform credit checks and joint liability assessment.
              </p>
              <p className="text-[10px] text-[#888888] font-mono leading-relaxed">
                By signing above, the co-applicant acknowledges equal responsibility for the repayment of this credit facility.
              </p>
            </div>
          </label>
          {errors.consent && (
            <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.consent.message}</p>
          )}
        </section>

        <button type="submit" id="wizard-submit-btn" className="hidden">Submit</button>
      </form>

      {/* Side Panel: Joint Liability */}
      <aside className="w-full xl:w-96 sticky top-32 space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
          
          <div className="relative space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-meta text-white/40">Joint Analysis</p>
                <h4 className="text-2xl font-serif italic">Liability Score</h4>
              </div>
              <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                metrics.status === 'Strong' ? 'border-[#2E7D32] text-[#4CAF50]' :
                metrics.status === 'Stable' ? 'border-[#FF8F00] text-[#FFB300]' :
                'border-[#C62828] text-[#FF5252]'
              }`}>
                {metrics.status}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Combined Income</p>
                <p className="text-xl font-bold">₹{metrics.combinedIncome.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Joint DTI</p>
                  <Scale size={12} className="text-[#0065FF]" />
                </div>
                <p className="text-xl font-bold">{metrics.jointDti}%</p>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Eligibility Boost</p>
                  <TrendingUp size={12} className="text-[#4CAF50]" />
                </div>
                <p className="text-xl font-bold text-[#4CAF50]">+{metrics.boost}%</p>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Approval Confidence</p>
                <p className="text-2xl font-serif italic">{metrics.confidence}%</p>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.confidence}%` }}
                  className="h-full bg-[#0065FF]"
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3">
              <Lock size={16} className="text-white/40 shrink-0" />
              <p className="text-[9px] font-mono leading-relaxed text-white/60 uppercase">
                Joint liability distributes risk and allows for higher disbursement limits based on combined repayment capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Indicators */}
        <div className="p-8 rounded-[2.5rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-6">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Joint Profile Strength</h5>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">Relationship Proof</span>
              <CheckCircle2 size={14} className="text-[#2E7D32]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">Income Stability</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= 4 ? 'bg-[#0065FF]' : 'bg-[#EEEEEE]'}`} />)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">Identity Match</span>
              <span className="text-[9px] font-black text-[#0065FF]">98% Confidence</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CoApplicantStep;
