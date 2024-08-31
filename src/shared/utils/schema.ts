import { ZodSchema } from 'zod';
import { SchemaValidationError } from '../helpers/http/error';
import { ErrorCode } from '../error/codes';

export const validateWithSchema = <T>(data: unknown, schema: ZodSchema<T>): T => {
  const validated = schema.safeParse(data);

  if (!validated.success) {
    throw new SchemaValidationError(
      'The provided body has some issues, fix them and try again.',
      ErrorCode.INVALID_BODY_PROVIDED,
      validated.error.issues
    );
  }

  return validated.data;
};
