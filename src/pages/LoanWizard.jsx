import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useLoanStore from '@/store/useLoanStore';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileUp, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Import actual step forms
import PersonalInfoForm from '@/forms/PersonalInfoForm';
import EmploymentInfoForm from '@/forms/EmploymentInfoForm';
import LoanDetailsForm from '@/forms/LoanDetailsForm';

const DocumentStep = () => (
  <div className="space-y-6">
    <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-4 hover:border-primary-500 transition-colors cursor-pointer">
      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-full flex items-center justify-center mx-auto">
        <FileUp size={32} />
      </div>
      <div>
        <p className="font-bold">Upload Identity Proof</p>
        <p className="text-sm text-slate-500">Drag and drop your Passport or Driver's License</p>
      </div>
      <button className="btn-secondary text-xs">Browse Files</button>
    </div>
  </div>
);

const ReviewStep = () => {
  const { formData } = useLoanStore();
  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-lg flex gap-3 text-emerald-700 dark:text-emerald-400">
        <ShieldCheck className="shrink-0" />
        <p className="text-sm">Please review your information carefully before submitting. This will be used for your credit check.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400">Personal Info</h4>
          <p className="text-sm font-medium">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
          <p className="text-sm text-slate-500">{formData.personalInfo.email}</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400">Loan Details</h4>
          <p className="text-sm font-medium">${formData.loanDetails.loanAmount}</p>
          <p className="text-sm text-slate-500">{formData.loanDetails.termMonths} Months</p>
        </div>
      </div>
    </div>
  );
};

const steps = [
  { id: 1, title: 'Personal', icon: User, section: 'personalInfo' },
  { id: 2, title: 'Employment', icon: Briefcase, section: 'employmentInfo' },
  { id: 3, title: 'Loan Details', icon: DollarSign, section: 'loanDetails' },
  { id: 4, title: 'Documents', icon: FileUp, section: 'documents' },
  { id: 5, title: 'Review', icon: CheckCircle, section: null },
];

const LoanWizard = () => {
  const { currentStep, nextStep, prevStep, setStep, formData, updateFormData } = useLoanStore();
  
  const handleFormSubmit = (data) => {
    const currentSection = steps[currentStep - 1].section;
    if (currentSection) {
      updateFormData(currentSection, data);
    }
    
    if (currentStep < steps.length) {
      nextStep();
      toast.success('Progress saved!');
    } else {
      toast.success('Application submitted successfully!');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoForm onSubmit={handleFormSubmit} defaultValues={formData.personalInfo} />;
      case 2: return <EmploymentInfoForm onSubmit={handleFormSubmit} defaultValues={formData.employmentInfo} />;
      case 3: return <LoanDetailsForm onSubmit={handleFormSubmit} defaultValues={formData.loanDetails} />;
      case 4: return <DocumentStep />;
      case 5: return <ReviewStep />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display tracking-tight dark:text-white">Loan Application</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Complete the following steps to start your journey with LendSwift.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 shrink-0">
          <nav className="space-y-3 sticky top-8">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setStep(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group",
                  currentStep === step.id
                    ? "bg-white border-primary-600 shadow-xl shadow-primary-600/5 dark:bg-slate-900 dark:border-primary-500"
                    : currentStep > step.id
                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/5 dark:border-emerald-900/20 dark:text-emerald-400"
                    : "bg-transparent border-slate-100 text-slate-400 dark:border-slate-800 opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
                  currentStep === step.id ? "bg-primary-600 text-white" : 
                  currentStep > step.id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  {currentStep > step.id ? <CheckCircle size={22} /> : <step.icon size={20} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60">Step 0{step.id}</p>
                  <p className="text-sm font-bold truncate">{step.title}</p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Form Content Area */}
        <div className="flex-1 space-y-8">
          <motion.div 
            className="card p-8 lg:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 dark:bg-primary-900/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[350px]"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary px-8 flex items-center gap-2 disabled:opacity-0 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                
                {/* Submit button is external to the forms, so we use the form ID to trigger submit */}
                {currentStep <= 3 ? (
                  <button
                    type="submit"
                    form="step-form"
                    className="btn-primary px-10 flex items-center gap-2 group"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFormSubmit({})}
                    className="btn-primary px-10 flex items-center gap-2 group"
                  >
                    {currentStep === steps.length ? 'Submit Application' : 'Continue'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Detailed Progress Indicator */}
          <div className="card p-6 border-l-4 border-l-primary-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold dark:text-white">Application Progress</p>
                <p className="text-xs text-slate-500">You're almost there! Just a few more details.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-primary-600">{Math.round(((currentStep - 1) / steps.length) * 100)}%</span>
              </div>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className="h-full bg-primary-600 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanWizard;
