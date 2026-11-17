import { z } from 'zod';

const coApplicantSchema = z.object({
  hasCoApplicant: z.boolean(),
  relation: z.string().min(1, 'Relationship is required'),
  fullName: z.string().min(3, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  email: z.string().email('Invalid email address'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  employmentType: z.string().min(1, 'Employment type is required'),
  employerName: z.string().optional(),
  monthlyIncome: z.number().min(0, 'Income must be positive'),
  existingEmis: z.number().min(0, 'EMIs must be positive'),
  isMobileVerified: z.boolean().refine((val) => val === true, 'Mobile must be verified'),
  isPanVerified: z.boolean().refine((val) => val === true, 'PAN must be verified'),
  isAadhaarVerified: z.boolean().refine((val) => val === true, 'Aadhaar must be verified'),
  signature: z
    .string()
    .nullable()
    .refine((val) => val !== null, 'Digital signature is required'),
  consent: z.boolean().refine((val) => val === true, 'Consent is required'),
});

export default coApplicantSchema;
