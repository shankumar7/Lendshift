import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoanWizard from './pages/LoanWizard';
import SuccessPage from './pages/SuccessPage';
import StaticPage from './pages/StaticPage';
import './styles/globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<LoanWizard />} />
        <Route path="/apply/step/:stepId" element={<LoanWizard />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Capital Pages */}
        <Route 
          path="/personal" 
          element={<StaticPage title="Personal" category="Capital" description="Liquidity solutions for individual growth and asset management." />} 
        />
        <Route 
          path="/enterprise" 
          element={<StaticPage title="Enterprise" category="Capital" description="Deep-tier working capital for high-growth organizations." />} 
        />
        <Route 
          path="/mortgage" 
          element={<StaticPage title="Mortgage" category="Capital" description="Institutional-grade property and fixed-asset financing." />} 
        />
        <Route 
          path="/markets" 
          element={<StaticPage title="Markets" category="Capital" description="Secondary market liquidity and institutional capital placement." />} 
        />

        {/* Identity Pages */}
        <Route 
          path="/about" 
          element={<StaticPage title="About" category="Identity" description="The intersection of institutional stability and digital agility." />} 
        />
        <Route 
          path="/vision" 
          element={<StaticPage title="Vision" category="Identity" description="Architecting the future of global liquidity through atomic settlement." />} 
        />
        <Route 
          path="/careers" 
          element={<StaticPage title="Careers" category="Identity" description="Join the team building the next generation of financial infrastructure." />} 
        />
        <Route 
          path="/ethics" 
          element={<StaticPage title="Ethics" category="Identity" description="Absolute transparency and algorithmic fairness in every decision." />} 
        />

        {/* Network Pages */}
        <Route 
          path="/institutional" 
          element={<StaticPage title="Institutional" category="Network" description="Dedicated infrastructure for banking partners and credit entities." />} 
        />
        <Route 
          path="/support" 
          element={<StaticPage title="Support" category="Network" description="Technical and account assistance for the LendSwift ecosystem." />} 
        />
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
