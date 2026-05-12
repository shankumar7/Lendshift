import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employmentInfoSchema } from '@/schemas/loanSchema';
import FormField from '@/components/FormField';
import { Briefcase, DollarSign, PieChart } from 'lucide-react';

const EmploymentInfoForm = ({ onSubmit, defaultValues }) => {
  const methods = useForm({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues,
    mode: 'onChange',
  });

  const employmentOptions = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Self-employed', value: 'Self-employed' },
    { label: 'Contract', value: 'Contract' },
  ];

  return (
    <FormProvider {...methods}>
      <form id="step-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="employerName"
            label="Employer Name"
            placeholder="e.g. Acme Corp"
            icon={Briefcase}
          />
          <FormField
            name="jobTitle"
            label="Job Title"
            placeholder="e.g. Product Manager"
            icon={Briefcase}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="monthlyIncome"
            label="Monthly Income ($)"
            type="number"
            placeholder="5000"
            icon={DollarSign}
            description="Gross monthly income before tax"
          />
          <FormField
            name="employmentType"
            label="Employment Type"
            type="select"
            options={employmentOptions}
            icon={PieChart}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default EmploymentInfoForm;
