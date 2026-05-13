import { z } from 'zod';

const addressSchema = z.object({
  current: z
    .object({
      addressLine1: z.string().min(5, 'Address Line 1 must be at least 5 characters').trim(),
      addressLine2: z.string().optional().trim(),
      landmark: z.string().optional().trim(),
      city: z.string().min(2, 'City is required').trim(),
      state: z.string().min(2, 'State is required').trim(),
      country: z.string().min(2, 'Country is required').trim(),
      pincode: z
        .string()
        .length(6, 'PIN code must be exactly 6 digits')
        .regex(/^\d+$/, 'Invalid PIN code'),
      residenceType: z.enum(['Owned', 'Rented', 'Family Owned', 'Company Provided'], {
        required_error: 'Residence type is required',
      }),
      monthlyRent: z.string().optional(),
      landlordName: z.string().optional(),
      durationAtAddress: z.enum(['Less than 1 year', '1–3 years', '3–5 years', '5+ years'], {
        required_error: 'Duration at current address is required',
      }),
    })
    .refine(
      (data) => {
        if (data.residenceType === 'Rented') {
          return !!data.monthlyRent && !!data.landlordName;
        }
        return true;
      },
      {
        message: 'Monthly rent and landlord name are required for rented residences',
        path: ['monthlyRent'],
      }
    ),
  previous: z
    .object({
      addressLine1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      duration: z.string().optional(),
    })
    .optional(),
  permanent: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      landmark: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
  isPermanentSameAsCurrent: z.boolean(),
  isGeoVerified: z.boolean(),
  addressProofType: z.string().min(1, 'Address proof type is required'),
});

export default addressSchema;
