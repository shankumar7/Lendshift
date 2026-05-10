import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Session TTL: 24 hours
const SESSION_TTL = 24 * 60 * 60 * 1000;

const initialState = {
  currentStep: 0,
  isResuming: false,
  formData: {},
  dirtyFields: {},
  lastSaved: null,
  isSubmitted: false,
};

const useLoanStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      updateStepData: (stepId, data, dirtyFields = {}) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [stepId]: {
              ...state.formData[stepId],
              ...data,
            },
          },
          dirtyFields: {
            ...state.dirtyFields,
            [stepId]: {
              ...state.dirtyFields[stepId],
              ...dirtyFields,
            },
          },
          lastSaved: Date.now(),
        }));
      },

      setResuming: (status) => set({ isResuming: status }),

      resetStore: () => {
        localStorage.removeItem('lendswift-application-storage');
        set(initialState);
      },

      clearStepData: (stepId) => {
        set((state) => {
          const newFormData = { ...state.formData };
          delete newFormData[stepId];
          return { formData: newFormData };
        });
      },

      checkSessionExpiry: () => {
        const { lastSaved } = get();
        if (lastSaved && Date.now() - lastSaved > SESSION_TTL) {
          get().resetStore();
          return true;
        }
        return false;
      },
    }),
    {
      name: 'lendswift-application-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkSessionExpiry();
        }
      },
    }
  )
);

export default useLoanStore;
