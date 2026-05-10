import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardProvider, useWizard } from '@/components/WizardController';
import { STEP_REGISTRY } from '@/registry/stepRegistry';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  RotateCcw,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Skeleton from '@/components/Skeleton';
import useLoanStore from '@/store/useLoanStore';

const WizardInner = () => {
  const { 
    currentStep, 
    totalSteps, 
    isFirstStep, 
    isLastStep, 
    goToPrevStep, 
    handleStepNavigation,
    isSubmitted 
  } = useWizard();

  const activeStep = STEP_REGISTRY[currentStep];
  const StepComponent = activeStep.component;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Registry Navigation */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-black font-display tracking-tight dark:text-white">LendSwift</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Production Loan Portal</p>
            </div>

            <nav className="space-y-4">
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
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-500 text-left group relative overflow-hidden",
                      isActive 
                        ? "bg-white border-primary-600 shadow-2xl shadow-primary-600/10 dark:bg-slate-900 dark:border-primary-500 scale-[1.02] z-10" 
                        : isCompleted
                        ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-900/20 opacity-80"
                        : "bg-transparent border-slate-100 dark:border-slate-800 opacity-40 grayscale pointer-events-none"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                      isActive ? "bg-primary-600 text-white rotate-3 shadow-lg shadow-primary-600/30" : 
                      isCompleted ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                    )}>
                      {isCompleted ? <ShieldCheck size={24} /> : <step.icon size={22} />}
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                        isActive ? "text-primary-600" : "text-slate-400"
                      )}>
                        Step {index + 1}
                      </p>
                      <p className="text-sm font-black truncate dark:text-white">{step.title}</p>
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                  <AlertCircle size={16} />
                </div>
                <p className="text-xs font-bold dark:text-white">Auto-save active</p>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Orchestration Layer */}
        <main className="flex-1 min-w-0 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 lg:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none min-h-[600px] flex flex-col"
            >
              <div className="flex-1">
                <Suspense fallback={
                  <div className="space-y-8">
                    <Skeleton className="h-12 w-2/3" />
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-2 gap-6">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                }>
                  <StepComponent />
                </Suspense>
              </div>

              <footer className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={goToPrevStep}
                  disabled={isFirstStep}
                  className="btn-secondary h-14 px-8 rounded-2xl flex items-center gap-3 disabled:opacity-0 disabled:pointer-events-none group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold">Previous</span>
                </button>

                <button
                  type="submit"
                  form="wizard-step-form"
                  className="btn-primary h-14 px-12 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary-600/20 group"
                >
                  <span className="font-bold">{isLastStep ? 'Submit Application' : 'Continue'}</span>
                  {!isLastStep && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </footer>
            </motion.div>
          </AnimatePresence>

          {/* Progressive Progress Header */}
          <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Overall Completion</p>
                <p className="text-lg font-black text-primary-600">{Math.round((currentStep / (totalSteps - 1)) * 100)}%</p>
              </div>
              <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                <motion.div 
                  className="h-full bg-primary-600 rounded-full shadow-lg shadow-primary-600/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const LoanWizard = () => {
  const [showResume, setShowResume] = useState(false);
  const resetStore = useLoanStore((state) => state.resetStore);
  const formData = useLoanStore((state) => state.formData);

  useEffect(() => {
    // Check if there's existing data to resume
    if (Object.keys(formData).length > 0) {
      setShowResume(true);
    }
  }, [formData]);

  if (showResume) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-10 max-w-lg w-full text-center space-y-8 shadow-2xl border-2 border-primary-100"
        >
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-600">
            <RotateCcw size={40} className="animate-spin-slow" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-display">Resume Application?</h2>
            <p className="text-slate-500">We found an incomplete application. Would you like to continue from where you left off?</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={resetStore}
              className="btn-secondary h-12 rounded-xl font-bold"
            >
              Start New
            </button>
            <button 
              onClick={() => setShowResume(false)}
              className="btn-primary h-12 rounded-xl font-bold shadow-lg shadow-primary-600/20"
            >
              Resume
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <WizardProvider>
      <WizardInner />
    </WizardProvider>
  );
};

export default LoanWizard;
