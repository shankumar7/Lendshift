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
import Logo from '@/components/Logo';

const WizardInner = () => {
  const { 
    currentStep, 
    setStep,
    totalSteps, 
    isFirstStep, 
    isLastStep, 
    goToPrevStep, 
    handleStepNavigation,
  } = useWizard();
  
  const navigate = useNavigate();
  const { stepId } = useParams();

  useEffect(() => {
    if (stepId) {
      const index = getStepIndexById(stepId);
      if (index !== -1 && index !== currentStep) {
        setStep(index);
      }
    } else {
      navigate(`/apply/step/${STEP_REGISTRY[0].id}`, { replace: true });
    }
  }, [stepId, navigate, setStep, currentStep]);

  const activeStep = STEP_REGISTRY[currentStep];
  const StepComponent = activeStep.component;

  const handleBackToLanding = () => navigate('/');

  return (
    <div className="min-h-screen bg-[#06060E] text-white flex flex-col">
      {/* Ultra-Premium Header */}
      <header className="h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleBackToLanding}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <Logo className="scale-90" />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-xs font-bold">~3 mins left</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="lg:w-80 bg-black/10 border-r border-white/5 p-8 overflow-y-auto hidden lg:block">
          <div className="space-y-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Application Journey</p>
              <h2 className="text-xl font-bold font-display">Step {currentStep + 1} of {totalSteps}</h2>
            </div>

            <nav className="space-y-3">
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
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 text-left relative group",
                      isActive ? "bg-indigo-600/10 text-white" : 
                      isCompleted ? "text-indigo-400 opacity-60" : "text-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-[10px] border transition-all",
                      isActive ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : 
                      isCompleted ? "border-indigo-500/50 bg-indigo-500/20 text-white" : "border-white/5 bg-white/5"
                    )}>
                      {isCompleted ? <ShieldCheck size={14} /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{step.title}</p>
                      {isActive && <motion.p layoutId="step-desc" className="text-[10px] text-slate-500 mt-0.5">{step.description}</motion.p>}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Stepper */}
        <div className="lg:hidden bg-black/20 backdrop-blur-md border-b border-white/5 p-4 sticky top-20 z-30">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 xl:p-20 relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="premium-glass rounded-[2.5rem] p-8 lg:p-14 shadow-2xl min-h-[550px] flex flex-col"
              >
                <div className="rim-highlight" />
                <div className="flex-1">
                  <Suspense fallback={
                    <div className="space-y-8">
                      <Skeleton className="h-10 w-2/3 bg-white/5" />
                      <Skeleton className="h-48 w-full bg-white/5" />
                    </div>
                  }>
                    <StepComponent />
                  </Suspense>
                </div>

                <footer className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={goToPrevStep}
                    disabled={isFirstStep}
                    className="h-12 px-6 rounded-xl text-sm font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>

                  <button
                    type="submit"
                    form="wizard-step-form"
                    className="btn-primary h-14 px-10 text-sm shadow-xl"
                  >
                    {isLastStep ? 'Complete Journey' : 'Save & Continue'}
                    {!isLastStep && <ChevronRight size={18} />}
                  </button>
                </footer>
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-12 flex flex-col items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-10">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" className="h-4 invert" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RBI_logo.svg/1200px-RBI_logo.svg.png" alt="RBI" className="h-8 invert" />
                <div className="flex items-center gap-2 text-[10px] font-black text-white italic tracking-widest">
                  <ShieldCheck size={14} className="text-indigo-500" />
                  ISO 27001 SECURED
                </div>
              </div>
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
