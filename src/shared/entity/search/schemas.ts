import { z } from 'zod';
import { TextQueryRequestPayload } from './models';

const checkString = (value: unknown): value is string => {
  return typeof value === 'string';
};

// TODO: Filters should be the actual tuple instead.
export const TextQuerySchema = z.object({
  sequence: z.string().optional(),
  regex: z.string().optional(),
  metadata: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(),
  length: z.string().optional()
})
  .refine((data) => checkString(data.sequence) || checkString(data.regex), 'Either sequence or regex must be provided.')
  .refine((data) => (checkString(data.sequence) && !checkString(data.regex)) || (!checkString(data.sequence) && checkString(data.regex)), 'Only one of sequence or regex must be provided.') as z.ZodType<TextQueryRequestPayload>;
