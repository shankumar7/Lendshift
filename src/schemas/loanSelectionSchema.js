import { z } from 'zod';

const loanSelectionSchema = z
  .object({
    loanType: z.enum(['personal', 'home', 'business'], {
      required_error: 'Please select a loan type',
    }),
    amount: z
      .number({
        required_error: 'Please specify a loan amount',
        invalid_type_error: 'Amount must be a number',
      })
      .min(50000, 'Minimum amount is ₹50,000'),
    tenure: z
      .number({
        required_error: 'Please select a tenure',
      })
      .min(6, 'Minimum tenure is 6 months'),
    purpose: z
      .string({
        required_error: 'Please choose a loan purpose',
        invalid_type_error: 'Please choose a loan purpose',
      })
      .min(1, 'Please choose a loan purpose'),
    employmentType: z
      .string({
        required_error: 'Please select employment type',
        invalid_type_error: 'Please select employment type',
      })
      .min(1, 'Please select employment type'),
    monthlyIncome: z
      .number({
        required_error: 'Please enter your monthly income',
        invalid_type_error: 'Please enter a valid income amount',
      })
      .min(10000, 'Income must be at least ₹10,000'),
  })
  .superRefine((data, ctx) => {
    // Dynamic validation based on loanType
    if (data.loanType === 'personal') {
      if (data.amount > 2500000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max ₹25L for Personal Loans',
          path: ['amount'],
        });
      }
      if (data.tenure > 60) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Max 60 months', path: ['tenure'] });
      }
    }

    if (data.loanType === 'home') {
      if (data.amount < 500000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min ₹5L for Home Loans',
          path: ['amount'],
        });
      }
      if (data.amount > 50000000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max ₹5Cr for Home Loans',
          path: ['amount'],
        });
      }
      if (data.tenure < 60) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min 5 years (60m)',
          path: ['tenure'],
        });
      }
      if (data.tenure > 360) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max 30 years (360m)',
          path: ['tenure'],
        });
      }
    }

    if (data.loanType === 'business') {
      if (data.amount < 100000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min ₹1L for Business Loans',
          path: ['amount'],
        });
      }
      if (data.amount > 7500000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max ₹75L for Business Loans',
          path: ['amount'],
        });
      }
      if (data.tenure > 120) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Max 120 months', path: ['tenure'] });
      }
    }
  });

export default loanSelectionSchema;
