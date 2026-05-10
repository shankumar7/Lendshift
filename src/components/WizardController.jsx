import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoanStore from '@/store/useLoanStore';
import { STEP_REGISTRY } from '@/registry/stepRegistry';
import { toast } from 'react-hot-toast';
import { WizardContext } from '@/context/WizardContext';

export const WizardProvider = ({ children }) => {
  const { 
    currentStep, 
    setStep, 
    formData, 
    updateStepData,
    isSubmitted 
  } = useLoanStore();

  const navigate = useNavigate();
  const totalSteps = STEP_REGISTRY.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const updateStepInUrl = useCallback((stepIndex) => {
    const stepId = STEP_REGISTRY[stepIndex].id;
    navigate(`/apply/step/${stepId}`);
  }, [navigate]);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextIndex = currentStep + 1;
      setStep(nextIndex);
      updateStepInUrl(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/success');
    }
  }, [currentStep, totalSteps, setStep, updateStepInUrl, navigate]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setStep(prevIndex);
      updateStepInUrl(prevIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, setStep, updateStepInUrl]);

  const canNavigateToStep = useCallback((targetStepIndex) => {
    if (targetStepIndex > currentStep + 1) return false;
    return true;
  }, [currentStep]);

  const handleStepNavigation = useCallback((index) => {
    if (canNavigateToStep(index)) {
      setStep(index);
      updateStepInUrl(index);
    } else {
      toast.error('Please complete the current step first.');
    }
  }, [canNavigateToStep, setStep, updateStepInUrl]);

  const value = useMemo(() => ({
    currentStep,
    setStep,
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
    setStep,
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
