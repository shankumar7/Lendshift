import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanDetailsSchema } from '@/schemas/loanSchema';
import FormField from '@/components/FormField';
import { DollarSign, HelpCircle, Calendar } from 'lucide-react';

const LoanDetailsForm = ({ onSubmit, defaultValues }) => {
  const methods = useForm({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues,
    mode: 'onChange',
  });

  const purposeOptions = [
    { label: 'Debt Consolidation', value: 'debt_consolidation' },
    { label: 'Home Improvement', value: 'home_improvement' },
    { label: 'Major Purchase', value: 'major_purchase' },
    { label: 'Medical Expenses', value: 'medical' },
    { label: 'Business Venture', value: 'business' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <FormProvider {...methods}>
      <form id="step-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="loanAmount"
            label="Loan Amount ($)"
            type="number"
            placeholder="10000"
            icon={DollarSign}
            description="Between $1,000 and $500,000"
          />
          <FormField
            name="termMonths"
            label="Loan Term (Months)"
            type="number"
            placeholder="36"
            icon={Calendar}
            description="Between 6 and 120 months"
          />
        </div>

        <FormField
          name="loanPurpose"
          label="Loan Purpose"
          type="select"
          options={purposeOptions}
          icon={HelpCircle}
        />
      </form>
    </FormProvider>
  );
};

export default LoanDetailsForm;
