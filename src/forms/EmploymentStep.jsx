import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from '@/schemas/loanSchema';
import { useWizard } from '@/components/WizardController';
import { useAutoSave } from '@/hooks/useAutoSave';
import FormField from '@/components/FormField';
import { Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmploymentStep = () => {
  const { formData, updateStepData, goToNextStep } = useWizard();
  const stepId = 'employment';

  const methods = useForm({
    resolver: zodResolver(schemas[stepId]),
    defaultValues: formData[stepId] || {},
    mode: 'onBlur',
  });

  const { watch, handleSubmit } = methods;
  const currentValues = watch();
  const employmentType = watch('employmentType');

  useAutoSave(currentValues, stepId);

  const onSubmit = (data) => {
    updateStepData(stepId, data);
    goToNextStep();
  };

  const employmentOptions = [
    { label: 'Full-time Employee', value: 'full_time' },
    { label: 'Part-time Employee', value: 'part_time' },
    { label: 'Self-employed / Freelance', value: 'self_employed' },
    { label: 'Unemployed', value: 'unemployed' },
  ];

  return (
    <FormProvider {...methods}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display">Employment Status</h2>
          <p className="text-sm text-slate-500">Tell us about your current professional situation and income.</p>
        </div>

        <form id="wizard-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="employmentType"
            label="What is your current employment status?"
            type="select"
            options={employmentOptions}
            icon={Briefcase}
          />

          <AnimatePresence>
            {employmentType && employmentType !== 'unemployed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <FormField
                  name="employerName"
                  label="Employer Name"
                  placeholder="e.g. Google"
                  icon={Briefcase}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="monthlyIncome"
                    label="Monthly Net Income ($)"
                    type="number"
                    placeholder="5000"
                    icon={DollarSign}
                  />
                  <FormField
                    name="workExperience"
                    label="Total Experience (Years)"
                    type="number"
                    placeholder="5"
                    icon={TrendingUp}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </FormProvider>
  );
};

export default EmploymentStep;
