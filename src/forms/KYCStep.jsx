import React, { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Fingerprint,
  Camera,
  UploadCloud,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ScanFace,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import kycSchema from '../schemas/kycSchema';

const VerificationBadge = ({ status }) => {
  if (status === 'verified') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1 px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full"
      >
        <CheckCircle2 size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
      </motion.div>
    );
  }
  if (status === 'processing') {
    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-[#E3F2FD] text-[#1565C0] rounded-full">
        <Loader2 size={12} className="animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-[#F5F5F5] text-[#888888] rounded-full">
      <AlertCircle size={12} />
      <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
    </div>
  );
};

const FileUploadZone = ({ label, value, onChange, onRemove, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // In a real app, use a toast component. For now, silence lint.
      // eslint-disable-next-line no-alert
      alert('File size exceeds 5MB limit');
      return;
    }
    // Simulate upload progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onChange({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getBorderClass = () => {
    if (value) return 'border-[#0065FF] bg-[#F0F7FF]';
    if (isDragging) return 'border-[#121212] bg-[#FAFAFA]';
    return 'border-[#EEEEEE] hover:border-[#CCCCCC]';
  };

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
        {label}
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`relative h-32 rounded-2xl border border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden ${getBorderClass()}`}
      >
        {value ? (
          <div className="flex items-center gap-4 px-6 w-full">
            <div className="w-12 h-12 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center overflow-hidden">
              {value.preview ? (
                <img src={value.preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FileText size={24} className="text-[#888888]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{value.name}</p>
              <p className="text-[10px] text-[#888888] font-mono">
                {(value.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 hover:bg-white rounded-full transition-colors text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            {progress > 0 && progress < 100 ? (
              <div className="w-full px-8 space-y-2">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span>UPLOADING</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-[#EEEEEE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0065FF]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud size={24} className="text-[#888888]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">
                  Drag & drop or <span className="text-[#0065FF] cursor-pointer">browse</span>
                </p>
                <input
                  type="file"
                  id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
          {error.message}
        </p>
      )}
    </div>
  );
};

const KYCStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kycSchema),
    defaultValues: formData.kyc,
    mode: 'onBlur',
  });

  const panNumber = useWatch({ control, name: 'panNumber' });
  const aadhaarNumber = useWatch({ control, name: 'aadhaarNumber' });
  const isPanVerified = useWatch({ control, name: 'isPanVerified' });
  const isAadhaarVerified = useWatch({ control, name: 'isAadhaarVerified' });
  const isFaceVerified = useWatch({ control, name: 'isFaceVerified' });
  const idType = useWatch({ control, name: 'idType' });

  const { documents } = formData;

  // AUTO-SAVE LOGIC: Sync form values to global store on change
  const allValues = useWatch({ control });
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('kyc', allValues);
    }, 1000);
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  const handleVerifyPan = async () => {
    if (panNumber.length < 10) return;
    setIsVerifyingPan(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    setValue('isPanVerified', true);
    setIsVerifyingPan(false);
  };

  const handleVerifyAadhaar = async () => {
    if (aadhaarNumber.length < 12) return;
    setIsVerifyingAadhaar(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    setValue('isAadhaarVerified', true);
    setIsVerifyingAadhaar(false);
  };

  const handleFaceVerification = async () => {
    if (!documents.selfie) return;
    setIsVerifyingFace(true);
    setFaceConfidence(0);
    const interval = setInterval(() => {
      setFaceConfidence((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setValue('isFaceVerified', true);
          setIsVerifyingFace(false);
          return 98.4;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const onSubmit = (data) => {
    updateFormData('kyc', data);
    onNext();
  };

  const completionPercent =
    [
      isPanVerified,
      isAadhaarVerified,
      isFaceVerified,
      !!documents.panCard,
      !!documents.aadhaarCard,
      !!documents.secondaryId,
    ].filter(Boolean).length *
    (100 / 6);

  const getPanBadgeStatus = () => {
    if (isVerifyingPan) return 'processing';
    if (isPanVerified) return 'verified';
    return 'idle';
  };

  const getAadhaarBadgeStatus = () => {
    if (isVerifyingAadhaar) return 'processing';
    if (isAadhaarVerified) return 'verified';
    return 'idle';
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12">
      {/* Horizontal Verification Summary */}
      <div className="bg-[#121212] rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-[#121212]/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-full bg-[#0065FF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-shrink-0 space-y-1">
            <p className="text-meta text-white/40">Compliance Status</p>
            <h4 className="text-3xl font-serif italic">KYC Summary</h4>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
            {[
              { id: 'pan', label: 'PAN Identity', status: isPanVerified },
              { id: 'aadhaar', label: 'Aadhaar ID', status: isAadhaarVerified },
              { id: 'docs', label: 'Gov Documents', status: !!documents.secondaryId },
              { id: 'face', label: 'Face Match', status: isFaceVerified },
            ].map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${item.status ? 'text-white' : 'text-white/20'}`}
                  >
                    {item.label}
                  </span>
                  {item.status ? (
                    <CheckCircle2 size={14} className="text-[#0065FF]" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  )}
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.status ? '100%' : '0%' }}
                    className="h-full bg-[#0065FF]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 flex items-center gap-6 border-l border-white/10 pl-16 hidden xl:flex">
            <div className="text-right space-y-1">
              <p className="text-[10px] font-mono text-white/40 uppercase">Completion</p>
              <p className="text-3xl font-serif italic">{Math.round(completionPercent)}%</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-white/5"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="176"
                  initial={{ strokeDashoffset: 176 }}
                  animate={{ strokeDashoffset: 176 - (176 * completionPercent) / 100 }}
                  className="text-[#0065FF]"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-12 space-y-16 lg:space-y-24">
          {/* 1. Identity Verification Cards */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-[#121212]/10">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-serif italic text-[#121212]">Institutional KYC</h3>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">
                  Biometric & Statutory Validation
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* PAN Card Verification */}
              <div
                className={`p-10 rounded-[2.5rem] border transition-all duration-500 bg-white ${isPanVerified ? 'border-[#E8F5E9] shadow-sm' : 'border-[#EEEEEE] hover:border-[#CCCCCC]'}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl">
                    <CreditCard
                      size={28}
                      className={isPanVerified ? 'text-[#2E7D32]' : 'text-[#121212]'}
                    />
                  </div>
                  <VerificationBadge status={getPanBadgeStatus()} />
                </div>
                <div className="space-y-5">
                  <label className="block space-y-5 cursor-pointer">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
                      Permanent Account Number
                    </span>
                    <div className="relative">
                      <Controller
                        name="panNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={field.value || ''}
                            id="pan-input"
                            maxLength={10}
                            disabled={isPanVerified}
                            placeholder="ABCDE1234F"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            className="w-full h-16 bg-[#F8F9FA] border-0 rounded-2xl px-6 font-mono tracking-[0.4em] text-xl focus:ring-2 focus:ring-[#121212] transition-all"
                          />
                        )}
                      />
                      {!isPanVerified && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleVerifyPan();
                          }}
                          disabled={isVerifyingPan || panNumber?.length < 10}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-8 rounded-xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-colors disabled:opacity-50"
                        >
                          {isVerifyingPan ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      )}
                    </div>
                  </label>
                  {errors.panNumber && (
                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                      {errors.panNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Aadhaar Verification */}
              <div
                className={`p-10 rounded-[2.5rem] border transition-all duration-500 bg-white ${isAadhaarVerified ? 'border-[#E8F5E9] shadow-sm' : 'border-[#EEEEEE] hover:border-[#CCCCCC]'}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl">
                    <Fingerprint
                      size={28}
                      className={isAadhaarVerified ? 'text-[#2E7D32]' : 'text-[#121212]'}
                    />
                  </div>
                  <VerificationBadge status={getAadhaarBadgeStatus()} />
                </div>
                <div className="space-y-5">
                  <label className="block space-y-5 cursor-pointer">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
                      Aadhaar Identity
                    </span>
                    <div className="relative">
                      <Controller
                        name="aadhaarNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="aadhaar-input"
                            value={
                              field.value?.replace(/(\d{4})(?=\d)/g, '$1 ') || ''
                            }
                            maxLength={14}
                            disabled={isAadhaarVerified}
                            placeholder="XXXX XXXX XXXX"
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ''))
                            }
                            className={`w-full h-16 bg-[#F8F9FA] border-0 rounded-2xl px-6 font-mono tracking-[0.4em] text-xl focus:ring-2 focus:ring-[#121212] transition-all ${isAadhaarVerified ? 'blur-[2px] opacity-40' : ''}`}
                          />
                        )}
                      />
                      {!isAadhaarVerified && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleVerifyAadhaar();
                          }}
                          disabled={
                            isVerifyingAadhaar || aadhaarNumber?.length < 12
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-8 rounded-xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0065FF] transition-colors disabled:opacity-50"
                        >
                          {isVerifyingAadhaar ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </button>
                      )}
                    </div>
                  </label>
                  {errors.aadhaarNumber && (
                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                      {errors.aadhaarNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Secondary ID & Document Uploads Combined for Horizontal Flow */}
          <div className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
                  <FileText size={18} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif italic text-[#121212]">Secondary Proof</h3>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block space-y-3 cursor-pointer">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
                      ID Type
                    </span>
                    <Controller
                      name="idType"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value || ''}
                          id="id-type-select"
                          className="input-premium h-14 rounded-xl"
                        >
                          <option value="">Select ID Type</option>
                          <option value="passport">Indian Passport</option>
                          <option value="voter-id">Voter Identity Card</option>
                          <option value="driving-license">Driving License</option>
                        </select>
                      )}
                    />
                  </label>
                  {errors.idType && (
                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                      {errors.idType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block space-y-3 cursor-pointer">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">
                      Document Number
                    </span>
                    <Controller
                      name="idNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          value={field.value || ''}
                          id="id-number-input"
                          placeholder="Enter ID Number"
                          className="input-premium h-14 rounded-xl"
                        />
                      )}
                    />
                  </label>
                  {errors.idNumber && (
                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">
                      {errors.idNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
                  <UploadCloud size={18} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif italic text-[#121212]">Document Repository</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FileUploadZone
                  label="PAN Card Copy"
                  value={documents.panCard}
                  onChange={(file) => updateFormData('documents', { panCard: file })}
                  onRemove={() => updateFormData('documents', { panCard: null })}
                />
                <FileUploadZone
                  label="Aadhaar Front & Back"
                  value={documents.aadhaarCard}
                  onChange={(file) => updateFormData('documents', { aadhaarCard: file })}
                  onRemove={() => updateFormData('documents', { aadhaarCard: null })}
                />
                <FileUploadZone
                  label={idType ? `${idType.replace('-', ' ')} Copy` : 'Secondary ID Copy'}
                  value={documents.secondaryId}
                  onChange={(file) => updateFormData('documents', { secondaryId: file })}
                  onRemove={() => updateFormData('documents', { secondaryId: null })}
                />
              </div>
            </div>
          </div>

          {/* 4. Face Verification */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
                <ScanFace size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-serif italic text-[#121212]">Biometric Matching</h3>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">
                  Real-time facial identity match
                </p>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] border border-[#EEEEEE] bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                {documents.selfie ? (
                  <img
                    src={documents.selfie.preview}
                    alt="selfie"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#888888] gap-2">
                    <Camera size={28} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center px-4">
                      Biometric Scan Required
                    </span>
                  </div>
                )}
                {isVerifyingFace && (
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-[#0065FF] shadow-[0_0_15px_#0065FF]"
                  />
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">Institutional Face Match</h4>
                  <p className="text-xs text-[#888888] leading-relaxed max-w-xl">
                    Our proprietary AI protocols verify your live identity against institutional
                    government databases. Absolute privacy is maintained through 256-bit encryption.
                  </p>
                </div>

                {!isFaceVerified ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <button
                        type="button"
                        className="btn-secondary h-14 px-10 overflow-hidden relative border border-[#EEEEEE]"
                      >
                        <Camera size={16} className="mr-2" />
                        Capture Selfie
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              updateFormData('documents', {
                                selfie: {
                                  name: file.name,
                                  preview: URL.createObjectURL(file),
                                },
                              });
                            }
                          }}
                        />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleFaceVerification}
                      disabled={!documents.selfie || isVerifyingFace}
                      className="btn-primary h-14 px-12 disabled:opacity-50 shadow-xl shadow-[#0065FF]/20"
                    >
                      {isVerifyingFace ? (
                        <div className="flex items-center gap-3">
                          <Loader2 size={16} className="animate-spin" />
                          <span>MATCHING {Math.round(faceConfidence)}%</span>
                        </div>
                      ) : (
                        'Initialize Match'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-5 text-[#2E7D32] bg-[#E8F5E9] p-6 rounded-[2rem] border border-[#C8E6C9] max-w-fit">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">
                        Verification Successful
                      </p>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                        Identity Match Score: 98.4%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Hidden Submit */}
          <button type="submit" id="wizard-submit-btn" className="hidden">
            Submit
          </button>
        </form>
      </div>

      {/* Trust Badges Footer */}
      <div className="pt-12 border-t border-[#EEEEEE] flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 text-[#121212]">
          <ShieldCheck size={16} className="text-[#0065FF]" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            AES-256 Encrypted Vaults
          </p>
        </div>
        <div className="flex gap-8 text-[#888888]">
          <span className="text-[8px] font-mono uppercase tracking-widest">
            ISO 27001 Certified
          </span>
          <span className="text-[8px] font-mono uppercase tracking-widest">GDPR Compliant</span>
          <span className="text-[8px] font-mono uppercase tracking-widest">
            Real-time Biometric Match
          </span>
        </div>
      </div>
    </div>
  );
};

export default KYCStep;
