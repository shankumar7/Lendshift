import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from '@/schemas/loanSchema';
import { useWizard } from '@/context/WizardContext';
import useAutoSave from '@/hooks/useAutoSave';
import FormField from '@/components/FormField';
import { DollarSign, PieChart, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FinancialsStep = () => {
  const { formData, updateStepData, goToNextStep } = useWizard();
  const stepId = 'financials';

  const methods = useForm({
    resolver: zodResolver(schemas[stepId]),
    defaultValues: formData[stepId] || { hasExistingLoans: false },
    mode: 'onBlur',
  });

  const { watch, handleSubmit, setValue } = methods;
  const currentValues = watch();
  const hasExistingLoans = watch('hasExistingLoans');

  useAutoSave(currentValues, stepId);

  const onSubmit = (data) => {
    updateStepData(stepId, data);
    goToNextStep();
  };

  return (
    <FormProvider {...methods}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display">Financial Health</h2>
          <p className="text-sm text-slate-500">
            This helps us understand your debt-to-income ratio.
          </p>
        </div>

        <form id="wizard-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold dark:text-white">Do you have any existing loans?</p>
                <p className="text-xs text-slate-500">Including Personal, Auto, or Home loans.</p>
              </div>
              <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setValue('hasExistingLoans', true)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                    hasExistingLoans
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setValue('hasExistingLoans', false)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                    !hasExistingLoans
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {hasExistingLoans && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <FormField
                  name="monthlyEMI"
                  label="Total Monthly EMI ($)"
                  type="number"
                  placeholder="1200"
                  icon={DollarSign}
                  description="Total amount you pay monthly for all existing loans."
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FormField
            name="creditScore"
            label="Estimated Credit Score"
            type="number"
            placeholder="750"
            icon={ShieldCheck}
            description="300-900. If you don't know, provide an estimate."
          />
        </form>
      </motion.div>
    </FormProvider>
  );
};

// Import cn helper locally if needed, but I'll use the one from utils
import { cn } from '@/utils/cn';

export default FinancialsStep;
