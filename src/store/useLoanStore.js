import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLoanStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      totalSteps: 5,
      formData: {
        personalInfo: {},
        employmentInfo: {},
        loanDetails: {},
        documents: [],
        signature: null,
      },
      isCompleted: false,
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      updateFormData: (section, data) => 
        set((state) => ({
          formData: {
            ...state.formData,
            [section]: {
              ...state.formData[section],
              ...data,
            },
          },
        })),
        
      resetForm: () => set({
        currentStep: 1,
        formData: {
          personalInfo: {},
          employmentInfo: {},
          loanDetails: {},
          documents: [],
          signature: null,
        },
        isCompleted: false,
      }),
      
      setCompleted: (status) => set({ isCompleted: status }),
    }),
    {
      name: 'lendswift-application-storage',
    }
  )
);

export default useLoanStore;
