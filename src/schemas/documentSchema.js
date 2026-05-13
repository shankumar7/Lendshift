import { z } from 'zod';

const documentSchema = z.object({
  agreementAccepted: z.boolean().refine((val) => val === true, 'You must accept the agreement'),
  primarySignature: z
    .string()
    .nullable()
    .refine((val) => val !== null, 'Digital signature is required'),
  // Files are handled by custom validation since they are objects/blobs
});

export default documentSchema;
