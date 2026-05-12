import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useLoanStore = create(
  persist(
    (set) => ({
      // Current Application State
      currentStep: 1,
      lastSaved: null,
      isResumeModalOpen: false,

      // Form Data Structure
      formData: {
        loanSelection: {
          loanType: 'personal',
          amount: 500000,
          tenure: 12,
          purpose: '',
          employmentType: '',
          monthlyIncome: 50000,
        },
        personalInfo: {
          firstName: '',
          middleName: '',
          lastName: '',
          dob: '',
          gender: '',
          maritalStatus: '',
          spouseName: '',
          mobileNumber: '',
          altMobileNumber: '',
          email: '',
          panCard: '',
          aadhaar: '',
          occupation: '',
          education: '',
          annualIncome: 0,
          isMobileVerified: false,
          isPanVerified: false,
          isAadhaarVerified: false,
        },
        kyc: {
          panNumber: '',
          aadhaarNumber: '',
          idType: '',
          idNumber: '',
          isPanVerified: false,
          isAadhaarVerified: false,
          isFaceVerified: false,
          faceMatchScore: 0,
        },
        address: {
          current: {
            street: '',
            city: '',
            state: '',
            zip: '',
          },
          permanentSameAsCurrent: true,
        },
        employment: {
          type: '', // 'salaried', 'self-employed'
          employerName: '',
          monthlyIncome: '',
          workExp: '',
        },
        coApplicant: {
          hasCoApplicant: false,
          name: '',
          relation: '',
        },
        documents: {
          panCard: null,
          aadhaarCard: null,
          secondaryId: null,
          selfie: null,
        },
        submission: {
          status: 'idle', // 'idle', 'submitting', 'success', 'error'
          timestamp: null,
        },
      },

      // Actions
      setStep: (step) => set({ currentStep: step }),

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

      resetApplication: () =>
        set({
          currentStep: 1,
          formData: {
            loanSelection: {
              loanType: 'personal',
              amount: 500000,
              tenure: 12,
              purpose: '',
              employmentType: '',
              monthlyIncome: 50000,
            },
            personalInfo: {
              firstName: '',
              middleName: '',
              lastName: '',
              dob: '',
              gender: '',
              maritalStatus: '',
              spouseName: '',
              mobileNumber: '',
              altMobileNumber: '',
              email: '',
              panCard: '',
              aadhaar: '',
              occupation: '',
              education: '',
              annualIncome: 0,
              isMobileVerified: false,
              isPanVerified: false,
              isAadhaarVerified: false,
            },
            kyc: {
              panNumber: '',
              aadhaarNumber: '',
              idType: '',
              idNumber: '',
              isPanVerified: false,
              isAadhaarVerified: false,
              isFaceVerified: false,
              faceMatchScore: 0,
            },
            address: {
              current: { street: '', city: '', state: '', zip: '' },
              permanentSameAsCurrent: true,
            },
            employment: { type: '', employerName: '', monthlyIncome: '', workExp: '' },
            coApplicant: { hasCoApplicant: false, name: '', relation: '' },
            documents: {
              panCard: null,
              aadhaarCard: null,
              secondaryId: null,
              selfie: null,
            },
            submission: { status: 'idle', timestamp: null },
          },
        }),

      setResumeModal: (isOpen) => set({ isResumeModalOpen: isOpen }),

      saveProgress: () => set({ lastSaved: new Date().toISOString() }),
    }),
    {
      name: 'lendswift-loan-app',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLoanStore;
