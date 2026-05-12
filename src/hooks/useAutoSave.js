import { useEffect, useRef } from 'react';
import useLoanStore from '../store/useLoanStore';

const useAutoSave = (interval = 30000) => {
  const saveProgress = useLoanStore((state) => state.saveProgress);
  const formData = useLoanStore((state) => state.formData);
  const timerRef = useRef(null);
  const lastDataRef = useRef(JSON.stringify(formData));

  useEffect(() => {
    // Check for changes every interval
    timerRef.current = setInterval(() => {
      const currentData = JSON.stringify(formData);

      // Only save if data has actually changed
      if (currentData !== lastDataRef.current) {
        saveProgress();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [formData, saveProgress, interval]);

  return null;
};

export default useAutoSave;
