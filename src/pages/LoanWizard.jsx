import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useLoanStore from '@/store/useLoanStore';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileUp, 
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Step components (Internal or imported)
const Step1 = () => <div className="space-y-4">
  <h2 className="text-xl font-bold">Personal Information</h2>
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">First Name</label>
      <input className="input-field" placeholder="John" />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Last Name</label>
      <input className="input-field" placeholder="Doe" />
    </div>
  </div>
</div>;

const Step2 = () => <div className="space-y-4">
  <h2 className="text-xl font-bold">Employment Details</h2>
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Employer Name</label>
      <input className="input-field" placeholder="Acme Corp" />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Job Title</label>
      <input className="input-field" placeholder="Software Engineer" />
    </div>
  </div>
</div>;

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Employment', icon: Briefcase },
  { id: 3, title: 'Loan Details', icon: DollarSign },
  { id: 4, title: 'Documents', icon: FileUp },
  { id: 5, title: 'Review', icon: CheckCircle },
];

const LoanWizard = () => {
  const { currentStep, nextStep, prevStep, setStep } = useLoanStore();
  
  const handleNext = () => nextStep();
  const handlePrev = () => prevStep();

  const ActiveStepComponent = [Step1, Step2, Step1, Step2, Step1][currentStep - 1];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display">Loan Application</h1>
        <p className="text-slate-500 mt-1">Complete the steps below to apply for your loan.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setStep(step.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                  currentStep === step.id
                    ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/10 dark:border-primary-900/50 dark:text-primary-400 ring-2 ring-primary-600/10"
                    : currentStep > step.id
                    ? "bg-white border-slate-200 text-emerald-600 dark:bg-slate-900 dark:border-slate-800"
                    : "bg-white border-slate-100 text-slate-400 dark:bg-slate-900 dark:border-slate-800 opacity-60"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  currentStep === step.id ? "bg-primary-600 text-white" : 
                  currentStep > step.id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">Step {step.id}</p>
                  <p className="text-sm font-semibold truncate">{step.title}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 space-y-6">
          <div className="card p-8 min-h-[400px] flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActiveStepComponent />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center gap-2 disabled:opacity-0"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                {currentStep === steps.length ? 'Submit Application' : 'Continue'}
                {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">Overall Progress</span>
              <span className="text-sm font-bold text-primary-600">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanWizard;
