import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Home,
  User,
  Fingerprint,
  MapPin,
  Briefcase,
  Users,
  FileText,
  Send,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useLoanStore from '../store/useLoanStore';
import useAutoSave from '../hooks/useAutoSave';
import Logo from '../components/Logo';
import ResumeModal from '../components/ResumeModal';
import LoanSelectionStep from '../forms/LoanSelectionStep';
import PersonalInfoStep from '../forms/PersonalInfoStep';
import KYCStep from '../forms/KYCStep';
import AddressStep from '../forms/AddressStep';
import EmploymentStep from '../forms/EmploymentStep';
import CoApplicantStep from '../forms/CoApplicantStep';
import DocumentStep from '../forms/DocumentStep';
import ReviewStep from '../forms/ReviewStep';
import useAccessibility from '../hooks/useAccessibility';

const STEPS = [
  { id: 1, title: 'Loan Selection', desc: 'Configure your capital', icon: Home },
  { id: 2, title: 'Personal Info', desc: 'Basic identity details', icon: User },
  { id: 3, title: 'KYC Verification', desc: 'Identity validation', icon: Fingerprint },
  { id: 4, title: 'Address', desc: 'Residency information', icon: MapPin },
  { id: 5, title: 'Employment', desc: 'Income & profession', icon: Briefcase },
  { id: 6, title: 'Co-Applicant', desc: 'Secondary security', icon: Users },
  { id: 7, title: 'Documents', desc: 'Verify & Sign', icon: FileText },
  { id: 8, title: 'Review', desc: 'Final confirmation', icon: Send },
];

const LoanWizard = () => {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const {
    formData,
    currentStep,
    setStep,
    lastSaved,
    resetApplication,
    isInitialized,
    setInitialized,
    setResumeModal,
  } = useLoanStore();

  const { personalInfo, kyc, address, documents: docs } = formData;
  const { announcementRef } = useAccessibility(currentStep);
  const [showResume, setShowResume] = useState(false);

  useAutoSave(30000);

  useEffect(() => {
    if (!stepId && lastSaved) {
      // Use a timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => setShowResume(true), 0);
      return () => clearTimeout(timer);
    }
    if (!stepId) {
      navigate('/apply/step/1', { replace: true });
    }
    return undefined;
  }, [stepId, lastSaved, navigate]);

  useEffect(() => {
    if (stepId) {
      const id = parseInt(stepId, 10);
      if (id !== currentStep) setStep(id);
    }
  }, [stepId, setStep, currentStep]);

  const handleResume = () => {
    setShowResume(false);
    navigate(`/apply/step/${currentStep}`);
  };

  const handleStartFresh = () => {
    resetApplication();
    setShowResume(false);
    navigate('/apply/step/1');
  };

  // Session Recovery Initialization
  useEffect(() => {
    if (!isInitialized && lastSaved && currentStep > 1) {
      setResumeModal(true);
    } else {
      setInitialized(true);
    }
  }, []);

  const onStepSuccess = () => {
    if (currentStep < STEPS.length) {
      navigate(`/apply/step/${currentStep + 1}`);
    }
  };

  const handleContinue = () => {
    const submitBtn = document.getElementById('wizard-submit-btn');
    if (submitBtn) submitBtn.click();
  };

  // Keyboard navigation: Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/apply/step/${currentStep - 1}`);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 2:
        return (
          personalInfo.isMobileVerified &&
          personalInfo.isPanVerified &&
          personalInfo.isAadhaarVerified
        );
      case 3:
        return (
          kyc.isPanVerified &&
          kyc.isAadhaarVerified &&
          kyc.isFaceVerified &&
          docs.panCard &&
          docs.aadhaarCard &&
          docs.secondaryId
        );
      case 4:
        return (
          address.current.addressLine1 &&
          address.current.city &&
          address.current.state &&
          address.current.pincode.length === 6 &&
          address.current.residenceType !== '' &&
          address.isGeoVerified &&
          docs.addressProof
        );
      case 5:
        return (
          formData.employment.type &&
          (formData.employment.employerName ||
            formData.employment.businessName ||
            formData.employment.primarySkill ||
            formData.employment.pensionAmount) &&
          formData.employment.ifscCode.length === 11 &&
          formData.employment.bankName
        );
      case 6:
        // Conditional completeness for Step 6
        if (!formData.coApplicant.hasCoApplicant) return true;
        return (
          formData.coApplicant.fullName &&
          formData.coApplicant.relation &&
          formData.coApplicant.isMobileVerified &&
          formData.coApplicant.isPanVerified &&
          formData.coApplicant.isAadhaarVerified &&
          formData.coApplicant.signature &&
          formData.coApplicant.consent
        );
      case 7:
        return (
          formData.documents.agreementAccepted &&
          formData.documents.primarySignature &&
          // Basic check for mandatory documents
          formData.documents.panCard &&
          formData.documents.aadhaarCard &&
          formData.documents.bankStatements
        );
      case 8:
        return formData.submission.status === 'success';
      default:
        return true;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans"
      role="main"
    >
      <ResumeModal />
      <div ref={announcementRef} className="sr-only" role="status" aria-live="polite" />
      <aside className="w-full lg:w-[400px] bg-[#F8F9FA] border-r border-[#EEEEEE] p-6 sm:p-8 lg:p-12 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-8 sm:space-y-12">
          <Link to="/" className="inline-block scale-75 sm:scale-90 origin-left mb-4 sm:mb-8">
            <Logo />
          </Link>
          <div className="space-y-2">
            <p className="text-meta">Step {currentStep} of 8</p>
            <h2 className="text-2xl sm:text-3xl font-serif italic tracking-tight">Onboarding</h2>
          </div>
          <nav className="space-y-1">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const Icon = step.icon;

              const getStepStyles = () => {
                if (isActive) return 'bg-[#121212] text-white';
                if (isCompleted) return 'bg-[#0065FF] text-white';
                return 'bg-[#EEEEEE] text-[#888888]';
              };

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 ${isActive ? 'bg-white shadow-sm ring-1 ring-[#EEEEEE]' : 'opacity-40'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${getStepStyles()}`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-[#121212]' : 'text-[#888888]'}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[10px] text-[#888888] font-mono">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
        <div className="pt-12 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                Application Progress
              </p>
              <p className="text-xs font-black">{Math.round(progress)}%</p>
            </div>
            <div className="h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#121212]"
              />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-white relative flex flex-col">
        <header className="h-20 border-b border-[#EEEEEE] px-8 lg:px-20 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 sm:p-2 hover:bg-[#FAFAFA] rounded-full transition-colors opacity-40 hover:opacity-100"
              >
                <ChevronLeft size={18} sm:size={20} />
              </button>
              <span className="text-[10px] font-mono text-[#EEEEEE]">/</span>
              <p className="text-[9px] sm:text-xs font-black uppercase tracking-widest truncate max-w-[100px] sm:max-w-none">
                {STEPS[currentStep - 1].title}
              </p>
            </div>
            {lastSaved && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] border border-[#EEEEEE] rounded-full">
                <div className="w-1 h-1 rounded-full bg-[#2E7D32] animate-pulse" />
                <span className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
                  Saved{' '}
                  {new Date(lastSaved).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (window.confirm('Reset application?')) resetApplication();
            }}
            className="text-[10px] font-bold text-[#888888] hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Exit & Reset
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto py-12 sm:py-24 px-6 sm:px-8 lg:px-20 space-y-12 sm:space-y-16">
            <div className="space-y-6">
              <motion.div
                key={`${currentStep}badge`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-[#F8F9FA] rounded-full border border-[#EEEEEE]"
              >
                <div className="w-2 h-2 rounded-full bg-[#0065FF]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]">
                  Section 0{currentStep}
                </span>
              </motion.div>
              <motion.div
                key={`${currentStep}title`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif italic leading-tight tracking-tighter">
                  {STEPS[currentStep - 1].title}
                </h1>
                <p className="text-base sm:text-xl text-[#888888] font-sans leading-relaxed">
                  {STEPS[currentStep - 1].desc}
                </p>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {currentStep === 1 && (
                  <div ref={formRef}>
                    <LoanSelectionStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 2 && (
                  <div ref={formRef}>
                    <PersonalInfoStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 3 && (
                  <div ref={formRef}>
                    <KYCStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 4 && (
                  <div ref={formRef}>
                    <AddressStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 5 && (
                  <div ref={formRef}>
                    <EmploymentStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 6 && (
                  <div ref={formRef}>
                    <CoApplicantStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 7 && (
                  <div ref={formRef}>
                    <DocumentStep onNext={onStepSuccess} />
                  </div>
                )}
                {currentStep === 8 && (
                  <div ref={formRef}>
                    <ReviewStep />
                  </div>
                )}
                {currentStep > 8 && (
                  <div className="min-h-[400px] p-12 bg-[#F8F9FA] rounded-[3rem] border border-[#EEEEEE] border-dashed flex flex-col items-center justify-center text-center">
                    <p className="text-[#888888] font-mono uppercase tracking-widest text-xs">
                      Application Submitted Successfully
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pt-12 border-t border-[#EEEEEE] flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-3 text-sm font-black uppercase tracking-widest disabled:opacity-20 transition-all hover:gap-6"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isStepComplete()}
                className="btn-primary h-14 sm:h-16 px-8 sm:px-12 group disabled:opacity-20 transition-all"
              >
                {currentStep === 8 ? 'Submit' : 'Continue'}
                <ChevronRight
                  size={18}
                  sm:size={20}
                  className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </main>

      <ResumeModal />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #EEEEEE; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #DDDDDD; }`}</style>
    </div>
  );
};

export default LoanWizard;
