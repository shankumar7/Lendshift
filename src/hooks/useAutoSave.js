import { useEffect, useRef } from 'react';
import useLoanStore from '@/store/useLoanStore';
import { toast } from 'react-hot-toast';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = (currentData, stepId) => {
  const updateStepData = useLoanStore((state) => state.updateStepData);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      // Only save if data has changed
      const dataString = JSON.stringify(currentData);
      if (lastSavedRef.current !== dataString) {
        updateStepData(stepId, currentData);
        lastSavedRef.current = dataString;
        
        // Silent toast for feedback if needed, but usually silent is better for UX
        console.log(`[LendSwift] Auto-saved step: ${stepId}`);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [currentData, stepId, updateStepData]);

  // Initial save on unmount or blur if needed
  useEffect(() => {
    return () => {
      updateStepData(stepId, currentData);
    };
  }, [stepId, currentData, updateStepData]);
};
