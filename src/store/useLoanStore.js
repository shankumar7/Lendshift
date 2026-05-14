import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useLoanStore = create(
  persist(
    (set) => ({
      // Current Application State
      currentStep: 1,
      lastSaved: null,
      isResumeModalOpen: false,
      isCorrupted: false,
      isInitialized: false, // For session recovery lifecycle

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
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            residenceType: '',
            monthlyRent: '',
            landlordName: '',
            durationAtAddress: '',
          },
          previous: {
            addressLine1: '',
            city: '',
            state: '',
            pincode: '',
            duration: '',
          },
          permanent: {
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
          },
          isPermanentSameAsCurrent: true,
          isGeoVerified: false,
          geoCoords: null,
          addressProofType: '',
        },
        employment: {
          // Dynamic fields based on type
          type: '', // salaried, self-employed, business, freelancer, retired
          employerName: '',
          designation: '',
          industryType: '',
          workExp: '',
          monthlyIncome: 0,
          salaryCreditBank: '',
          salaryCreditDate: '',
          employmentStatus: '', // permanent, contract, probation

          professionType: '',
          yearsInPractice: '',
          annualRevenue: 0,
          isGstRegistered: false,
          gstNumber: '',
          businessCategory: '',

          businessName: '',
          businessType: '',
          annualTurnover: 0,
          employeeCount: '',
          yearsInOperation: '',

          primarySkill: '',
          platformsUsed: '',
          clientBaseType: '',

          pensionAmount: 0,
          retirementYear: '',
          previousProfession: '',

          // Banking & Obligations
          bankName: '',
          accountType: '',
          ifscCode: '',
          monthlyObligations: 0,
          existingEmis: 0,
        },
        coApplicant: {
          hasCoApplicant: false,
          relation: '',
          fullName: '',
          dob: '',
          gender: '',
          mobile: '',
          email: '',
          pan: '',
          aadhaar: '',
          employmentType: '',
          employerName: '',
          monthlyIncome: 0,
          existingEmis: 0,
          isMobileVerified: false,
          isPanVerified: false,
          isAadhaarVerified: false,
          signature: null,
          consent: false,
        },
        documents: {
          panCard: null,
          aadhaarCard: null,
          secondaryId: null,
          selfie: null,
          addressProof: null,
          incomeProof: null,
          bankStatements: null,
          propertyPapers: null,
          gstCertificate: null,
          itrDocs: null,
          primarySignature: null,
          agreementAccepted: false,
          verificationStatus: {}, // { docId: 'pending' | 'processing' | 'verified' }
        },
        submission: {
          status: 'idle', // idle | submitting | success | error
          applicationId: null,
          timestamp: null,
          tracking: [
            { stage: 'Submission', status: 'completed', date: null },
            { stage: 'Verification', status: 'pending', date: null },
            { stage: 'Underwriting', status: 'pending', date: null },
            { stage: 'Disbursement', status: 'pending', date: null },
          ],
        },
      },

      // Actions
      setStep: (step) => set({ currentStep: step }),
      setInitialized: (val) => set({ isInitialized: val }),

      updateFormData: (section, data) =>
        set((state) => ({
          lastSaved: new Date().toISOString(),
          formData: {
            ...state.formData,
            [section]: {
              ...state.formData[section],
              ...data,
            },
          },
        })),

      clearEmploymentData: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            employment: {
              ...state.formData.employment,
              employerName: '',
              designation: '',
              industryType: '',
              workExp: '',
              monthlyIncome: 0,
              salaryCreditBank: '',
              salaryCreditDate: '',
              employmentStatus: '',
              professionType: '',
              yearsInPractice: '',
              annualRevenue: 0,
              isGstRegistered: false,
              gstNumber: '',
              businessCategory: '',
              businessName: '',
              businessType: '',
              annualTurnover: 0,
              employeeCount: '',
              yearsInOperation: '',
              primarySkill: '',
              platformsUsed: '',
              clientBaseType: '',
              pensionAmount: 0,
              retirementYear: '',
              previousProfession: '',
            },
          },
        })),

      submitApplication: async () => {
        set((state) => ({
          formData: {
            ...state.formData,
            submission: { ...state.formData.submission, status: 'submitting' },
          },
        }));

        // Simulation will be handled in the component for UI feedback
        // But we update store state here
        return new Promise((resolve) => {
          setTimeout(() => {
            const appId = `LS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const now = new Date().toISOString();
            set((state) => ({
              formData: {
                ...state.formData,
                submission: {
                  ...state.formData.submission,
                  status: 'success',
                  applicationId: appId,
                  timestamp: now,
                  tracking: state.formData.submission.tracking.map((t, i) =>
                    i === 0 ? { ...t, date: now } : t
                  ),
                },
              },
            }));
            resolve(appId);
          }, 6000);
        });
      },

      resetApplication: () =>
        set({
          currentStep: 1,
          isCorrupted: false,
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
                addressLine1: '',
                addressLine2: '',
                landmark: '',
                city: '',
                state: '',
                country: 'India',
                pincode: '',
                residenceType: '',
                monthlyRent: '',
                landlordName: '',
                durationAtAddress: '',
              },
              previous: {
                addressLine1: '',
                city: '',
                state: '',
                pincode: '',
                duration: '',
              },
              permanent: {
                addressLine1: '',
                addressLine2: '',
                landmark: '',
                city: '',
                state: '',
                country: 'India',
                pincode: '',
              },
              isPermanentSameAsCurrent: true,
              isGeoVerified: false,
              geoCoords: null,
              addressProofType: '',
            },
            employment: {
              type: '',
              employerName: '',
              monthlyIncome: 0,
              workExp: '',
              ifscCode: '',
              bankName: '',
              accountType: '',
              monthlyObligations: 0,
              existingEmis: 0,
            },
            coApplicant: {
              hasCoApplicant: false,
              relation: '',
              fullName: '',
              dob: '',
              gender: '',
              mobile: '',
              email: '',
              pan: '',
              aadhaar: '',
              employmentType: '',
              employerName: '',
              monthlyIncome: 0,
              existingEmis: 0,
              isMobileVerified: false,
              isPanVerified: false,
              isAadhaarVerified: false,
              signature: null,
              consent: false,
            },
            documents: {
              panCard: null,
              aadhaarCard: null,
              secondaryId: null,
              selfie: null,
              addressProof: null,
              incomeProof: null,
              bankStatements: null,
              propertyPapers: null,
              gstCertificate: null,
              itrDocs: null,
              primarySignature: null,
              agreementAccepted: false,
              verificationStatus: {},
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
      onRehydrateStorage: () => {
        return (rehydratedState, error) => {
          if (error || !rehydratedState) {
            useLoanStore.setState({ isCorrupted: true });
          }
        };
      },
    }
  )
);

export default useLoanStore;
