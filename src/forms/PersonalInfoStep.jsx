import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from '@/schemas/loanSchema';
import { useWizard } from '@/context/WizardContext';
import { useAutoSave } from '@/hooks/useAutoSave';
import FormField from '@/components/FormField';
import { User, Mail, Phone, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalInfoStep = () => {
  const { formData, updateStepData, goToNextStep } = useWizard();
  const stepId = 'personal';

  const methods = useForm({
    resolver: zodResolver(schemas[stepId]),
    defaultValues: formData[stepId] || {},
    mode: 'onBlur', // Optimized performance: validate on blur
  });

  const { watch, handleSubmit } = methods;
  const currentValues = watch();

  // Auto-save logic (Every 30s + on unmount)
  useAutoSave(currentValues, stepId);

  const onSubmit = (data) => {
    updateStepData(stepId, data);
    goToNextStep();
  };

  return (
    <FormProvider {...methods}>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display tracking-tight dark:text-white">Personal Information</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Please provide your legal name and contact details as they appear on your government ID.</p>
        </div>

        <form id="wizard-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="firstName"
              label="First Name"
              placeholder="e.g. Michael"
              icon={User}
              autoFocus
            />
            <FormField
              name="lastName"
              label="Last Name"
              placeholder="e.g. Scofield"
              icon={User}
            />
          </div>

          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="m.scofield@foxriver.com"
            icon={Mail}
            description="We'll send application updates to this email."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              mask="phone"
            />
            <FormField
              name="dob"
              label="Date of Birth"
              type="date"
              icon={Calendar}
              description="You must be 18+ years old to apply."
            />
          </div>
        </form>
      </motion.div>
    </FormProvider>
  );
};

export default PersonalInfoStep;
