import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLoanStore from '@/store/useLoanStore';
import { STEP_REGISTRY } from '@/registry/stepRegistry';
import { toast } from 'react-hot-toast';

const WizardContext = createContext(null);

export const WizardProvider = ({ children }) => {
  const { 
    currentStep, 
    setStep, 
    formData, 
    updateStepData,
    isSubmitted 
  } = useLoanStore();

  const totalSteps = STEP_REGISTRY.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
      // Focus management: move focus to the top of the new step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, totalSteps, setStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, setStep]);

  const canNavigateToStep = useCallback((targetStepIndex) => {
    // Prevent skipping steps
    if (targetStepIndex > currentStep + 1) return false;
    // Allow going back
    if (targetStepIndex < currentStep) return true;
    return true;
  }, [currentStep]);

  const handleStepNavigation = useCallback((index) => {
    if (canNavigateToStep(index)) {
      setStep(index);
    } else {
      toast.error('Please complete the current step first.');
    }
  }, [canNavigateToStep, setStep]);

  const value = useMemo(() => ({
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPrevStep,
    handleStepNavigation,
    formData,
    updateStepData,
    isSubmitted
  }), [
    currentStep, 
    totalSteps, 
    isFirstStep, 
    isLastStep, 
    goToNextStep, 
    goToPrevStep, 
    handleStepNavigation, 
    formData, 
    updateStepData,
    isSubmitted
  ]);

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
