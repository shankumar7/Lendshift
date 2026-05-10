import { z } from 'zod';

// Masking Utilities
export const maskPII = (value, type) => {
  if (!value) return '';
  switch (type) {
    case 'pan':
      return `${value.slice(0, 5)}XXXX${value.slice(-1)}`;
    case 'aadhaar':
      return `XXXX-XXXX-${value.slice(-4)}`;
    default:
      return value;
  }
};

// Base field schemas
const phoneSchema = z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format');
const emailSchema = z.string().email('Invalid email address');

// Dynamic Step Schemas
export const schemas = {
  personal: z.object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    email: emailSchema,
    phone: phoneSchema,
    dob: z.string().refine((val) => {
      const date = new Date(val);
      const age = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, 'Must be at least 18 years old'),
  }),

  employment: z
    .object({
      employmentType: z.enum(['full_time', 'part_time', 'self_employed', 'unemployed']),
      employerName: z.string().optional(),
      monthlyIncome: z.coerce.number().min(500, 'Minimum monthly income required is $500'),
      workExperience: z.coerce.number().min(0),
    })
    .superRefine((data, ctx) => {
      if (
        data.employmentType !== 'unemployed' &&
        (!data.employerName || data.employerName.length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Employer name is required if employed',
          path: ['employerName'],
        });
      }
    }),

  financials: z
    .object({
      hasExistingLoans: z.boolean(),
      monthlyEMI: z.coerce.number().optional(),
      creditScore: z.coerce.number().min(300).max(900).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.hasExistingLoans && (!data.monthlyEMI || data.monthlyEMI <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Monthly EMI is required for existing loans',
          path: ['monthlyEMI'],
        });
      }
    }),

  purpose: z.object({
    loanAmount: z.coerce.number().min(1000).max(1000000),
    tenureMonths: z.coerce.number().min(6).max(360),
    loanPurpose: z.string().min(1, 'Please select a purpose'),
  }),
};

// Cross-step dependency validation
export const validateFullApplication = (allData) => {
  // Logic for global cross-step validation
  // E.g. Income vs Loan Amount ratio
  const { employment, purpose } = allData;
  if (employment && purpose) {
    const annualIncome = employment.monthlyIncome * 12;
    if (purpose.loanAmount > annualIncome * 5) {
      return { success: false, message: 'Loan amount exceeds 5x annual income' };
    }
  }
  return { success: true };
};
