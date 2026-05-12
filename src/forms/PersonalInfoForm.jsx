import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/schemas/loanSchema';
import FormField from '@/components/FormField';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const PersonalInfoForm = ({ onSubmit, defaultValues }) => {
  const methods = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form id="step-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="firstName" label="First Name" placeholder="e.g. John" icon={User} />
          <FormField name="lastName" label="Last Name" placeholder="e.g. Doe" icon={User} />
        </div>

        <FormField
          name="email"
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          icon={Mail}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="phone"
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            icon={Phone}
          />
          <FormField name="dob" label="Date of Birth" type="date" icon={Calendar} />
        </div>
      </form>
    </FormProvider>
  );
};

export default PersonalInfoForm;
