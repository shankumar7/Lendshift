import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoanWizard from './pages/LoanWizard';
import SuccessPage from './pages/SuccessPage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<LoanWizard />} />
        <Route path="/apply/step/:stepId" element={<LoanWizard />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800',
          duration: 3000,
        }}
      />
    </BrowserRouter>
  );
};

export default App;
