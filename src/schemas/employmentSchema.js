import { z } from 'zod';

const employmentSchema = z
  .object({
    type: z.enum(['salaried', 'self-employed', 'business', 'freelancer', 'retired'], {
      required_error: 'Employment type is required',
    }),

    // Salaried Fields
    employerName: z.string().optional(),
    designation: z.string().optional(),
    industryType: z.string().optional(),
    workExp: z.string().optional(),
    monthlyIncome: z.number().min(0, 'Must be positive').optional(),
    salaryCreditBank: z.string().optional(),
    salaryCreditDate: z.string().optional(),
    employmentStatus: z.string().optional(),

    // Self-Employed Fields
    professionType: z.string().optional(),
    yearsInPractice: z.string().optional(),
    annualRevenue: z.number().min(0).optional(),
    isGstRegistered: z.boolean().optional(),
    gstNumber: z.string().optional(),
    businessCategory: z.string().optional(),

    // Business Fields
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    annualTurnover: z.number().min(0).optional(),
    employeeCount: z.string().optional(),
    yearsInOperation: z.string().optional(),

    // Freelancer Fields
    primarySkill: z.string().optional(),
    platformsUsed: z.string().optional(),
    clientBaseType: z.string().optional(),

    // Retired Fields
    pensionAmount: z.number().min(0).optional(),
    retirementYear: z.string().optional(),
    previousProfession: z.string().optional(),

    // Banking & Obligations (Always Required)
    bankName: z.string().min(2, 'Bank name is required'),
    accountType: z.string().min(1, 'Select account type'),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC format'),
    monthlyObligations: z.number().min(0, 'Must be positive'),
    existingEmis: z.number().min(0, 'Must be positive'),
  })
  .superRefine((data, ctx) => {
    // Conditional Requirements
    if (data.type === 'salaried') {
      if (!data.employerName)
        ctx.addIssue({
          code: 'custom',
          message: 'Employer name is required',
          path: ['employerName'],
        });
      if (!data.monthlyIncome || data.monthlyIncome < 15000)
        ctx.addIssue({
          code: 'custom',
          message: 'Minimum salary requirement is ₹15,000',
          path: ['monthlyIncome'],
        });
    }

    if (data.type === 'self-employed') {
      if (!data.professionType)
        ctx.addIssue({
          code: 'custom',
          message: 'Profession is required',
          path: ['professionType'],
        });
      if (data.isGstRegistered && !data.gstNumber)
        ctx.addIssue({ code: 'custom', message: 'GST number is required', path: ['gstNumber'] });
    }

    if (data.type === 'business') {
      if (!data.businessName)
        ctx.addIssue({
          code: 'custom',
          message: 'Business name is required',
          path: ['businessName'],
        });
      if (!data.gstNumber)
        ctx.addIssue({ code: 'custom', message: 'GST number is required', path: ['gstNumber'] });
    }

    if (data.type === 'freelancer') {
      if (!data.primarySkill)
        ctx.addIssue({ code: 'custom', message: 'Skill is required', path: ['primarySkill'] });
    }

    if (data.type === 'retired') {
      if (!data.pensionAmount)
        ctx.addIssue({
          code: 'custom',
          message: 'Pension amount is required',
          path: ['pensionAmount'],
        });
    }
  });

export default employmentSchema;
