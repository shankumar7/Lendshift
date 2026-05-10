import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    return date < now;
  }, 'Date of birth must be in the past'),
});

export const employmentInfoSchema = z.object({
  employerName: z.string().min(2, 'Employer name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  monthlyIncome: z.coerce.number().min(500, 'Minimum monthly income is $500'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Self-employed', 'Contract']),
});

export const loanDetailsSchema = z.object({
  loanAmount: z.coerce.number().min(1000, 'Minimum loan amount is $1,000').max(500000, 'Maximum loan amount is $500,000'),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  termMonths: z.coerce.number().min(6, 'Minimum term is 6 months').max(120, 'Maximum term is 120 months'),
});

export const loanSchema = z.object({
  personalInfo: personalInfoSchema,
  employmentInfo: employmentInfoSchema,
  loanDetails: loanDetailsSchema,
});
