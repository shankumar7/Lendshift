import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoanWizard = lazy(() => import('@/pages/LoanWizard'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Landing Experience */}
        <Route path="/" element={<LandingPage />} />

        {/* Multi-Step Onboarding Flow */}
        <Route path="/apply" element={<LoanWizard />} />
        <Route path="/apply/step/:stepId" element={<LoanWizard />} />

        {/* Post-Application Experience */}
        <Route path="/success" element={<SuccessPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
