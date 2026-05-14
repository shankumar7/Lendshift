import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ChevronRight,
  Edit3,
  CheckCircle2,
  Lock,
  FileText,
  User,
  MapPin,
  Briefcase,
  Users,
  PenTool,
  Loader2,
  Scan,
  Database,
  Shield,
  FileCheck,
  Download,
  PartyPopper,
  Clock,
  ArrowRight,
  Info,
  X,
  CreditCard,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';

const ReviewSection = ({ title, icon: Icon, data, onEdit, isComplete }) => (
  <div className="p-8 rounded-[2.5rem] bg-white border border-[#EEEEEE] group hover:border-[#121212] transition-all duration-500">
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-[#121212] group-hover:bg-[#121212] group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="text-xl font-serif italic">{title}</h4>
            {isComplete && <CheckCircle2 size={14} className="text-[#2E7D32]" />}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
            Institutional Verification Complete
          </p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="p-3 hover:bg-[#F8F9FA] rounded-full text-[#888888] hover:text-[#121212] transition-all"
      >
        <Edit3 size={16} />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#888888]">
            {key.replace(/([A-Z])/g, ' $1')}
          </p>
          <p className="text-xs font-bold text-[#121212] truncate">
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '—'}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SubmissionStep = ({ label, status }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        {status === 'complete' ? (
          <CheckCircle2 size={14} className="text-[#4CAF50]" />
        ) : (
          <Loader2 size={14} className="animate-spin text-[#0065FF]" />
        )}
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-white/60">{label}</span>
    </div>
    {status === 'complete' && (
      <span className="text-[10px] font-black text-[#4CAF50] uppercase">Secure</span>
    )}
  </div>
);

const ReviewStep = () => {
  const { formData, setStep, submitApplication } = useLoanStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const stages = [
    'Encrypting Documents (AES-256)',
    'Running Compliance Validation',
    'Packaging Underwriting Dossier',
    'Institutional Transmission',
    'Finalizing Application',
  ];

  useEffect(() => {
    if (isSubmitting && submissionStage < stages.length) {
      const timer = setTimeout(() => {
        setSubmissionStage((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, submissionStage]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await submitApplication();
  };

  const underwritingMetrics = useMemo(() => {
    const income = formData.employment.monthlyIncome || 0;
    const emis = formData.employment.existingEmis || 0;
    const dti = income > 0 ? (emis / income) * 100 : 0;

    return {
      score: Math.round(450 + income / 1000 - dti * 5),
      confidence: 94,
      processingTime: '24-48 Hours',
      eligibility: formData.loanSelection.amount * 1.2,
    };
  }, [formData.employment, formData.loanSelection]);

  if (formData.submission.status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[600px] flex flex-col items-center justify-center text-center space-y-12 py-12"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-32 h-32 rounded-[2.5rem] bg-[#121212] text-white flex items-center justify-center relative z-10"
          >
            <PartyPopper size={48} />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[#0065FF] rounded-full blur-3xl -z-10"
          />
        </div>

        <div className="space-y-4 max-w-xl">
          <p className="text-meta text-[#0065FF]">Application Successful</p>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif italic tracking-tighter">
            Underwriting Initiated
          </h2>
          <p className="text-lg text-[#888888] leading-relaxed">
            Your application <strong>{formData.submission.applicationId}</strong> has been
            transmitted to our institutional vault. A confirmation email has been dispatched to{' '}
            <strong>{formData.personalInfo.email}</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl pt-12">
          <div className="p-8 rounded-[2rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-4">
            <Clock size={24} className="mx-auto text-[#888888]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                Review Window
              </p>
              <p className="text-xs text-[#888888]">Estimated 24-48 Hours</p>
            </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-4">
            <ShieldCheck size={24} className="mx-auto text-[#2E7D32]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                Compliance
              </p>
              <p className="text-xs text-[#888888]">100% Verified</p>
            </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-4">
            <CreditCard size={24} className="mx-auto text-[#0065FF]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                Disbursement
              </p>
              <p className="text-xs text-[#888888]">Instant via IMPS/NEFT</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="h-16 px-12 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 group">
            Download Summary{' '}
            <Download size={16} className="group-hover:translate-y-1 transition-transform" />
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="h-16 px-12 rounded-2xl bg-white border border-[#EEEEEE] text-[10px] font-black uppercase tracking-widest flex items-center justify-center"
          >
            Back to Home
          </button>
        </div>

        <div className="w-full max-w-2xl pt-12 space-y-8">
          <div className="flex justify-between items-center px-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
              Tracking Timeline
            </p>
            <span className="text-[9px] font-mono text-[#0065FF] uppercase">
              Live Updates Enabled
            </span>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-[15px] bottom-0 w-0.5 bg-[#EEEEEE]" />
            <div className="space-y-10 relative">
              {formData.submission.tracking.map((t, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${t.status === 'completed' ? 'bg-[#121212] text-white' : 'bg-white border-2 border-[#EEEEEE] text-[#888888]'}`}
                  >
                    {t.status === 'completed' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${t.status === 'completed' ? 'text-[#121212]' : 'text-[#888888]'}`}
                    >
                      {t.stage}
                    </p>
                    <p className="text-[9px] font-mono text-[#888888] mt-1">
                      {t.status === 'completed'
                        ? `Verified on ${new Date(t.date).toLocaleDateString()}`
                        : 'Awaiting Processing'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-[600px] bg-[#121212] rounded-[3rem] p-12 lg:p-24 flex flex-col items-center justify-center text-white space-y-16 overflow-hidden relative">
        {/* Animated Background Gradients */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#0065FF]/10 rounded-full blur-[120px]"
        />

        <div className="relative z-10 space-y-6 sm:y-8 text-center max-w-2xl">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 sm:mb-12">
            <Loader2 size={32} sm:size={40} className="animate-spin text-[#0065FF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-serif italic">
            Transmitting Application
          </h2>
          <p className="text-sm sm:text-lg text-white/40 leading-relaxed uppercase tracking-widest font-mono">
            Do not close this window. Your data is being encrypted and packaged for underwriting
            review.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4 relative z-10">
          {stages.map((label, i) => (
            <SubmissionStep
              key={i}
              label={label}
              status={i < submissionStage ? 'complete' : 'loading'}
            />
          ))}
        </div>

        <div className="pt-12 text-center relative z-10">
          <div className="flex items-center gap-4 justify-center text-white/40 mb-4">
            <Lock size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">
              AES-256 Bit Encryption Active
            </span>
          </div>
          <div className="w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(submissionStage / stages.length) * 100}%` }}
              className="h-full bg-[#0065FF]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      <div className="flex-1 space-y-12">
        <div className="space-y-4">
          <p className="text-meta">Final Step</p>
          <h3 className="text-3xl font-serif italic text-[#121212]">Application Summary</h3>
          <p className="text-sm text-[#888888] leading-relaxed">
            Please review all information before institutional submission. Edits made at this stage
            will update the global application state.
          </p>
        </div>

        <div className="space-y-6">
          <ReviewSection
            title="Loan Profile"
            icon={CheckCircle2}
            data={{
              Type: formData.loanSelection.loanType,
              Amount: `₹${formData.loanSelection.amount.toLocaleString('en-IN')}`,
              Tenure: `${formData.loanSelection.tenure} Months`,
              Purpose: formData.loanSelection.purpose,
            }}
            onEdit={() => setStep(1)}
            isComplete={true}
          />

          <ReviewSection
            title="Personal Details"
            icon={User}
            data={{
              FullName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
              Mobile: formData.personalInfo.mobileNumber,
              Email: formData.personalInfo.email,
              PAN: formData.personalInfo.panCard,
            }}
            onEdit={() => setStep(2)}
            isComplete={true}
          />

          <ReviewSection
            title="Identity Verification"
            icon={Scan}
            data={{
              PANStatus: 'Verified',
              AadhaarStatus: 'Verified',
              FaceMatch: '98% Confirmed',
            }}
            onEdit={() => setStep(3)}
            isComplete={true}
          />

          <ReviewSection
            title="Residency"
            icon={MapPin}
            data={{
              City: formData.address.current.city,
              State: formData.address.current.state,
              PIN: formData.address.current.pincode,
              Residence: formData.address.current.residenceType,
            }}
            onEdit={() => setStep(4)}
            isComplete={true}
          />

          <ReviewSection
            title="Employment"
            icon={Briefcase}
            data={{
              Type: formData.employment.type,
              Employer: formData.employment.employerName || formData.employment.businessName,
              MonthlyNet: `₹${formData.employment.monthlyIncome.toLocaleString('en-IN')}`,
            }}
            onEdit={() => setStep(5)}
            isComplete={true}
          />

          <ReviewSection
            title="Co-Applicant"
            icon={Users}
            data={{
              Included: formData.coApplicant.hasCoApplicant ? 'Yes' : 'No',
              Relation: formData.coApplicant.relation || 'N/A',
              CoIncome: `₹${formData.coApplicant.monthlyIncome?.toLocaleString('en-IN') || 0}`,
            }}
            onEdit={() => setStep(6)}
            isComplete={true}
          />

          <ReviewSection
            title="Documents"
            icon={FileCheck}
            data={{
              Uploaded: 'Required Dossier Complete',
              Signature: 'Digital Capture Verified',
              Compliance: 'Ready',
            }}
            onEdit={() => setStep(7)}
            isComplete={true}
          />
        </div>

        {/* Final Consent */}
        <section className="p-10 rounded-[3rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-8">
          <div className="flex items-start gap-6">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-6 h-6 mt-1 rounded border-[#EEEEEE] text-[#121212] focus:ring-[#121212]"
            />
            <div className="space-y-4">
              <p className="text-sm font-bold text-[#121212] leading-relaxed">
                I solemnly declare that all information provided is accurate and I authorize the
                final institutional credit assessment. I understand that any discrepancy may lead to
                immediate application rejection.
              </p>
              <button
                onClick={() => setShowDisclosure(true)}
                className="text-[10px] font-black uppercase tracking-widest text-[#0065FF] flex items-center gap-2"
              >
                View Institutional Disclosures <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            disabled={!consent}
            onClick={handleFinalSubmit}
            className="btn-primary h-18 px-16 group disabled:opacity-20 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            Submit Application
            <ChevronRight
              size={20}
              className="ml-3 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Underwriting Summary Side Panel */}
      <aside className="w-full xl:w-96 sticky top-32 space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
          <div className="relative space-y-8">
            <div>
              <p className="text-meta text-white/40">Final Assessment</p>
              <h4 className="text-2xl font-serif italic">Risk Profile</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1">
                  Approval Score
                </p>
                <p className="text-xl font-bold">{underwritingMetrics.score}</p>
                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(underwritingMetrics.score / 900) * 100}%` }}
                    className="h-full bg-[#4CAF50]"
                  />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-mono uppercase tracking-widest text-white/40 mb-1">
                  Confidence
                </p>
                <p className="text-xl font-bold">{underwritingMetrics.confidence}%</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Max Eligibility
                </span>
                <span className="text-sm font-bold">
                  ₹{underwritingMetrics.eligibility.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Processing Time
                </span>
                <span className="text-sm font-bold">{underwritingMetrics.processingTime}</span>
              </div>
            </div>

            <div className="p-4 bg-[#0065FF]/10 rounded-2xl border border-[#0065FF]/20 flex gap-3">
              <ShieldCheck size={18} className="text-[#0065FF] shrink-0" />
              <p className="text-[9px] font-mono leading-relaxed text-white/60 uppercase">
                Application data has been cross-verified with Credit Bureaus and Institutional Data
                Vaults.
              </p>
            </div>
          </div>
        </div>

        {/* Final Checklist */}
        <div className="p-8 rounded-[2.5rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-6">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
            Submission Readiness
          </h5>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                KYC Status
              </span>
              <div className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[8px] font-black uppercase rounded">
                Verified
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                Doc Verification
              </span>
              <div className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[8px] font-black uppercase rounded">
                Complete
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                Risk Assessment
              </span>
              <div className="px-2 py-1 bg-[#F0F7FF] text-[#0065FF] text-[8px] font-black uppercase rounded">
                Passed
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Disclosure Modal */}
      <AnimatePresence>
        {showDisclosure && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-white/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white rounded-[3rem] border border-[#EEEEEE] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[#EEEEEE] flex justify-between items-center bg-white">
                <div>
                  <p className="text-meta">Compliance</p>
                  <h4 className="text-2xl font-serif italic">Institutional Disclosure</h4>
                </div>
                <button
                  onClick={() => setShowDisclosure(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6 text-sm text-[#888888] leading-relaxed">
                <p>
                  LendSwift operates under strict regulatory guidelines. By submitting this
                  application, you acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Data is shared with RBI-licensed credit bureaus for assessment.</li>
                  <li>Interest rates are dynamic and subject to final underwriting approval.</li>
                  <li>Processing fees are non-refundable once disbursement is initiated.</li>
                  <li>LendSwift maintains a zero-tolerance policy for fraudulent documentation.</li>
                </ul>
              </div>
              <div className="p-8 bg-[#F8F9FA] border-t border-[#EEEEEE] flex justify-end">
                <button
                  onClick={() => setShowDisclosure(false)}
                  className="px-12 h-14 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewStep;
