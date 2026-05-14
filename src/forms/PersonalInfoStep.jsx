import React, { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Heart, Shield, 
  BookOpen, Briefcase, IndianRupee, AlertCircle, 
  CheckCircle2, RefreshCcw, Loader2
} from 'lucide-react';
import personalInfoSchema from '../schemas/personalInfoSchema';
import useLoanStore from '../store/useLoanStore';

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

const SectionHeader = ({ icon: Icon, title, desc }) => (
  <div className="space-y-4 mb-8 sm:mb-10">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
        <Icon size={16} sm:size={18} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-lg sm:text-xl font-serif italic text-[#121212]">{title}</h3>
        <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">{desc}</p>
      </div>
    </div>
  </div>
);

const InputWrapper = ({ label, id, children, error, touched, verified, isLoading }) => (
  <div className="space-y-2 group">
    <label htmlFor={id} className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#121212]/40 group-focus-within:text-[#121212] transition-colors">
      {label}
    </label>
    <div className="relative">
      {children}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isLoading && <Loader2 size={16} className="animate-spin text-[#0065FF]" />}
        {verified && !isLoading && <CheckCircle2 size={16} className="text-[#0065FF]" />}
      </div>
    </div>
    <ErrorField error={error} touched={touched} />
  </div>
);

const PersonalInfoStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpValue, setOtpValue] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
    mode: 'onBlur',
  });

  const maritalStatus = useWatch({ control, name: 'maritalStatus' });
  const dob = useWatch({ control, name: 'dob' });
  const panCard = useWatch({ control, name: 'panCard' });
  const aadhaar = useWatch({ control, name: 'aadhaar' });
  const isMobileVerified = useWatch({ control, name: 'isMobileVerified' });
  const isPanVerified = useWatch({ control, name: 'isPanVerified' });
  const isAadhaarVerified = useWatch({ control, name: 'isAadhaarVerified' });

  // Calculate age dynamically
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age -= 1;
    return age;
  };

  const age = calculateAge(dob);

  // Sync occupation with step 1 employmentType if empty
  useEffect(() => {
    if (!formData.personalInfo.occupation && formData.loanSelection.employmentType) {
      setValue('occupation', formData.loanSelection.employmentType);
    }
  }, [formData.loanSelection.employmentType, formData.personalInfo.occupation, setValue]);

  // OTP Timer
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  // AUTO-SAVE LOGIC: Sync form values to global store on change
  const allValues = useWatch({ control });
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('personalInfo', allValues);
    }, 1000); // 1 second debounce
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  const handleSendOtp = async () => {
    setOtpVerifying(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API
    setOtpSent(true);
    setOtpTimer(60);
    setOtpVerifying(false);
  };

  const handleVerifyOtp = async () => {
    setOtpVerifying(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API
    setValue('isMobileVerified', true);
    setOtpSent(false);
    setOtpVerifying(false);
  };

  const handleVerifyPan = async () => {
    if (!panCard || panCard.length < 10) return;
    setIsVerifyingPan(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate API
    setValue('isPanVerified', true);
    setIsVerifyingPan(false);
  };

  const handleVerifyAadhaar = async () => {
    if (!aadhaar || aadhaar.length < 12) return;
    setIsVerifyingAadhaar(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate API
    setValue('isAadhaarVerified', true);
    setIsVerifyingAadhaar(false);
  };

  const onSubmit = (data) => {
    updateFormData('personalInfo', data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-20">
      {/* 1. Identity Basics */}
      <section>
        <SectionHeader icon={User} title="Identity Foundation" desc="Your legal name & birth records" />
        <div className="grid md:grid-cols-3 gap-6">
          <InputWrapper label="First Name" id="firstName" error={errors.firstName} touched={touchedFields.firstName || isSubmitted}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input {...field} id="firstName" placeholder="Arjun" className="input-premium" />
              )}
            />
          </InputWrapper>

          <InputWrapper label="Middle Name" id="middleName" error={errors.middleName} touched={touchedFields.middleName || isSubmitted}>
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <input {...field} id="middleName" placeholder="Kumar" className="input-premium" />
              )}
            />
          </InputWrapper>

          <InputWrapper label="Last Name" id="lastName" error={errors.lastName} touched={touchedFields.lastName || isSubmitted}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input {...field} id="lastName" placeholder="Sharma" className="input-premium" />
              )}
            />
          </InputWrapper>
        </div>

        <div className="grid md:grid-cols-12 gap-8 mt-10">
          <div className="md:col-span-5">
            <InputWrapper label="Date of Birth" id="dob" error={errors.dob} touched={touchedFields.dob || isSubmitted}>
              <div className="relative">
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="date" id="dob" className="input-premium pr-12" />
                  )}
                />
                {age !== null && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#0065FF]">
                    {age} YRS
                  </div>
                )}
              </div>
            </InputWrapper>
          </div>

          <div className="md:col-span-7 space-y-2">
            <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {['male', 'female', 'non-binary', 'prefer-not-to-say'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => field.onChange(g)}
                      className={`h-14 sm:h-16 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 border px-1 sm:px-2 ${
                        field.value === g 
                        ? 'bg-[#121212] border-[#121212] text-white shadow-lg' 
                        : 'bg-white border-[#EEEEEE] text-[#121212]/40 hover:border-[#121212]/20'
                      }`}
                    >
                      {g.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
            />
            <ErrorField error={errors.gender} touched={touchedFields.gender || isSubmitted} />
          </div>
        </div>
      </section>

      {/* 2. Marital & Social */}
      <section>
        <SectionHeader icon={Heart} title="Social Context" desc="Marital status & family details" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Marital Status</label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {['single', 'married', 'divorced', 'widowed'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => field.onChange(m)}
                      className={`h-14 sm:h-16 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                        field.value === m 
                        ? 'bg-[#121212] border-[#121212] text-white shadow-lg' 
                        : 'bg-white border-[#EEEEEE] text-[#121212]/40 hover:border-[#121212]/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            />
            <ErrorField error={errors.maritalStatus} touched={touchedFields.maritalStatus || isSubmitted} />
          </div>

          <AnimatePresence>
            {maritalStatus === 'married' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <InputWrapper label="Spouse Name" id="spouseName" error={errors.spouseName} touched={touchedFields.spouseName || isSubmitted}>
                  <Controller
                    name="spouseName"
                    control={control}
                    render={({ field }) => (
                      <input {...field} id="spouseName" placeholder="Full name of spouse" className="input-premium" />
                    )}
                  />
                </InputWrapper>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Communication & Verification */}
      <section>
        <SectionHeader icon={Shield} title="Secured Communication" desc="Phone, Email & Multi-factor verification" />
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mobile Field with OTP Simulation */}
          <div className="space-y-6">
            <InputWrapper
              label="Primary Mobile Number"
              id="mobileNumber"
              error={errors.mobileNumber}
              touched={touchedFields.mobileNumber || isSubmitted}
              verified={isMobileVerified}
            >
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#121212]/20">
                  +91
                </span>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="mobileNumber"
                      maxLength={10}
                      disabled={isMobileVerified}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="input-premium pl-16 pr-32"
                    />
                  )}
                />
                {!isMobileVerified && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpVerifying}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-lg bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-colors disabled:opacity-50"
                  >
                    {otpVerifying ? <Loader2 size={14} className="animate-spin" /> : 'Send OTP'}
                  </button>
                )}
              </div>
            </InputWrapper>
          </div>

          <InputWrapper
            label="Email Address"
            id="email"
            error={errors.email}
            touched={touchedFields.email || isSubmitted}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  placeholder="name@institutional.com"
                  className="input-premium"
                />
              )}
            />
          </InputWrapper>

          <AnimatePresence>
            {otpSent && !isMobileVerified && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="md:col-span-2 p-8 bg-[#F8F9FA] rounded-[2rem] border border-[#EEEEEE] space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                      Security Verification
                    </p>
                    <p className="text-[10px] font-mono text-[#888888]">
                      Enter the 6-digit code sent to your device
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EEEEEE] rounded-full">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${otpTimer > 0 ? 'bg-[#0065FF] animate-pulse' : 'bg-red-500'}`}
                    />
                    <span className="text-[10px] font-mono font-bold text-[#121212]">
                      00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="······"
                      className="w-full h-16 bg-white border border-[#EEEEEE] rounded-2xl px-6 text-center text-2xl font-mono tracking-[0.5em] focus:border-[#121212] focus:ring-1 focus:ring-[#121212] outline-none transition-all placeholder:text-[#EEEEEE]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length < 6 || otpVerifying}
                    className="h-16 px-10 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                  >
                    {otpVerifying ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Verify Code
                        <CheckCircle2 size={14} />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#EEEEEE]">
                  <p className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpTimer > 0 || otpVerifying}
                    className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] disabled:text-[#888888]/40 transition-colors flex items-center gap-2 group"
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                    <RefreshCcw
                      size={12}
                      className={`group-hover:rotate-180 transition-transform duration-500 ${otpVerifying ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <InputWrapper label="Alternate Mobile (Optional)" id="altMobileNumber" error={errors.altMobileNumber} touched={touchedFields.altMobileNumber || isSubmitted}>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#121212]/20">+91</span>
              <Controller
                name="altMobileNumber"
                control={control}
                render={({ field }) => (
                  <input {...field} id="altMobileNumber" maxLength={10} placeholder="88776 55443" className="input-premium pl-16" />
                )}
              />
            </div>
          </InputWrapper>
        </div>
      </section>

      {/* 4. Statutory Verification */}
      <section>
        <SectionHeader icon={Shield} title="Institutional Verification" desc="PAN & Aadhaar validation" />
        <div className="grid md:grid-cols-2 gap-12">
          {/* PAN Card */}
          <InputWrapper 
            label="PAN Card Number" 
            id="panCard" 
            error={errors.panCard} 
            touched={touchedFields.panCard || isSubmitted}
            verified={isPanVerified}
            isLoading={isVerifyingPan}
          >
            <div className="relative">
              <Controller
                name="panCard"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <input 
                    {...rest}
                    value={value}
                    id="panCard" 
                    maxLength={10} 
                    disabled={isPanVerified}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F" 
                    className={`input-premium pr-32 ${isPanVerified ? 'font-mono tracking-[0.3em] opacity-60' : ''}`} 
                  />
                )}
              />
              {!isPanVerified && (
                <button
                  type="button"
                  onClick={handleVerifyPan}
                  disabled={isVerifyingPan || (panCard?.length || 0) < 10}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-lg bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-colors disabled:opacity-50"
                >
                  Verify
                </button>
              )}
            </div>
          </InputWrapper>

          {/* Aadhaar Card */}
          <InputWrapper 
            label="Aadhaar Number" 
            id="aadhaar" 
            error={errors.aadhaar} 
            touched={touchedFields.aadhaar || isSubmitted}
            verified={isAadhaarVerified}
            isLoading={isVerifyingAadhaar}
          >
            <div className="relative">
              <Controller
                name="aadhaar"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <input 
                    {...rest}
                    value={value}
                    id="aadhaar" 
                    maxLength={12} 
                    disabled={isAadhaarVerified}
                    onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXX XXXX XXXX" 
                    className={`input-premium pr-32 ${isAadhaarVerified ? 'font-mono tracking-[0.3em] opacity-60' : ''}`} 
                  />
                )}
              />
              {!isAadhaarVerified && (
                <button
                  type="button"
                  onClick={handleVerifyAadhaar}
                  disabled={isVerifyingAadhaar || (aadhaar?.length || 0) < 12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-lg bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-colors disabled:opacity-50"
                >
                  Verify
                </button>
              )}
            </div>
          </InputWrapper>
        </div>
      </section>

      {/* 5. Professional & Financial */}
      <section>
        <SectionHeader icon={Briefcase} title="Professional Profile" desc="Occupation & Annual earnings" />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Occupation</label>
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <select {...field} className="input-premium appearance-none">
                  <option value="">Select Category</option>
                  <option value="salaried">Salaried Professional</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                  <option value="business-owner">Business Owner</option>
                </select>
              )}
            />
            <ErrorField error={errors.occupation} touched={touchedFields.occupation || isSubmitted} />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Education</label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <select {...field} className="input-premium appearance-none">
                  <option value="">Select Level</option>
                  <option value="high-school">High School</option>
                  <option value="graduate">Graduate</option>
                  <option value="post-graduate">Post Graduate</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              )}
            />
            <ErrorField error={errors.education} touched={touchedFields.education || isSubmitted} />
          </div>

          <div className="md:col-span-2">
            <InputWrapper label="Annual Income (INR)" id="annualIncome" error={errors.annualIncome} touched={touchedFields.annualIncome || isSubmitted}>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-serif italic text-[#121212]/20">₹</span>
                <Controller
                  name="annualIncome"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="annualIncome"
                      type="number"
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? 0 : Number(val));
                      }}
                      placeholder="0"
                      className="input-premium pl-12 font-serif italic text-2xl"
                    />
                  )}
                />
              </div>
            </InputWrapper>
          </div>
        </div>
      </section>

      {/* Hidden Submit for Wizard Control */}
      <button type="submit" id="wizard-submit-btn" className="hidden">Submit</button>

      {/* Manual Continue Button (Visible on mobile/when sticky) */}
      <div className="md:hidden pt-8">
        <button 
          type="submit" 
          disabled={!isMobileVerified || !isPanVerified || !isAadhaarVerified}
          className="btn-primary w-full h-16 disabled:opacity-20"
        >
          Verify & Continue
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;
