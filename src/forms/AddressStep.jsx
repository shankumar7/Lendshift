import React, { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Home,
  Clock,
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Navigation,
  Globe,
  Building,
  History,
  X,
  AlertCircle,
} from 'lucide-react';
import useLoanStore from '../store/useLoanStore';
import addressSchema from '../schemas/addressSchema';

const PIN_DATA = {
  110001: { city: 'New Delhi', state: 'Delhi' },
  400001: { city: 'Mumbai', state: 'Maharashtra' },
  560001: { city: 'Bengaluru', state: 'Karnataka' },
  600001: { city: 'Chennai', state: 'Tamil Nadu' },
  700001: { city: 'Kolkata', state: 'West Bengal' },
  500001: { city: 'Hyderabad', state: 'Telangana' },
};

const FileUploadZone = ({ label, value, onChange, onRemove, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }
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

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">{label}</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`relative h-32 rounded-2xl border border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden ${
          value ? 'border-[#0065FF] bg-[#F0F7FF]' : isDragging ? 'border-[#121212] bg-[#FAFAFA]' : 'border-[#EEEEEE] hover:border-[#CCCCCC]'
        }`}
      >
        {value ? (
          <div className="flex items-center gap-4 px-6 w-full">
            <div className="w-12 h-12 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center overflow-hidden">
              {value.preview ? <img src={value.preview} alt="preview" className="w-full h-full object-cover" /> : <FileText size={24} className="text-[#888888]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{value.name}</p>
              <p className="text-[10px] text-[#888888] font-mono">{(value.size / 1024).toFixed(0)} KB</p>
            </div>
            <button type="button" onClick={onRemove} className="p-2 hover:bg-white rounded-full transition-colors text-red-500">
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
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
              <>
                <UploadCloud size={24} className="text-[#888888]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">
                  Drag & drop or <span className="text-[#0065FF] cursor-pointer">browse</span>
                </p>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </>
            )}
          </>
        )}
      </div>
      {error && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{error.message}</p>}
    </div>
  );
};

const AddressStep = ({ onNext }) => {
  const { formData, updateFormData } = useLoanStore();
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [isGeoVerifying, setIsGeoVerifying] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: formData.address,
    mode: 'onBlur',
  });

  const currentAddress = watch('current');
  const isPermanentSameAsCurrent = watch('isPermanentSameAsCurrent');
  const residenceType = watch('current.residenceType');
  const durationAtAddress = watch('current.durationAtAddress');
  const isGeoVerified = watch('isGeoVerified');
  const pincode = watch('current.pincode');

  // AUTO-SAVE LOGIC: Sync form values to global store on change
  const allValues = watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFormData('address', allValues);
    }, 1000);
    return () => clearTimeout(timer);
  }, [allValues, updateFormData]);

  // PIN Lookup Effect
  useEffect(() => {
    const lookupPin = async () => {
      if (pincode?.length === 6) {
        setIsLookupLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        const data = PIN_DATA[pincode] || { city: 'Sample City', state: 'Sample State' };
        setValue('current.city', data.city, { shouldValidate: true });
        setValue('current.state', data.state, { shouldValidate: true });
        setIsLookupLoading(false);
      }
    };
    lookupPin();
  }, [pincode, setValue]);

  // Sync Permanent Address
  useEffect(() => {
    if (isPermanentSameAsCurrent) {
      setValue('permanent', { ...currentAddress });
    }
  }, [isPermanentSameAsCurrent, currentAddress, setValue]);

  const handleGeoVerify = async () => {
    setIsGeoVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setValue('isGeoVerified', true);
    setIsGeoVerifying(false);
  };

  const onSubmit = (data) => {
    updateFormData('address', data);
    onNext();
  };

  const { documents } = formData;

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-16">
        {/* 1. Current Residential Address */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-[#121212]/10">
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif italic text-[#121212]">Current Residence</h3>
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Primary Contact Address</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Address Line 1</label>
              <Controller
                name="current.addressLine1"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="House / Flat No, Building Name" className="input-premium" />
                )}
              />
              {errors.current?.addressLine1 && <p className="text-[9px] sm:text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.current.addressLine1.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Address Line 2 (Optional)</label>
              <Controller
                name="current.addressLine2"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="Road Name, Area, Colony" className="input-premium" />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Landmark (Optional)</label>
              <Controller
                name="current.landmark"
                control={control}
                render={({ field }) => (
                  <input {...field} placeholder="e.g. Near Apollo Hospital" className="input-premium" />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">PIN Code</label>
              <div className="relative">
                <Controller
                  name="current.pincode"
                  control={control}
                  render={({ field }) => (
                    <input {...field} maxLength={6} placeholder="6 Digit PIN" className="input-premium" />
                  )}
                />
                {isLookupLoading && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#0065FF]" />}
              </div>
              {errors.current?.pincode && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.current.pincode.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">City</label>
              <Controller
                name="current.city"
                control={control}
                render={({ field }) => (
                  <input {...field} readOnly className="input-premium bg-[#F8F9FA] cursor-not-allowed" />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">State</label>
              <Controller
                name="current.state"
                control={control}
                render={({ field }) => (
                  <input {...field} readOnly className="input-premium bg-[#F8F9FA] cursor-not-allowed" />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Country</label>
              <Controller
                name="current.country"
                control={control}
                render={({ field }) => (
                  <input {...field} readOnly className="input-premium bg-[#F8F9FA] cursor-not-allowed" />
                )}
              />
            </div>
          </div>
        </section>

        {/* 2. Residence Details */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
              <Home size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#121212]">Residence Details</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Type & Duration</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Residence Type</label>
              <Controller
                name="current.residenceType"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input-premium appearance-none">
                    <option value="">Select Type</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Family Owned">Family Owned</option>
                    <option value="Company Provided">Company Provided</option>
                  </select>
                )}
              />
              {errors.current?.residenceType && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.current.residenceType.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Duration at Current Address</label>
              <Controller
                name="current.durationAtAddress"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input-premium appearance-none">
                    <option value="">Select Duration</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1–3 years">1–3 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                )}
              />
              {errors.current?.durationAtAddress && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.current.durationAtAddress.message}</p>}
            </div>

            <AnimatePresence>
              {residenceType === 'Rented' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:col-span-2 grid md:grid-cols-2 gap-8 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Monthly Rent (₹)</label>
                    <Controller
                      name="current.monthlyRent"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          value={field.value === 0 ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? 0 : Number(val));
                          }}
                          placeholder="0"
                          className="input-premium"
                        />
                      )}
                    />
                    {errors.current?.monthlyRent && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.current.monthlyRent.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Landlord Name</label>
                    <Controller
                      name="current.landlordName"
                      control={control}
                      render={({ field }) => (
                        <input {...field} placeholder="Full Name" className="input-premium" />
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 3. Previous Address (Conditional) */}
        <AnimatePresence>
          {durationAtAddress === 'Less than 1 year' && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-8 overflow-hidden"
            >
              <div className="flex items-center gap-4 pt-8 border-t border-[#EEEEEE]">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
                  <History size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-serif italic text-[#121212]">Previous Address</h3>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Required for short residency</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Address Line 1</label>
                  <Controller
                    name="previous.addressLine1"
                    control={control}
                    render={({ field }) => (
                      <input {...field} placeholder="Previous House/Street" className="input-premium" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">City</label>
                  <Controller
                    name="previous.city"
                    control={control}
                    render={({ field }) => (
                      <input {...field} placeholder="City" className="input-premium" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">PIN Code</label>
                  <Controller
                    name="previous.pincode"
                    control={control}
                    render={({ field }) => (
                      <input {...field} maxLength={6} placeholder="6 Digit PIN" className="input-premium" />
                    )}
                  />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 4. Permanent Address */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
                <Building size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-serif italic text-[#121212]">Permanent Address</h3>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Native or Legal Residence</p>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <Controller
                  name="isPermanentSameAsCurrent"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="peer sr-only"
                    />
                  )}
                />
                <div className="w-10 h-6 bg-[#EEEEEE] rounded-full peer-checked:bg-[#121212] transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/60 group-hover:text-[#121212]">Same as Current</span>
            </label>
          </div>

          <AnimatePresence>
            {!isPermanentSameAsCurrent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid md:grid-cols-2 gap-8 overflow-hidden"
              >
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Address Line 1</label>
                  <Controller
                    name="permanent.addressLine1"
                    control={control}
                    render={({ field }) => (
                      <input {...field} placeholder="Permanent Residence" className="input-premium" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">PIN Code</label>
                  <Controller
                    name="permanent.pincode"
                    control={control}
                    render={({ field }) => (
                      <input {...field} maxLength={6} placeholder="6 Digit PIN" className="input-premium" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">City</label>
                  <Controller
                    name="permanent.city"
                    control={control}
                    render={({ field }) => (
                      <input {...field} placeholder="City" className="input-premium" />
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 5. Address Proof Upload */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
              <ShieldCheck size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#121212]">Verification Documents</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">Upload Address Proof</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Proof Type</label>
              <Controller
                name="addressProofType"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input-premium appearance-none">
                    <option value="">Select Document Type</option>
                    <option value="Electricity Bill">Electricity Bill</option>
                    <option value="Rental Agreement">Rental Agreement</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="Passport">Passport</option>
                    <option value="Aadhaar">Aadhaar</option>
                  </select>
                )}
              />
              {errors.addressProofType && <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">{errors.addressProofType.message}</p>}
            </div>

            <FileUploadZone
              label="Document Scanned Copy"
              value={documents.addressProof}
              onChange={(file) => updateFormData('documents', { addressProof: file })}
              onRemove={() => updateFormData('documents', { addressProof: null })}
              error={!documents.addressProof && errors.addressProofType ? { message: 'Document upload required' } : null}
            />
          </div>
        </section>

        {/* 6. Geo Verification */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] flex items-center justify-center text-[#121212]">
              <Navigation size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-serif italic text-[#121212]">Geo-Spatial Validation</h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">GPS Location Matching</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-[#EEEEEE] bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center relative overflow-hidden shrink-0">
              <Globe size={32} className={isGeoVerifying ? 'text-[#0065FF] animate-pulse' : 'text-[#EEEEEE]'} />
              {isGeoVerified && (
                <div className="absolute inset-0 bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-[#2E7D32]" />
                </div>
              )}
              {isGeoVerifying && (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-transparent border-t-[#0065FF] rounded-full"
                />
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Verify Your Current Location</h4>
                <p className="text-xs text-[#888888] leading-relaxed">
                  Institutional compliance requires us to match your current GPS location with the residential address provided.
                </p>
              </div>

              {!isGeoVerified ? (
                <button
                  type="button"
                  onClick={handleGeoVerify}
                  disabled={isGeoVerifying}
                  className="btn-primary h-14 px-10 disabled:opacity-50"
                >
                  {isGeoVerifying ? (
                    <div className="flex items-center gap-3">
                      <Loader2 size={16} className="animate-spin" />
                      <span>FETCHING GPS DATA...</span>
                    </div>
                  ) : (
                    'Verify Location'
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-4 text-[#2E7D32] bg-[#E8F5E9] p-4 rounded-2xl border border-[#C8E6C9]">
                  <CheckCircle2 size={24} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">Location Match Verified</p>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Accuracy: 99.8% Match with Address</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Hidden Submit */}
        <button type="submit" id="wizard-submit-btn" className="hidden">Submit</button>
      </form>

      {/* Summary Sidebar */}
      <aside className="w-full xl:w-80 sticky top-32 space-y-8">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] text-white shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-meta text-white/40">Residency Audit</p>
              <h4 className="text-2xl font-serif italic">Address Health</h4>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                { id: 'pin', label: 'PIN Lookup', status: pincode?.length === 6 },
                { id: 'geo', label: 'Geo-Verification', status: isGeoVerified },
                { id: 'proof', label: 'Address Proof', status: !!documents.addressProof },
                { id: 'type', label: 'Residency Type', status: !!residenceType },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${item.status ? 'text-white' : 'text-white/20'}`}>
                    {item.label}
                  </span>
                  {item.status ? (
                    <CheckCircle2 size={14} className="text-[#0065FF]" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                  )}
                </div>
              ))}
            </div>

            {(!isValid || !isGeoVerified || !documents.addressProof) && (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3">
                <AlertCircle size={16} className="text-[#FFAB00] shrink-0" />
                <p className="text-[9px] font-mono leading-relaxed text-white/60">
                  All address details and GPS verification must be completed to proceed.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-[#F8F9FA] border border-[#EEEEEE] space-y-4">
          <div className="flex items-center gap-3 text-[#121212]">
            <Clock size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest">Auto-Saved Progress</p>
          </div>
          <p className="text-[10px] text-[#888888] leading-relaxed">
            Your progress is being saved in real-time. You can resume this application from any device.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default AddressStep;
