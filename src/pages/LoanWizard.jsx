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
  ArrowLeft,
  Lock
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
    <div className="min-h-screen bg-[#F4F5F7] text-[#172B4D] flex flex-col font-sans">
      {/* Professional Header */}
      <header className="h-20 bg-white border-b border-[#DFE1E6] px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleBackToLanding}
            className="p-2 hover:bg-[#F4F5F7] rounded-full transition-colors text-[#42526E]"
          >
            <ArrowLeft size={20} />
          </button>
          <Logo className="scale-90" />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#36B37E] rounded-full border border-emerald-100 font-bold text-[10px] uppercase tracking-widest">
            <Lock size={12} />
            Secure Session
          </div>
          <div className="flex items-center gap-2 text-[#8993A4]">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">~4 mins</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="lg:w-80 bg-white border-r border-[#DFE1E6] p-8 overflow-y-auto hidden lg:block">
          <div className="space-y-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#0065FF] uppercase tracking-[0.2em]">Application Flow</p>
              <h2 className="text-xl font-bold">Step {currentStep + 1} of {totalSteps}</h2>
            </div>

            <nav className="space-y-1">
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
                      "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left relative",
                      isActive ? "bg-blue-50 text-[#0065FF]" : 
                      isCompleted ? "text-[#36B37E]" : "text-[#42526E] opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] border-2 transition-all",
                      isActive ? "border-[#0065FF] bg-[#0065FF] text-white" : 
                      isCompleted ? "border-[#36B37E] bg-[#36B37E] text-white" : "border-[#DFE1E6]"
                    )}>
                      {isCompleted ? <CheckCircle2 size={12} /> : index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{step.title}</p>
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#0065FF] rounded-r-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Top Stepper */}
        <div className="lg:hidden bg-white border-b border-[#DFE1E6] p-4 sticky top-20 z-30">
          <div className="h-1.5 w-full bg-[#F4F5F7] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#0065FF]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 xl:p-24">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-[#DFE1E6] p-8 lg:p-14 shadow-sm min-h-[500px] flex flex-col"
              >
                <div className="flex-1">
                  <Suspense fallback={
                    <div className="space-y-8">
                      <Skeleton className="h-10 w-2/3 bg-[#F4F5F7]" />
                      <Skeleton className="h-40 w-full bg-[#F4F5F7]" />
                    </div>
                  }>
                    <StepComponent />
                  </Suspense>
                </div>

                <footer className="mt-12 pt-8 border-t border-[#F4F5F7] flex items-center justify-between">
                  <button
                    onClick={goToPrevStep}
                    disabled={isFirstStep}
                    className="h-12 px-6 rounded-xl text-sm font-bold text-[#42526E] hover:bg-[#F4F5F7] disabled:opacity-0 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <button
                    type="submit"
                    form="wizard-step-form"
                    className="btn-primary h-14 px-10 text-sm"
                  >
                    {isLastStep ? 'Complete Application' : 'Save & Continue'}
                    {!isLastStep && <ChevronRight size={18} />}
                  </button>
                </footer>
              </motion.div>
            </AnimatePresence>
            
            {/* Compliance Section */}
            <div className="mt-12 flex flex-col items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-12">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" alt="UPI" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RBI_logo.svg/1200px-RBI_logo.svg.png" alt="RBI" className="h-8" />
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#172B4D] uppercase tracking-widest">
                     <ShieldCheck size={14} className="text-[#0065FF]" />
                     SECURED BY 256-BIT AES
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
