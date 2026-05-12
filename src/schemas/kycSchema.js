import { z } from 'zod';

const kycSchema = z.object({
  panNumber: z
    .string()
    .length(10, 'PAN card must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format (e.g., ABCDE1234F)'),
  aadhaarNumber: z
    .string()
    .length(12, 'Aadhaar number must be 12 digits')
    .regex(/^\d{12}$/, 'Invalid Aadhaar number'),
  idType: z.enum(['passport', 'voter-id', 'driving-license'], {
    errorMap: () => ({ message: 'Please select a government ID type' }),
  }),
  idNumber: z.string().min(5, 'Please enter a valid ID number'),
  isPanVerified: z.boolean().refine((val) => val === true, 'PAN verification is required'),
  isAadhaarVerified: z.boolean().refine((val) => val === true, 'Aadhaar verification is required'),
  isFaceVerified: z.boolean().refine((val) => val === true, 'Face matching is required'),
});

export default kycSchema;
