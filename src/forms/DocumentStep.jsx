import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ShieldCheck,
  Lock,
  PenTool,
  X,
  Scan,
  Database,
  ArrowRight,
  ShieldAlert,
  Info,
  Banknote,
  MapPin,
  Building2,
  TrendingUp,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import documentSchema from '../schemas/documentSchema';

const DOC_TYPES = {
  panCard: { label: 'PAN Card', icon: FileText, req: true },
  aadhaarCard: { label: 'Aadhaar Card', icon: Lock, req: true },
  incomeProof: { label: 'Income Proof / Salary Slip', icon: Banknote, req: true },
  bankStatements: { label: '6 Months Bank Statements', icon: Database, req: true },
  addressProof: { label: 'Current Address Proof', icon: MapPin, req: true },
  gstCertificate: { label: 'GST Registration Certificate', icon: ShieldCheck, req: false },
  propertyPapers: { label: 'Property Title Documents', icon: Building2, req: false },
  itrDocs: { label: 'ITR Acknowledgement (2 Years)', icon: TrendingUp, req: false },
};

const DocumentCard = ({ id, label, icon: Icon, value, onUpload, onRemove, status }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onUpload(id, files[0]),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const getCardStyles = () => {
    if (value) return 'bg-[#F8F9FA] border-[#EEEEEE]';
    if (isDragActive) return 'bg-[#F0F7FF] border-[#0065FF] border-dashed';
    return 'bg-white border-[#EEEEEE] border-dashed hover:border-[#888888]';
  };

  return (
    <div className={`p-6 rounded-3xl border-2 transition-all duration-500 ${getCardStyles()}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${value ? 'bg-[#121212] text-white' : 'bg-[#F8F9FA] text-[#888888]'}`}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
              {label}
            </p>
            {value ? (
              <p className="text-[9px] font-mono text-[#0065FF] truncate max-w-[150px]">
                {value.name}
              </p>
            ) : (
              <p className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
                Awaiting Submission
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === 'processing' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#F0F7FF] rounded-full">
              <Loader2 size={10} className="animate-spin text-[#0065FF]" />
              <span className="text-[8px] font-black uppercase text-[#0065FF]">Scanning</span>
            </div>
          )}
          {status === 'verified' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#E8F5E9] rounded-full">
              <CheckCircle2 size={10} className="text-[#2E7D32]" />
              <span className="text-[8px] font-black uppercase text-[#2E7D32]">Verified</span>
            </div>
          )}

          {value ? (
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <div
              {...getRootProps()}
              className="cursor-pointer p-2 hover:bg-[#F8F9FA] rounded-full text-[#0065FF] transition-colors"
            >
              <input {...getInputProps()} />
              <Upload size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const [activeTab, setActiveTab] = useState('uploads');
  const [processingDocs, setProcessingDocs] = useState({});
  const [ocrData, setOcrData] = useState({});
  const [showAgreement, setShowAgreement] = useState(false);
  const sigCanvas = useRef();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      agreementAccepted: formData.documents.agreementAccepted,
      primarySignature: formData.documents.primarySignature,
    },
  });

  const agreementAccepted = useWatch({ control, name: 'agreementAccepted' });
  const primarySignature = useWatch({ control, name: 'primarySignature' });

  // Keep the store in sync so the wizard's "Continue" button reflects the signing state live
  useEffect(() => {
    const stored = useLoanStore.getState().formData.documents;
    if (
      stored.agreementAccepted !== !!agreementAccepted ||
      (stored.primarySignature || null) !== (primarySignature || null)
    ) {
      updateFormData('documents', {
        agreementAccepted: !!agreementAccepted,
        primarySignature: primarySignature || null,
      });
    }
  }, [agreementAccepted, primarySignature, updateFormData]);

  // Dynamic Requirements Calculation
  const requiredDocs = useMemo(() => {
    const list = ['panCard', 'aadhaarCard', 'bankStatements', 'addressProof'];
    if (formData.loanSelection.employmentType === 'salaried') list.push('incomeProof');
    if (formData.loanSelection.employmentType === 'business')
      list.push('gstCertificate', 'itrDocs');
    if (formData.loanSelection.loanType === 'home') list.push('propertyPapers');
    return list;
  }, [formData.loanSelection]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (file.type === 'application/pdf' || file.size < 1024 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.7
          );
        };
      };
    });
  };

  const handleUpload = useCallback(
    async (id, file) => {
      setProcessingDocs((prev) => ({ ...prev, [id]: 'processing' }));

      // Performance Attack Guard: Compression
      const processedFile = await compressImage(file);
      updateFormData('documents', { [id]: processedFile });

      // Simulate OCR & Validation
      setTimeout(() => {
        setProcessingDocs((prev) => ({ ...prev, [id]: 'verified' }));
        if (id === 'panCard') {
          setOcrData((prev) => ({
            ...prev,
            pan: {
              number: 'ABCDE1234F',
              name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.toUpperCase(),
            },
          }));
        }
        if (id === 'aadhaarCard') {
          setOcrData((prev) => ({
            ...prev,
            aadhaar: { status: 'Verified', dob: formData.personalInfo.dob },
          }));
        }
      }, 2500);
    },
    [updateFormData, formData.personalInfo]
  );

  const handleRemove = (id) => {
    updateFormData('documents', { [id]: null });
    setProcessingDocs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setValue('primarySignature', null);
  };

  const saveSignature = () => {
    if (!sigCanvas.current.isEmpty()) {
      setValue('primarySignature', sigCanvas.current.getCanvas().toDataURL('image/png'));
    }
  };

  const onSubmit = (data) => {
    updateFormData('documents', data);
    onNext();
  };

  // A document counts as verified once it is present and no scan is running. Documents uploaded
  // in earlier steps (KYC / Address) are already on file and were verified there.
  const getDocStatus = (id) => {
    if (processingDocs[id]) return processingDocs[id];
    return formData.documents[id] ? 'verified' : undefined;
  };
  const isAllDocsVerified = requiredDocs.every((id) => getDocStatus(id) === 'verified');

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      <div className="flex-1 space-y-12">
        {/* Step Navigation Tabs */}
        <div className="flex gap-4 border-b border-[#EEEEEE] pb-6">
          <button
            type="button"
            onClick={() => setActiveTab('uploads')}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'uploads' ? 'bg-[#121212] text-white' : 'text-[#888888] hover:bg-[#F8F9FA]'}`}
          >
            Digital Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signing')}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'signing' ? 'bg-[#121212] text-white' : 'text-[#888888] hover:bg-[#F8F9FA]'}`}
          >
            E-Signature
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'uploads' ? (
            <motion.div
              key="uploads"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 gap-6">
                {requiredDocs.map((id) => (
                  <DocumentCard
                    key={id}
                    id={id}
                    label={DOC_TYPES[id].label}
                    icon={DOC_TYPES[id].icon}
                    value={formData.documents[id]}
                    status={getDocStatus(id)}
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* OCR Insights Panel */}
              <AnimatePresence>
                {Object.keys(ocrData).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-[#F0F7FF] border border-[#0065FF]/20 space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Scan size={18} className="text-[#0065FF]" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                        Intelligence Extraction Results
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {ocrData.pan && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
                            Extracted PAN Data
                          </p>
                          <div className="p-4 bg-white rounded-2xl border border-[#0065FF]/10">
                            <p className="text-sm font-bold font-mono text-[#121212]">
                              {ocrData.pan.number}
                            </p>
                            <p className="text-[9px] font-mono text-[#888888] mt-1">
                              {ocrData.pan.name}
                            </p>
                          </div>
                        </div>
                      )}
                      {ocrData.aadhaar && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono text-[#888888] uppercase tracking-widest">
                            Aadhaar Vault Validation
                          </p>
                          <div className="p-4 bg-white rounded-2xl border border-[#0065FF]/10 flex items-center justify-between">
                            <p className="text-sm font-bold font-mono text-[#121212]">
                              DOB: {ocrData.aadhaar.dob}
                            </p>
                            <span className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[8px] font-black uppercase rounded-md">
                              Linked
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('signing')}
                  disabled={!isAllDocsVerified}
                  className="px-8 h-14 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-20 flex items-center gap-4 transition-all"
                >
                  Proceed to Signing <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#121212]">
                      Digital Signature Capture
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="bg-[#F8F9FA] rounded-[2.5rem] border-2 border-dashed border-[#EEEEEE] overflow-hidden relative group">
                  <SignatureCanvas
                    ref={sigCanvas}
                    onEnd={saveSignature}
                    penColor="#121212"
                    canvasProps={{ className: 'w-full h-64 cursor-crosshair' }}
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity text-center">
                    <PenTool size={24} className="mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Sign for Authorization
                    </p>
                  </div>
                </div>
                {errors.primarySignature && (
                  <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                    {errors.primarySignature.message}
                  </p>
                )}
              </section>

              {/* Agreement Consent */}
              <section className="p-8 rounded-[2.5rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-8">
                <div className="flex items-start gap-6">
                  <Controller
                    name="agreementAccepted"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-6 h-6 mt-1 rounded border-[#EEEEEE] text-[#121212] focus:ring-[#121212]"
                      />
                    )}
                  />
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-[#121212] leading-relaxed">
                      I have reviewed and accept the{' '}
                      <button
                        type="button"
                        onClick={() => setShowAgreement(true)}
                        className="text-[#0065FF] underline underline-offset-4"
                      >
                        Loan Master Agreement
                      </button>{' '}
                      and authorize the final underwriting process.
                    </p>
                    <p className="text-[10px] font-mono text-[#888888] leading-relaxed uppercase">
                      My digital signature above shall be treated as an original signature for all
                      legal purposes under the Information Technology Act.
                    </p>
                  </div>
                </div>
                {errors.agreementAccepted && (
                  <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                    {errors.agreementAccepted.message}
                  </p>
                )}
              </section>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveTab('uploads')}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#888888] hover:text-[#121212] transition-colors"
                >
                  <ArrowRight size={16} className="rotate-180" /> Back to Dossier
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)}>
          <button type="submit" id="wizard-submit-btn" className="hidden">
            Submit
          </button>
        </form>
      </div>

      {/* Side Summary Panel */}
      <aside className="w-full xl:w-96 sticky top-32 space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0065FF] opacity-10 blur-3xl" />
          <div className="relative space-y-8">
            <div>
              <p className="text-meta text-white/40">Compliance Status</p>
              <h4 className="text-2xl font-serif italic">Ready to Submit</h4>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Dossier Progress
                </p>
                <p className="text-xs font-black">
                  {Math.round((Object.keys(processingDocs).length / requiredDocs.length) * 100)}%
                </p>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(Object.keys(processingDocs).length / requiredDocs.length) * 100}%`,
                  }}
                  className="h-full bg-[#0065FF]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Signature Status
                </span>
                {primarySignature ? (
                  <CheckCircle2 size={16} className="text-[#4CAF50]" />
                ) : (
                  <AlertCircle size={16} className="text-[#FFB300]" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Agreement
                </span>
                {agreementAccepted ? (
                  <CheckCircle2 size={16} className="text-[#4CAF50]" />
                ) : (
                  <AlertCircle size={16} className="text-[#FFB300]" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  OCR Verification
                </span>
                {Object.keys(ocrData).length > 0 ? (
                  <CheckCircle2 size={16} className="text-[#4CAF50]" />
                ) : (
                  <Loader2 size={16} className="text-white/20 animate-spin" />
                )}
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3">
              <ShieldCheck size={18} className="text-[#0065FF] shrink-0" />
              <p className="text-[9px] font-mono leading-relaxed text-white/60 uppercase">
                All documents are encrypted with AES-256 before being transmitted to the
                underwriting vault.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#EEEEEE] flex flex-col items-center gap-2">
            <ShieldAlert size={16} className="text-[#888888]" />
            <span className="text-[8px] font-black uppercase text-[#121212]">PCI-DSS</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#EEEEEE] flex flex-col items-center gap-2">
            <Info size={16} className="text-[#888888]" />
            <span className="text-[8px] font-black uppercase text-[#121212]">ISO 27001</span>
          </div>
        </div>
      </aside>

      {/* Agreement Modal */}
      <AnimatePresence>
        {showAgreement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-white/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-white rounded-[3rem] border border-[#EEEEEE] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-[#EEEEEE] flex justify-between items-center bg-white">
                <div>
                  <p className="text-meta">Legal Declaration</p>
                  <h4 className="text-2xl font-serif italic">Loan Master Agreement</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAgreement(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6 text-sm text-[#888888] leading-relaxed custom-scrollbar font-sans">
                <p>
                  <strong>1. PROMISE TO PAY</strong>: Borrower promises to pay to the order of
                  Lender the Principal Sum plus all accrued Interest and other charges described in
                  this Agreement.
                </p>
                <p>
                  <strong>2. SECURITY INTEREST</strong>: To secure the repayment of the Loan,
                  Borrower grants to Lender a security interest in the property described below.
                </p>
                <p>
                  <strong>3. DEFAULT</strong>: Borrower will be in default if any required payment
                  is not made on its due date.
                </p>
                <p>
                  <strong>4. DISCLOSURE</strong>: Borrower acknowledges that all information
                  provided in the application process is true and complete to the best of their
                  knowledge.
                </p>
                <p className="italic">
                  This is a summary of the Master Agreement. The full legal text has been emailed to
                  your registered address.
                </p>
              </div>
              <div className="p-8 bg-[#F8F9FA] border-t border-[#EEEEEE] flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setValue('agreementAccepted', true);
                    setShowAgreement(false);
                  }}
                  className="px-12 h-14 rounded-2xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest"
                >
                  I Understand & Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #EEEEEE; border-radius: 10px; }`}</style>
    </div>
  );
};

export default DocumentStep;
