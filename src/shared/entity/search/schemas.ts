import { z } from 'zod';
import { TextQueryRequestPayload } from './models';

// TODO: Filters should be the actual tuple instead.
export const TextQuerySchema = z.object({
  sequence: z.string().optional(),
  regex: z.string().optional(),
  metadata: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(),
  length: z.string().optional()
})
  .refine((data) => data.sequence || data.regex, 'Either sequence or regex must be provided.')
  .refine((data) => (data.sequence && !data.regex) || (!data.sequence && data.regex), 'Only one of sequence or regex must be provided.') as z.ZodType<TextQueryRequestPayload>;
