import { useEffect, useRef } from 'react';

const useAccessibility = (currentStep) => {
  const announcementRef = useRef(null);

  // Announce step change to screen readers
  useEffect(() => {
    const announcement = `Navigated to Step ${currentStep}. Please complete the required information.`;
    if (announcementRef.current) {
      announcementRef.current.innerText = announcement;
    }

    // Move focus to the top of the form or the first heading
    const firstHeading = document.querySelector('h3, h2');
    if (firstHeading) {
      firstHeading.setAttribute('tabindex', '-1');
      firstHeading.focus();
    }
  }, [currentStep]);

  return { announcementRef };
};

export default useAccessibility;
