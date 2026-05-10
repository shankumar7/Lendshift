import { useEffect, useRef } from 'react';
import useLoanStore from '@/store/useLoanStore';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = (currentData, stepId) => {
  const updateStepData = useLoanStore((state) => state.updateStepData);
  const lastSavedRef = useRef(null);
  const currentDataRef = useRef(currentData);

  // Keep ref in sync with latest data without triggering effects
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  // Interval-based auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      const dataString = JSON.stringify(currentDataRef.current);
      if (lastSavedRef.current !== dataString) {
        updateStepData(stepId, currentDataRef.current);
        lastSavedRef.current = dataString;
        console.log(`[LendSwift] Periodic auto-save: ${stepId}`);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [stepId, updateStepData]);

  // Final save on unmount only
  useEffect(() => {
    return () => {
      if (currentDataRef.current) {
        updateStepData(stepId, currentDataRef.current);
        console.log(`[LendSwift] Final auto-save on unmount: ${stepId}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]); // Only run on unmount or if stepId changes
};
