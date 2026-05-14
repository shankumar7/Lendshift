import { z } from 'zod';

const personalInfoSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .regex(/^[A-Za-z]+$/, 'Only alphabets are allowed'),
    middleName: z
      .string()
      .trim()
      .regex(/^[A-Za-z]*$/, 'Only alphabets are allowed')
      .optional()
      .or(z.literal('')),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .regex(/^[A-Za-z]+$/, 'Only alphabets are allowed'),
    dob: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const now = new Date();
        let age = now.getFullYear() - year;
        const m = now.getMonth() + 1 - month;
        if (m < 0 || (m === 0 && now.getDate() < day)) {
          age -= 1;
        }
        return age >= 21;
      }, 'Applicant must be at least 21 years old')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const now = new Date();
        let age = now.getFullYear() - year;
        const m = now.getMonth() + 1 - month;
        if (m < 0 || (m === 0 && now.getDate() < day)) {
          age -= 1;
        }
        return age <= 65;
      }, 'Applicant cannot be older than 65 years'),
    gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
      errorMap: () => ({ message: 'Please select your gender' }),
    }),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
      errorMap: () => ({ message: 'Please select your marital status' }),
    }),
    spouseName: z.string().trim().optional(),
    mobileNumber: z
      .string()
      .length(10, 'Mobile number must be exactly 10 digits')
      .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    altMobileNumber: z
      .string()
      .length(10, 'Mobile number must be exactly 10 digits')
      .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
      .optional()
      .or(z.literal('')),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    panCard: z
      .string()
      .trim()
      .length(10, 'PAN card must be 10 characters')
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN card format (e.g., ABCDE1234F)')
      .refine((val) => {
        if (val.length !== 10) return true; // Handled by length/regex
        const validEntityTypes = ['C', 'P', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'];
        return validEntityTypes.includes(val[3].toUpperCase());
      }, 'PAN 4th character must indicate entity type (P for Individual, C for Company, etc.)')
      .transform((val) => val.toUpperCase()),
    aadhaar: z
      .string()
      .trim()
      .length(12, 'Aadhaar number must be 12 digits')
      .regex(/^\d{12}$/, 'Invalid Aadhaar number'),
    occupation: z.enum(['salaried', 'self-employed', 'student', 'retired', 'business-owner'], {
      errorMap: () => ({ message: 'Please select your occupation' }),
    }),
    education: z.enum(['high-school', 'graduate', 'post-graduate', 'doctorate'], {
      errorMap: () => ({ message: 'Please select your education level' }),
    }),
    annualIncome: z
      .number({ required_error: 'Annual income is required' })
      .min(100000, 'Minimum annual income should be ₹1,00,000'),
  })
  .refine(
    (data) => {
      if (data.maritalStatus === 'married' && (!data.spouseName || data.spouseName.length < 2)) {
        return false;
      }
      return true;
    },
    {
      message: 'Spouse name is required for married status',
      path: ['spouseName'],
    }
  )
  .refine(
    (data) => {
      if (data.altMobileNumber && data.altMobileNumber === data.mobileNumber) {
        return false;
      }
      return true;
    },
    {
      message: 'Alternate number cannot be same as primary',
      path: ['altMobileNumber'],
    }
  );

export default personalInfoSchema;
