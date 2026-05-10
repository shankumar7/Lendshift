import React, { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { WizardProvider } from '@/components/WizardController';
import { useWizard } from '@/context/WizardContext';
import { STEP_REGISTRY, getStepIndexById } from '@/registry/stepRegistry';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Skeleton from '@/components/Skeleton';
import useLoanStore from '@/store/useLoanStore';

const WizardInner = () => {
  const { 
    currentStep, 
    setStep,
    totalSteps, 
    isFirstStep, 
    isLastStep, 
    goToPrevStep, 
    handleStepNavigation,
    isSubmitted 
  } = useWizard();
  
  const navigate = useNavigate();
  const { stepId } = useParams();

  // Sync route with state
  useEffect(() => {
    if (stepId) {
      const index = getStepIndexById(stepId);
      if (index !== -1 && index !== currentStep) {
        setStep(index);
      }
    } else {
      // Default to first step if no ID in URL
      navigate(`/apply/step/${STEP_REGISTRY[0].id}`, { replace: true });
    }
  }, [stepId, navigate, setStep, currentStep]);

  const activeStep = STEP_REGISTRY[currentStep];
  const StepComponent = activeStep.component;

  const handleBackToLanding = () => navigate('/');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Premium Onboarding Header */}
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToLanding}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">L</span>
            </div>
            <span className="font-black dark:text-white hidden sm:block">LendSwift Onboarding</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/20">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit AES</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={16} />
            <span className="text-xs font-bold">~4 mins left</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Desktop Sidebar / Mobile Top Bar */}
        <aside className="lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 lg:p-8 overflow-y-auto hidden lg:block">
          <nav className="space-y-2">
            {STEP_REGISTRY.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isLocked = index > currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepNavigation(index)}
                  disabled={isLocked}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left relative group",
                    isActive ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" : 
                    isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border-2 transition-all",
                    isActive ? "border-primary-600 bg-primary-600 text-white" : 
                    isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 dark:border-slate-800"
                  )}>
                    {isCompleted ? <ShieldCheck size={16} /> : index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{step.title}</p>
                    {isActive && <p className="text-[10px] opacity-70 mt-0.5">{step.description}</p>}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Top Stepper */}
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-20 z-30">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-black uppercase text-primary-600 tracking-widest">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs font-bold text-slate-500">{activeStep.title}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 xl:p-20">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 lg:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[500px] flex flex-col"
              >
                <div className="flex-1">
                  <Suspense fallback={
                    <div className="space-y-6">
                      <Skeleton className="h-10 w-2/3" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  }>
                    <StepComponent />
                  </Suspense>
                </div>

                <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={goToPrevStep}
                    disabled={isFirstStep}
                    className="h-12 px-6 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-0 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>

                  <button
                    type="submit"
                    form="wizard-step-form"
                    className="h-12 px-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-xl shadow-primary-600/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    {isLastStep ? 'Final Submission' : 'Save & Continue'}
                    {!isLastStep && <ChevronRight size={18} />}
                  </button>
                </footer>
              </motion.div>
            </AnimatePresence>
            
            {/* Trust Footer */}
            <div className="mt-12 flex flex-col items-center gap-6 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RBI_logo.svg/1200px-RBI_logo.svg.png" alt="RBI" className="h-8" />
                <div className="flex items-center gap-1 font-black text-slate-500 italic">
                  <ShieldCheck size={14} />
                  ISO 27001
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center leading-relaxed">
                Your data is encrypted using banking-grade security protocol.<br />
                We never share your personal information with third parties.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const LoanWizard = () => {
  return (
    <WizardProvider>
      <WizardInner />
    </WizardProvider>
  );
};

export default LoanWizard;
